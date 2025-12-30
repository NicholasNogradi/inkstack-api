import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { booksTable } from "../db/schema.ts";
import { asc, eq} from "drizzle-orm";



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