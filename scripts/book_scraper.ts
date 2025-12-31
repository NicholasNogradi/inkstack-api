import axios from 'axios'
import * as cheerio from 'cheerio'
import { promises as fs } from 'fs';

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
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
      const response = await axios.get(url);
      const items = response.data.items || [];

      for (const item of items) {
        const info = item.volumeInfo || {};
        const identifiers = info.industryIdentifiers || [];
        const isbn = identifiers.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10');

        this.books.push({
          title: info.title || '',
          author: info.authors ? info.authors.join(', ') : '',
          ISBN: isbn ? isbn.identifier : '',
          description: info.description || ''
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
  async saveToJSON(filename = 'books.json') {
    try {
      const jsonData = JSON.stringify(this.books, null, 2);
      await fs.writeFile(filename, jsonData, 'utf8');
      console.log(`\n✓ Saved ${this.books.length} books to ${filename}`);
    } catch (err) {
      console.error(`✗ Error saving to JSON: ${err.message}`);
    }
  }

  // Main scraping function
  async scrapeAll(query) {
    console.log(`\nScraping books for query: "${query}"\n`);
    
    // await this.scrapeOpenLibrary(query);
    await this.scrapeGoogleBooks(query);
    // await this.scrapeGoodreads(query);
    
    await this.saveToJSON();
    
    console.log('\n--- Sample Books ---');
    console.log(JSON.stringify(this.books.slice(0, 3), null, 2));
  }
}

// Usage
const scraper = new BookScraper();
const searchQuery = process.argv[2] || 'javascript programming';

scraper.scrapeAll(searchQuery).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});