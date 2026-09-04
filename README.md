# 📚 Manga Scraper & Reader (Web UI)

A powerful, self-hosted Manga Scraper and Reader. Built with a Node.js/Express backend and a fast Vite frontend, it uses Puppeteer to bypass protections, scrape manga, and manage your library in a clean web interface.

## ✨ Features

- 🖥️ **Web Interface** - Clean, responsive UI to browse, search, and read your manga.
- 📖 **Built-in Reader** - Read downloaded chapters instantly with customizable reading directions and modes.
- 🛡️ **Cloudflare Bypass** - Uses Puppeteer & FlareSolverr concepts to reliably scrape protected sites.
- 🗄️ **SQLite Database** - Fast, reliable storage for bookmarks, reading progress, and favorites.
- 📥 **Background Downloader** - Queue chapters and download them reliably in the background without keeping the page open.
- 🐳 **Docker Support** - Easily deployable to a home server, NAS, or Seedbox.
- 🔌 **Modular Scrapers** - Easily write and plug in new scrapers for different manga sites.
- 🌐 **Supported sites** - comix.to, mangahere.cc, weebcentral.com, nhentai.net and chained-soldier.live. The Scrapers page can search across them and browse the catalogs of mangahere, weebcentral and nhentai with each site's own sort options.

## 🚀 Getting Started

### Option 1: Docker (Recommended for Home Servers)

The easiest way to run the app 24/7 is using Docker Compose.

```bash
docker-compose up -d
```
The app will be available at `http://localhost:3000`. Your data and downloads will be saved in the `./data` and `./downloads` folders.

### Option 2: Local Install (Bare Metal)

If you want to run it directly on your machine:

1. **Install Dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ..
   ```

2. **Start the App:**
   ```bash
   # Starts both the backend and frontend in dev mode concurrently
   npm run dev
   ```

   The backend API runs on port 3000, and the Vite frontend will usually run on port 5173 (check your console output).

## 🛂 Sites that ask for a human check

comix.to sometimes stops serving automated browsers and shows a "verify you're human" puzzle instead (`/@waf/challenge`). The app cannot solve it, and nothing in a web page can read another site's cookies, so the hand-off works like this:

1. The scraper notices the puzzle, pauses automatic update checks for that site (for up to six hours, or until cleared), stops the running download at that chapter, and shows a banner (also on the task card in the queue).
2. **Open the site** from the banner and complete the check in your own browser.
3. **Paste cookies** (admin only): export the site's cookies from that browser (the Cookie-Editor extension's *Export → JSON* or *Header String*, or a Netscape `cookies.txt`; the console's `document.cookie` misses the HttpOnly cookie that matters) and paste them into the dialog. The dialog is prefilled with your browser's user agent; keep it, because the site ties its cookie to the browser identity. If you did the check on another device, paste that browser's user agent instead.
4. The server stores the cookies, loads the site once with them and tells you whether it is reachable again. Downloads that stopped on the check are retried from their task card in the queue (kept for a day, or until the server restarts).

Notes:
- The cookies (and user agent) are saved in plain text in `DATA_DIR/site-sessions.json` and re-applied on every scrape, so they survive restarts. While a session is saved, FlareSolverr is skipped for that site (its own browser identity would not match the cookies). The site keeps renewing the cookies during successful scrapes; the app saves the renewed values.
- If the site starts showing the puzzle again, the banner says the saved cookies were rejected: complete the check again and paste fresh ones. The site may also tie the cookie to the IP address, so do the check from a device on the same network as the server when possible.
- The **Scrapers** page shows which sites have a saved session and lets an admin forget it. The scraper's browser profile (in the container's temp dir) holds a second copy of the cookies while they are in use; forgetting removes them from there too, and says so if it could not.

## 🏗️ Architecture & Stack

- **Database:** SQLite (`better-sqlite3`)
- **Backend:** Node.js, Express, Socket.io (for real-time queue updates), Puppeteer (for scraping)
- **Frontend:** Vite, Vanilla JavaScript, CSS

### Adding New Scrapers

Scrapers are highly modular. To add a new site:
1. Create a new file in `src/scrapers/sites/`.
2. Implement the `getMangaInfo` and chapter extraction features.
3. The app will automatically load and use the scraper for matching URLs!

## 🧪 Testing

We have moved all the loose debug and test scripts into the `testfiles/` directory. If you are developing a new scraper or debugging an issue, check there for helpful standalone scripts:

```bash
node testfiles/test-scrapers.js
node testfiles/test-download.js
```

## 🤖 About the Code (AI Acknowledgment)

> **Note to Developers:** The core architectural choices, feature designs, and product vision for this project are my own, but the actual code implementation was built with heavy reliance on AI coding assistants. Because of this, experienced developers exploring the codebase might find areas that aren't perfectly idiomatic or highly optimized.
> 
> I am leaving it open-source and actively encourage anyone with experience to look around, submit PRs, and help optimize the performance or structure!

## 📝 License

MIT License
