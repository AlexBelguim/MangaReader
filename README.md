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
- 🧩 **Combine chapters** - A scanlation's 12.1 / 12.2 / 12.3 can be folded into one chapter 12 with its own name (Combine on the manga page); the parts move to the Hidden filter and a combined chapter can be split again.
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

## 🧲 Volume releases via Prowlarr and qBittorrent

Weekly chapters come from the scrapers; whole volumes can come from torrents, the way Sonarr and Radarr work: Prowlarr is the indexer layer, qBittorrent the download client, and this app decides what to grab and imports the result.

Setup (admin, **Settings → Torrents**):
1. **Prowlarr**: its URL and API key (Prowlarr → Settings → General). Nyaa's "Literature – English-translated" is the usual indexer for manga; enable it in Prowlarr.
2. **qBittorrent**: the Web UI URL and login, a category (default `manga`) and optionally a save path as qBittorrent sees it.
3. **Path mappings**: qBittorrent reports where it saved a download using *its* paths. If this app sees that folder under a different path (another container mount, a network share), map the prefix, e.g. `/downloads` → `/app/torrents`. The app container must have the finished-downloads folder mounted.
4. Use **Test connection** for both, then save.

Using it:
- On a manga page, **Find volumes** searches the indexers for that title. On the Scrapers page, **Volumes** next to the search box searches any title and lets you pick a library series or start a new one.
- Each release shows the parsed volume number, size, seeders and indexer. **Grab** sends it to qBittorrent; progress shows on the Queue page under Torrents, with pause, resume, remove and a manual **Import now**.
- When a download finishes it is imported automatically (or by hand): every `.cbz`/`.zip` in it becomes a **volume release** with its own pages under `<manga folder>/Volume NN/`, with a cover from its first page. Chapter-shaped archives (`c001-c010`) become chapters instead. `.cbr`/`.rar` are not supported.
- Volumes on a manga page now come in two kinds: **chapter collections** (the original kind, a grouping of chapters) and **torrent/archive releases** (own pages). A release volume has a Read button and opens in the reader, which steps between release volumes with Prev/Next and remembers your page. Assign chapters to a release volume (the volume page's "Add chapters") and finishing it marks those chapters read, which is how a censored scanlation run and its uncensored volume can live side by side.

Torrent state is stored in the database (`torrent_downloads`), so it survives restarts; the qBittorrent password is stored there in plain text like the other integration settings.

Related library tools:
- **Import from folder** (manga page): import a release that is already on disk - in qBittorrent's save folder or under any path mapping - without downloading it again, for example after deleting a volume. Browse to the folder or `.cbz`, review what it imports as, import. The source files are never touched.
- **Chapter pages**: every downloaded chapter row shows its page count as a pill; it opens a grid of the pages with the page tools (rotate, cut a spread in two, swap, delete), the same tools the reader has. With several downloaded versions the grid switches between them.
- **Downloads folder cleanup** (Settings, admin): scan the downloads folder for leftovers nothing refers to any more - chapter versions whose download was removed, folders of deleted volumes, series folders left behind by a renamed alias, unfinished imports - with sizes, and delete what you tick. Nothing is deleted without ticking it, and only what a fresh scan still calls a leftover.

## 🛂 Sites that ask for a human check

comix.to sometimes stops serving automated browsers and shows a "verify you're human" puzzle instead (`/@waf/challenge`, a rotate-the-picture check that hands out a `waf_pass` cookie good for about a day). The app cannot solve it, but it can put a person in front of it and keep everything else waiting in the meantime:

1. The scraper notices the puzzle and **closes the site's gate**: every download and update check for that site waits in the queue (the task shows *Waiting for site* and why), while work for other sites keeps running. Nothing hammers the site meanwhile. A banner appears on every page, one per blocked site.
2. **Solve it here** (admin only, the banner, a waiting task card, or the Scrapers page): the server opens the site in the scraper's own headless browser and streams that page into a dialog in the app. Drag, click and type in the picture as if it were local. When the site accepts the check, the server keeps the cookies and browser identity as the site's session, opens the gate, and everything that was waiting resumes where it stopped. Because the check is passed by the very browser, identity and network address the scrapers use, the cookies fit by construction.
3. **Paste cookies** stays as the fallback (admin only): complete the check in your own browser, export the site's cookies (the Cookie-Editor extension's *Export → JSON* or *Header String*, a Netscape `cookies.txt`, or the `cookie:` request header from devtools; the console's `document.cookie` misses the HttpOnly cookie that matters) and paste them into the dialog together with that browser's user agent. The server loads the site once to test them. The site may tie the cookie to the IP address, so this works best from a device on the server's network.
4. **Retry anyway** opens the gate without solving; if the puzzle is still there the first attempt closes it again.

Notes:
- The gate also closes a few minutes **before the saved cookies expire** (`waf_pass` lives about a day, but the site renews it during successful scrapes and the app keeps the renewed value), so no scrape starts with a cookie that is about to run out. The banner then says the cookies expired; solve the check again and the waiting work resumes.
- With nobody solving it, a blocked site is tried again after six hours; if the puzzle is still there the gate closes for another six.
- The cookies (and user agent) are saved in plain text in `DATA_DIR/site-sessions.json` and re-applied on every scrape, so they survive restarts. While a session is saved, FlareSolverr is skipped for that site (its own browser identity would not match the cookies).
- Several sites can be blocked at once; each has its own gate, banner and streamed dialog. A scraper opts in by returning `supportsSession: true`, naming the cookie(s) the check hands out (`sessionCookieNames`) and recognising its check page (`isChallengeUrl`); see `src/scrapers/sites/comix.js` and the template.
- The streamed dialog talks to an admin-only socket namespace (`/assist`); the page it drives can only navigate within the site, lives at most ten minutes, and closes shortly after the last viewer leaves.
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
