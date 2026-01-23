import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs-extra';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve paths relative to root if they are not absolute
const resolvePath = (envPath, defaultPath) => {
  const p = envPath || defaultPath;
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
};

export const CONFIG = {
  // App settings
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Auth settings
  auth: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD, // Warning if missing handled in auth middleware
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod'
  },

  // Data storage paths
  dataDir: resolvePath(process.env.DATA_DIR, 'data'),
  downloadsDir: resolvePath(process.env.DOWNLOADS_DIR, 'downloads'),

  puppeteer: {
    headless: true, // Always headless in production typically
    executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  },

  // Request delays (rate limiting prevention)
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

// Ensure directories exist
fs.ensureDirSync(CONFIG.dataDir);
fs.ensureDirSync(CONFIG.downloadsDir);
