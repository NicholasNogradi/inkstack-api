import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/connection.ts'
import { usersTable } from '../db/schema.ts'; 
import { generateToken } from '../utils/jwt.ts';
import { eq } from 'drizzle-orm';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password, firstName, lastName} = req.body;

        // hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create user in db
        const [newUser] = await db
            .insert(usersTable)
            .values({
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email,
                username: usersTable.username,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                createdAt: usersTable.createdAt,
            })

            // Generate JWT for auto-login
            const token = await generateToken({
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            })

            res.status(201).json({
                message: "User created successfully",
                user: newUser,
                token
            })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({error: 'Failed to create user'})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body

        // Find user by email
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if(!user) {
            return res.status(401).json({ error: 'Invlaid credentials'})
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        })

        // Return user data and token
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token,
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Failed to login' })
    }
}