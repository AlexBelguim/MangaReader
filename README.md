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
