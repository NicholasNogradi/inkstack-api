import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { booksTable } from "../db/schema.ts";
import {  asc, eq, sql } from "drizzle-orm";



export const getAllBooks = async (req: Request, res: Response) => {
    try {
        

        const books = await db.query.booksTable.findMany({
            limit: 10,
            offset: 0,
            orderBy: [asc(booksTable.id)]
        })

        if(!books || books.length === 0) {
            return res.status(204).json({ error: 'No content'})
        }

        res.json({
            message: 'Found books',
            books
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
            where: eq(booksTable.id, id)
        })

        if(!book) {
            return res.status(404).json({ error: 'Book not found'})
        }

        res.json({
            book: book}
        )
    } catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({error: 'Failed to fetch book'})
    }
}

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
        const { title, author, ISBN, description, coverImage, stock } = req.body;

        // Validate that the required fields are present
        if(!title || !author || !ISBN) {
            return res.json({ error: "Title, author, and ISBN are required "})
        }

        // Query booksTable to check if book exists 
        const existingBook = await db.query.booksTable.findFirst({
            where: (eq(booksTable.ISBN, ISBN))
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

            res.status(201).json({
                message: "Book created successfully",
                book: newBook
            })
        
    } catch (error) {
        console.error('Creation error:', error)
        res.status(500).json({ error: 'Failed to create book'})
    }
}

// FIX ME: Create a delete controller 