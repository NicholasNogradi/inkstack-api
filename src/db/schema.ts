import { integer, pgTable, serial, text, timestamp, uuid, boolean, varchar, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable('user_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', {length: 255}).notNull().unique(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 50 }),
    lastName: varchar('last_name', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const booksTable = pgTable('book_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255}).notNull(),
    author: varchar('author', {length: 100}).notNull(),
    ISBN: varchar('isbn', {length: 13}).notNull().unique(),
    description: text('description'),
    coverImage: text('cover_image'),
    sales: integer('sales').notNull().default(0),
    stock: integer('stock').notNull().default(0),
    availability: boolean('availability').notNull().default(true), // Manual override
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoriesTable = pgTable('categories_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
});

export const bookCategoriesTable = pgTable('book_categories_table', {
    bookId: uuid('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey({ columns: [table.bookId, table.categoryId] }),
}));

export const favoritesTable = pgTable('favorites_table', {
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    bookId: uuid('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.bookId] }),
}));


export const usersRelations = relations(usersTable, ({ many }) => ({
    favorites: many(favoritesTable),
}));

export const booksRelations = relations(booksTable, ({ many }) => ({
    categories: many(bookCategoriesTable),
    favorites: many(favoritesTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
    books: many(bookCategoriesTable),
}));

export const bookCategoriesRelations = relations(bookCategoriesTable, ({ one }) => ({
    book: one(booksTable, {
        fields: [bookCategoriesTable.bookId],
        references: [booksTable.id],
    }),
    category: one(categoriesTable, {
        fields: [bookCategoriesTable.categoryId],
        references: [categoriesTable.id],
    }),
}));

export const favoritesRelations = relations(favoritesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [favoritesTable.userId],
        references: [usersTable.id],
    }),
    book: one(booksTable, {
        fields: [favoritesTable.bookId],
        references: [booksTable.id],
    }),
}));