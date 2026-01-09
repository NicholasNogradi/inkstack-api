import axios from 'axios'
import * as cheerio from 'cheerio'
import { promises as fs } from 'fs';

const categories = [
  { id: 'all', name: 'All Categories'},
  { id: 'sci-fi', name: 'Science Fiction' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'romance', name: 'Romance' },
  { id: 'historical', name: 'Historical Fiction' },
  { id: 'biography', name: 'Biography' },
  { id: 'self-help', name: 'Self-Help' },
  { id: 'business', name: 'Business' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'poetry', name: 'Poetry' },
  { id: 'horror', name: 'Horror' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'dystopian', name: 'Dystopian' },
];

class BookScraper {
  constructor() {
    this.books = [];
  }

  // Scrape from Open Library
//   async scrapeOpenLibrary(query) {
//     try {
//       const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
//       const response = await axios.get(url);
//       const docs = response.data.docs || [];

//       for (const doc of docs) {
//         this.books.push({
//           title: doc.title || '',
//           author: doc.author_name ? doc.author_name.join(', ') : '',
//           ISBN: doc.isbn ? doc.isbn[0] : '',
//           description: doc.first_sentence ? doc.first_sentence.join(' ') : ''
//         });
//       }
      
//       console.log(`✓ Scraped ${docs.length} books from Open Library`);
//     } catch (err) {
//       console.error(`✗ Error scraping Open Library: ${err.message}`);
//     }
//   }

  // Scrape from Google Books API
  async scrapeGoogleBooks(query) {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`;
      const response = await axios.get(url);
      console.log("Google Books API response data:", response.data);
      const items = response.data.items || [];
      // console.log("items:", items);

      for (const item of items) {
        const info = item.volumeInfo || {};
        const salesInfo = item.saleInfo || {};
        const identifiers = info.industryIdentifiers || [];
        const isbn = identifiers.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10');
        
        this.books.push({
          title: info.title || '',
          author: info.authors ? info.authors.join(', ') : '',
          ISBN: isbn ? isbn.identifier : '',
          description: info.description || '',
          imageLinks: info.imageLinks ? info.imageLinks.thumbnail || {} : {},
          pageCount: info.pageCount || 0,
          categories: info.categories ? info.categories.join(', ') : '',
          averageRating: info.averageRating || 0,
          ratingsCount: info.ratingsCount || 0,
          salesInfo: {
            country: salesInfo.country || '',
            saleability: salesInfo.saleability || '',
            isEbook: salesInfo.isEbook || false,
            price: salesInfo.listPrice ? salesInfo.listPrice.amount || 0 : 0,
          }
        });
      }
      
      console.log(`✓ Scraped ${items.length} books from Google Books`);
    } catch (err) {
      console.error(`✗ Error scraping Google Books: ${err.message}`);
    }
  }

  // Scrape from Goodreads (HTML scraping)
//   async scrapeGoodreads(query) {
//     try {
//       const url = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;
//       const response = await axios.get(url, {
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//         }
//       });
      
//       const $ = cheerio.load(response.data);
//       const bookElements = $('.bookTitle').slice(0, 10);
      
//       bookElements.each((i, el) => {
//         const title = $(el).text().trim();
//         const author = $(el).closest('tr').find('.authorName').text().trim();
        
//         this.books.push({
//           title: title || '',
//           author: author || '',
//           ISBN: '',
//           description: ''
//         });
//       });
      
//       console.log(`✓ Scraped ${bookElements.length} books from Goodreads`);
//     } catch (err) {
//       console.error(`✗ Error scraping Goodreads: ${err.message}`);
//     }
//   }

  // Save books to JSON file
  async saveToJSON(filename = './scripts/books.json') {
     try {
      let existingBooks = [];
      
      // Try to read existing file
      try {
        const fileContent = await fs.readFile(filename, 'utf8');
        existingBooks = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist or is invalid JSON, start with empty array
        existingBooks = [];
      }
      
      // Append new books to existing array
      const allBooks = [...existingBooks, ...this.books];
      
      const jsonData = JSON.stringify(allBooks, null, 3);
      await fs.writeFile(filename, jsonData, 'utf8');
      console.log(`\n✓ Saved ${this.books.length} new books to ${filename} (Total: ${allBooks.length})`);
    } catch (err) {
      console.error(`✗ Error saving to JSON: ${err.message}`);
    }
  }

  // Main scraping function
  async scrapeAll() {
    
    for (const category of categories) {
      const categoryQuery = category.name;
      console.log(`\n--- Scraping Category: ${category.name} ---`);
      
      // await this.scrapeOpenLibrary(categoryQuery);
      await this.scrapeGoogleBooks(categoryQuery);
      // await this.scrapeGoodreads(categoryQuery);
    }
    
    
    await this.saveToJSON();
    
    console.log('\n--- Sample Books ---');
    console.log(JSON.stringify(this.books.slice(0, 4), null, 2));
  }
}

// Usage
const scraper = new BookScraper();


scraper.scrapeAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});