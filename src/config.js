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

  // FlareSolverr - Cloudflare bypass proxy
  flareSolverrUrl: process.env.FLARESOLVERR_URL || 'http://localhost:8191/v1',

  // AniList OAuth2 (reading-progress sync). Register a client at
  // https://anilist.co/settings/developer with redirect URI
  // http://<host>:<port>/api/anilist/callback
  anilist: {
    clientId: process.env.ANILIST_CLIENT_ID || '',
    clientSecret: process.env.ANILIST_CLIENT_SECRET || ''
  },

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
  },

  // Reading direction, used when a downloaded double-page spread is split
  // into two single pages.
  //
  // 'rtl' (manga): the RIGHT half is the earlier page.
  // 'ltr' (western comics): the LEFT half is the earlier page.
  //
  // This must match how the reader pairs pages back into spreads, otherwise
  // every scraped spread reads back-to-front. The reader defaults to RTL, so
  // this does too. Only affects NEW downloads — chapters already on disk keep
  // whatever order they were split with.
  readingDirection: (process.env.READING_DIRECTION || 'rtl').toLowerCase() === 'ltr' ? 'ltr' : 'rtl'
};

// Ensure directories exist
fs.ensureDirSync(CONFIG.dataDir);
fs.ensureDirSync(CONFIG.downloadsDir);
