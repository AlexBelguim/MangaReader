import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  // Data storage paths
  dataDir: '/home/alexw/pupeteer/data/',
  downloadsDir: '/mnt/smb/Apps/manga/media/downloads',


  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    defaultViewport: null,  // Use browser's default viewport
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
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
