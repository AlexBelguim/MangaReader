import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  // Data storage paths
  dataDir: path.join(__dirname, '..', 'data'),
  bookmarksFile: path.join(__dirname, '..', 'data', 'bookmarks.json'),
  downloadsDir: path.join(__dirname, '..', 'downloads'),

  // Puppeteer settings
  puppeteer: {
    headless: true,
    defaultViewport: null,  // Use browser's default viewport
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  },

  // Request delays to avoid rate limiting (in ms)
  delays: {
    betweenPages: 1000,
    betweenChapters: 2000,
    betweenImages: 500
  },

  // Retry settings
  retries: {
    maxAttempts: 3,
    delayBetweenRetries: 2000
  }
};
