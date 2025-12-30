import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

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
    await sql`
      INSERT INTO book_table (id, title, author, isbn, description, cover_image) VALUES
      ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'The Midnight Library', 'Matt Haig', '9780525559474', 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.', 'https://images.example.com/midnight-library.jpg'),
      ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Project Hail Mary', 'Andy Weir', '9780593135204', 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.', 'https://images.example.com/project-hail-mary.jpg'),
      ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'The Silent Patient', 'Alex Michaelides', '9781250301697', 'Alicia Berenson''s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house. One evening her husband Gabriel returns home late, and Alicia shoots him five times in the face, and then never speaks another word.', 'https://images.example.com/silent-patient.jpg'),
      ('13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Dune', 'Frank Herbert', '9780441172719', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.', 'https://images.example.com/dune.jpg'),
      ('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'The Name of the Wind', 'Patrick Rothfuss', '9780756404741', 'Told in Kvothe''s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.', 'https://images.example.com/name-of-wind.jpg'),
      ('15eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Educated', 'Tara Westover', '9780399590504', 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her quest for knowledge transformed her, taking her over oceans and across continents.', 'https://images.example.com/educated.jpg'),
      ('16eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Atomic Habits', 'James Clear', '9780735211292', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving every day.', 'https://images.example.com/atomic-habits.jpg'),
      ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '9781501161933', 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.', 'https://images.example.com/evelyn-hugo.jpg'),
      ('18eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Where the Crawdads Sing', 'Delia Owens', '9780735219090', 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast.', 'https://images.example.com/crawdads-sing.jpg'),
      ('19eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'The Lincoln Highway', 'Amor Towles', '9780735222359', 'In June, 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months.', 'https://images.example.com/lincoln-highway.jpg'),
      ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'Sapiens', 'Yuval Noah Harari', '9780062316110', 'From a renowned historian comes a groundbreaking narrative of humanity''s creation and evolution that explores the ways in which biology and history have defined us.', 'https://images.example.com/sapiens.jpg'),
      ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'The Thursday Murder Club', 'Richard Osman', '9781984880987', 'In a peaceful retirement village, four unlikely friends meet weekly to investigate unsolved killings. But when a local developer is found dead, the Thursday Murder Club find themselves in the middle of their first live case.', 'https://images.example.com/thursday-murder.jpg')
    `;

    // Insert Book Categories
    console.log('Inserting book categories...');
    await sql`
      INSERT INTO book_categories_table (book_id, category_id) VALUES
      ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
      ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
      ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
      ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
      ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
      ('13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
      ('13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
      ('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
      ('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ('15eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'fbeebc99-9c0b-4ef8-bb6d-6bb9bd380a77'),
      ('15eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'fceebc99-9c0b-4ef8-bb6d-6bb9bd380a88'),
      ('16eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'fbeebc99-9c0b-4ef8-bb6d-6bb9bd380a77'),
      ('16eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'feeebc99-9c0b-4ef8-bb6d-6bb9bd380aaa'),
      ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'faeebc99-9c0b-4ef8-bb6d-6bb9bd380a66'),
      ('18eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ('18eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
      ('19eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'fbeebc99-9c0b-4ef8-bb6d-6bb9bd380a77'),
      ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'fdeebc99-9c0b-4ef8-bb6d-6bb9bd380a99'),
      ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
      ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    `;

    // Insert Favorites
    console.log('Inserting favorites...');
    await sql`
      INSERT INTO favorites_table (user_id, book_id, created_at) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-10 15:30:00'),
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2024-03-12 10:20:00'),
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '16eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '2024-03-15 14:45:00'),
      ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-03-08 09:15:00'),
      ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', '2024-03-11 16:30:00'),
      ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '18eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', '2024-03-14 11:00:00'),
      ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '15eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '2024-03-16 13:20:00'),
      ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '12eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '2024-03-09 12:45:00'),
      ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '21eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', '2024-03-13 15:10:00'),
      ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '20eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', '2024-03-17 10:30:00'),
      ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2024-03-07 14:20:00'),
      ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2024-03-10 11:40:00'),
      ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '19eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', '2024-03-15 09:50:00'),
      ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-11 16:00:00'),
      ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '13eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2024-03-14 13:30:00')
    `;

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 5 users');
    console.log('  - 10 categories');
    console.log('  - 12 books');
    console.log('  - 23 book-category relationships');
    console.log('  - 15 favorites');

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