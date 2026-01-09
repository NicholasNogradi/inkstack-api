import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { bookCategoriesTable, booksTable, categoriesTable } from "../db/schema.ts";
import {  asc, eq, sql, like, or } from "drizzle-orm";


// Fix Limit and offset
export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const offset = parseInt(req.query.offset as string) || 0;
        const author = req.query.author as string;
        const title = req.query.title as string;

        if(limit < 0 || limit > 100) {
            return res.status(400).json({ error: 'Limit must be between 1 and 100' })
        }

        if (offset < 0) {
            return res.status(400).json({ error: 'Offset must be 0 or greater' });
        }

        // Build where conditions dynamically
        const conditions = [];
        
        if (title) {
            conditions.push(like(booksTable.title, `%${title}%`));
        }
        
        if (author) {
            conditions.push(like(booksTable.author, `%${author}%`));
        }

        const books = await db.query.booksTable.findMany({
            limit: limit,
            offset: offset,
            orderBy: [asc(booksTable.id)],
            where: conditions.length > 0 ? or(...conditions) : undefined,
            with: {
                categories: {
                    with: {
                        category: true 
                    }
                }
            }
        })

        if(!books || books.length === 0) {
            return res.status(204).json({ error: 'No content'})
        }

        const booksWithCategories = books.map(book => ({
            ...book,
            categories: book.categories.map(bc => bc.category)
        }))

        res.json({
            message: 'Found books',
            books: booksWithCategories,
            pagination: {
                limit,
                offset,
                count: books.length
            }
        })
    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({ error: 'Failed to retrieve'})
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const book = await db.query.booksTable.findFirst({
            where: eq(booksTable.id, id),
            with: {
                categories: {
                    with: {
                        category: true
                    }
                }
            }
        })

        if(!book) {
            return res.status(404).json({ error: 'Book not found'})
        }
        // Transform to include categories directly
        const bookWithCategories = {
            ...book,
            categories: book.categories.map(bc => bc.category)
        };

        res.json({
            book: bookWithCategories
        })
    } catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({error: 'Failed to fetch book'})
    }
}

export const getBooksByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        const bookCategories = await db.query.bookCategoriesTable.findMany({
            where: eq(bookCategoriesTable.categoryId, categoryId),
            with: {
                book: true
            }
        })

        if(!bookCategories || bookCategories.length === 0) {
            return res.status(404).json({ error: 'No books found in this category'})
        }

        const books = bookCategories.map(bc => bc.book);

        res.json({
            message: 'Found books in category',
            books
        })
    } catch (error) {
        
    }
}

// Get books by category name
export const getBooksByCategoryName = async (req: Request, res: Response) => {
    try {
        const { categoryName } = req.params;

        

        // First find the category
        const category = await db.query.categoriesTable.findFirst({
            where: eq(categoriesTable.name, categoryName)
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Then find books in that category
        const bookCategories = await db.query.bookCategoriesTable.findMany({
            where: eq(bookCategoriesTable.categoryId, category.id),
            with: {
                book: true
            }
        });

        const books = bookCategories.map(bc => bc.book);

        res.json({
            message: `Found books in category: ${categoryName}`,
            books
        });
    } catch (error) {
        console.error('Get books by category name error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

export const updateBook = async ( req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, author, ISBN, description, coverImage, stock, availability } = req.body;

            // Update the book
            const [updatedBook] = await db
                .update(booksTable)
                .set({
                    title,
                    author,
                    ISBN,
                    description,
                    coverImage,
                    stock,
                    availability
                })
                .where(eq(booksTable.id, id))
                .returning({
                    title: booksTable.title,
                    author: booksTable.author,
                    ISBN: booksTable.ISBN,
                    description: booksTable.description,
                    coverImage: booksTable.coverImage,
                    stock: booksTable.stock,
                    availability: booksTable.availability
                })

            if(!updatedBook) { throw new Error ('Book not found') }

        res.json({
            message: 'Book updated successfully',
            book: updatedBook
        })

    } catch (error) {
         if (error.message === 'Book not found') {
            return res.status(404).json({ error: 'Book not found' })
        }
        console.error('Update book error:', error)
        res.status(500).json({ error: 'Failed to update book' })
    }
}

// Helper function
export const updateBookStock = async (ISBN: string, stockToAdd: number) => {
    const [updatedBook] = await db
        .update(booksTable)
        .set({
            stock: sql`${booksTable.stock} + ${stockToAdd}`
        })
        .where(eq(booksTable.ISBN, ISBN))
        .returning();
    
    return updatedBook;
}

export const createBook = async (req: Request, res: Response) => {
    try {
        const { title, author, ISBN, description, coverImage, stock, categoryIds } = req.body;

        // Validate that the required fields are present
        if(!title || !author || !ISBN) {
            return res.json({ error: "Title, author, and ISBN are required "})
        }

        // Query booksTable to check if book exists 
        const existingBook = await db.query.booksTable.findFirst({
            where: eq(booksTable.ISBN, ISBN)
        })
        
        // If book exists update book stock using helper function
        if(existingBook) {
            const stockToAdd = stock || 1; 

            const updatedBook = await updateBookStock(ISBN, stockToAdd)

            return res.status(200).json({
                message: 'Book already exists. Stock increased.',
                book: updatedBook,
                stockAdded: stockToAdd
            });
        }

        // If book does not exist create new book in database
        const [newBook] = await db
            .insert(booksTable)
            .values({
                title,
                author,
                ISBN,
                description,
                coverImage,
                stock: stock || 1,
                sales: 0
            })
            .returning({
                id: booksTable.id,
                title: booksTable.title,
                author: booksTable.author,
                ISBN: booksTable.ISBN,
                description: booksTable.description,
                coverImage: booksTable.coverImage,
                stock: booksTable.stock
            })

            if(categoryIds && categoryIds.length > 0) {
                const bookCategoryValues = categoryIds.map((categoryId: string) => ({
                    bookId: newBook.id,
                    categoryId: categoryId
                }));

                await db
                    .insert(bookCategoriesTable)
                    .values(bookCategoryValues);
            }

            // Fetch the book with categories
            const bookWithCategories = await db.query.booksTable.findFirst({
                where: eq(booksTable.id, newBook.id),
                with: {
                    categories: {
                        with: {
                            category: true
                        }
                    }
                }
            });

            res.status(201).json({
                message: "Book created successfully",
                book: {
                    ...bookWithCategories,
                    categories: bookWithCategories?.categories.map(bc => bc.category)
                }
            });
        
    } catch (error) {
        console.error('Creation error:', error)
        res.status(500).json({ error: 'Failed to create book'})
    }
}

// FIX ME: Create a delete controller 