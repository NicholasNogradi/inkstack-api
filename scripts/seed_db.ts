import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = neon(process.env.DATABASE_URL!);

async function seedBooksFromJSON() {
  const booksPath = path.join(__dirname, 'books.json');
  const booksData = JSON.parse(readFileSync(booksPath, 'utf-8'));
  
  for (const book of booksData) {
    if (!book.title || !book.author) continue; // Skip incomplete entries

    const price = Math.round((book.saleInfo?.price || 0) * 100);
    const averageRating = Math.round((book.averageRating || 0) * 10);
    
    await sql`
      INSERT INTO book_table (title, author, isbn, description, cover_image, page_count, average_rating, ratings_count, is_ebook, price, saleability, country)
      VALUES (
        ${book.title},
        ${book.author || 'Unknown'},
        ${book.ISBN || null},
        ${book.description || null},
        ${book.imageLinks || null},
        ${book.pageCount || 0},
        ${averageRating || 0},
        ${book.ratingsCount || 0},
        ${book.salesInfo?.isEbook || false},
        ${price}, -- Convert to cents
        ${book.salesInfo?.saleability || 'UNKNOWN'},
        ${book.salesInfo?.country || 'US'}
      )
    `;
    
    // Handle categories
    if (book.categories) {
      const categoryNames = book.categories.split(',').map(c => c.trim()).filter(c => c);
      for (const categoryName of categoryNames) {
        // Find or create category
        const [category] = await sql`
          INSERT INTO categories_table (name) 
          VALUES (${categoryName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id;
        `;
        
        // Link book to category
        await sql`
          INSERT INTO book_categories_table (book_id, category_id)
          SELECT id, ${category.id} FROM book_table WHERE title = ${book.title}
          ON CONFLICT DO NOTHING;
        `;
      }
    }
  }
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await sql`DELETE FROM favorites_table`;
    await sql`DELETE FROM book_categories_table`;
    await sql`DELETE FROM book_table`;
    await sql`DELETE FROM categories_table`;
    await sql`DELETE FROM user_table`;

    // Insert Users
    console.log('Inserting users...');
    await sql`
      INSERT INTO user_table (id, email, username, password, first_name, last_name, created_at, updated_at) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john.doe@example.com', 'johndoe', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
      ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'jane.smith@example.com', 'janesmith', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', '2024-01-20 14:20:00', '2024-01-20 14:20:00'),
      ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike.johnson@example.com', 'mikej', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike', 'Johnson', '2024-02-01 09:15:00', '2024-02-01 09:15:00'),
      ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'sarah.williams@example.com', 'sarahw', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah', 'Williams', '2024-02-10 16:45:00', '2024-02-10 16:45:00'),
      ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'david.brown@example.com', 'davidb', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David', 'Brown', '2024-03-05 11:00:00', '2024-03-05 11:00:00')
    `;

    // Insert Categories
    console.log('Inserting categories...');
    await sql`
      INSERT INTO categories_table (id, name) VALUES
      ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fiction'),
      ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Science Fiction'),
      ('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Fantasy'),
      ('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Mystery'),
      ('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Thriller'),
      ('faeebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Romance'),
      ('fbeebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Non-Fiction'),
      ('fceebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Biography'),
      ('fdeebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'History'),
      ('feeebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'Self-Help')
    `;

    // Insert Books
    console.log('Inserting books...');
    await seedBooksFromJSON();

    console.log('✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });