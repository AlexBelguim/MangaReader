/**
 * Assisted solve: let a person pass a site's human-verification check
 * inside the scraper's own browser, from the app.
 *
 * The scraper cannot solve a puzzle; a person can, but the site then trusts
 * the browser that solved it (its cookies, identity and often its network).
 * Pasting cookies from a desktop browser works only when all of that lines
 * up. Solving in the scraper's browser makes it line up by construction:
 *
 *   1. An admin opens the check from the app. The server opens the site in
 *      a page of the shared scraper browser (same cookie jar the scrapers
 *      use) and streams that page to the app as JPEG frames (CDP
 *      Page.startScreencast).
 *   2. Mouse and keyboard events from the app are replayed on the page
 *      (CDP Input.dispatch*). The person drags, clicks and types as if the
 *      page were local.
 *   3. When the check is passed - the page left the check URL and the site
 *      set the cookies the scraper declared (`sessionCookieNames`) - the
 *      server saves the page's cookies and user agent as the site's session,
 *      clears the site's challenge (which opens its gate; waiting work
 *      resumes) and closes the page.
 *
 * Transport is a dedicated socket.io namespace (`/assist`) that admits
 * admins only (JWT in the handshake); the default namespace stays open and
 * carries nothing sensitive. One assisted page per site at a time; several
 * viewers may watch and drive it. The page can only navigate within the
 * site, lives at most MAX_SESSION_MS, and closes soon after the last viewer
 * leaves.
 */

import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { usersDb } from '../db/users.js';
import { gatedSite } from '../scrapers/util/site-gate.js';
import { clearChallenge } from '../scrapers/util/challenge.js';
import { setSiteSession, cookiesFromBrowser, cookieDomainMatchesSite } from '../scrapers/util/site-session.js';

export const ASSIST_NAMESPACE = '/assist';

// The page's size; frames are streamed at this size and the client maps
// its pointer back into it.
export const VIEWPORT = { width: 1024, height: 720 };
const FRAME_QUALITY = 55;
const MAX_SESSION_MS = 10 * 60 * 1000;
const IDLE_CLOSE_MS = 30 * 1000;
const SOLVE_POLL_MS = 1500;
const CF_TITLE_RE = /just a moment|checking your browser|even geduld/i;

const MOUSE_TYPES = { mousemove: 'mouseMoved', mousedown: 'mousePressed', mouseup: 'mouseReleased', wheel: 'mouseWheel' };
const KEY_TYPES = { keydown: 'keyDown', keyup: 'keyUp' };
const BUTTONS = new Set(['none', 'left', 'middle', 'right']);

function roomFor(site) {
  return `assist:${site}`;
}

function clampInt(n, lo, hi) {
  const v = Number(n);
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, Math.round(v)));
}

/** One assisted page for one site. */
class AssistSession {
  constructor(site, gate, nsp, scraperFactory) {
    this.site = site;
    this.gate = gate;
    this.nsp = nsp;
    this.scraperFactory = scraperFactory;
    this.page = null;
    this.cdp = null;
    this.state = { site, status: 'starting', message: `Opening ${site}…`, width: VIEWPORT.width, height: VIEWPORT.height };
    this.solved = false;
    this.ended = false;
    this.viewers = new Set();
    this.timers = { poll: null, deadline: null, idle: null };
    this.startedAt = Date.now();
  }

  emit(event, payload) {
    this.nsp.to(roomFor(this.site)).emit(event, payload);
  }

  setState(status, message, extra = {}) {
    this.state = { ...this.state, status, message, ...extra };
    this.emit('assist:state', this.state);
  }

  async start() {
    const { scraperFactory, site, gate } = this;
    if (!scraperFactory.browser) await scraperFactory.init();
    const browser = scraperFactory.browser;

    const page = await browser.newPage();
    this.page = page;
    await page.setViewport(VIEWPORT);

    // Whatever the person clicks, this page only ever shows the site (and
    // its subdomains); a link elsewhere is simply refused.
    await page.setRequestInterception(true);
    page.on('request', req => {
      try {
        if (req.isNavigationRequest() && req.frame() === page.mainFrame()) {
          const host = new URL(req.url()).hostname;
          if (!cookieDomainMatchesSite(host, site)) {
            req.abort('blockedbyclient').catch(() => { });
            this.setState(this.state.status, `This window only opens ${site}; ${host} was not loaded.`);
            return;
          }
        }
        req.continue().catch(() => { });
      } catch (e) {
        req.continue().catch(() => { });
      }
    });

    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) this.checkSolved().catch(() => { });
    });
    page.on('close', () => this.end('closed'));

    const cdp = await page.createCDPSession();
    this.cdp = cdp;
    cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
      if (this.state.status === 'starting' || this.state.status === 'loading') {
        this.setState('streaming', this.solved ? this.state.message : `Complete ${site}'s check in the window below.`);
      }
      this.emit('assist:frame', { site, data, width: metadata.deviceWidth, height: metadata.deviceHeight });
      cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => { });
    });
    await cdp.send('Page.startScreencast', {
      format: 'jpeg', quality: FRAME_QUALITY,
      maxWidth: VIEWPORT.width, maxHeight: VIEWPORT.height, everyNthFrame: 1
    });

    this.timers.poll = setInterval(() => this.checkSolved().catch(() => { }), SOLVE_POLL_MS);
    this.timers.deadline = setTimeout(() => this.end('timeout'), MAX_SESSION_MS);

    this.setState('loading', `Opening ${site}…`);
    page.goto(gate.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      .catch(e => {
        if (!this.ended) this.setState('error', `${site} could not be loaded: ${e.message}`);
      });
  }

  /**
   * Passed when the page is off the check URL, is not a Cloudflare
   * interstitial, and the browser holds every cookie the scraper says the
   * site hands out for passing (or, without declared names, any cookie).
   */
  async checkSolved() {
    if (this.solved || this.ended || !this.page) return false;
    const url = this.page.url();
    if (!url || url === 'about:blank' || this.gate.scraper.isChallengeUrl(url)) return false;
    const title = await this.page.title().catch(() => '');
    if (CF_TITLE_RE.test(title)) return false;

    const all = await this.page.browser().cookies().catch(() => []);
    const cookies = cookiesFromBrowser(this.site, all);
    const names = new Set(cookies.map(c => c.name));
    if (this.gate.cookieNames.length ? !this.gate.cookieNames.every(n => names.has(n)) : cookies.length === 0) return false;

    this.solved = true;
    const userAgent = await this.page.evaluate(() => navigator.userAgent).catch(() => '');
    setSiteSession(this.site, { cookies, userAgent, source: 'assist' });
    clearChallenge(this.site);
    console.log(`[Assist] ${this.site}: check passed in the scraper browser; ${cookies.length} cookie(s) saved`);
    this.setState('solved', `${this.site} accepted the check. ${cookies.length} cookie${cookies.length === 1 ? '' : 's'} saved; waiting work resumes.`);
    setTimeout(() => this.end('solved'), 1500);
    return true;
  }

  /** Replay one input event from a viewer on the page. */
  async input(ev) {
    if (!this.cdp || this.ended || !ev || typeof ev !== 'object') return;
    const type = String(ev.type || '');
    const modifiers = clampInt(ev.modifiers, 0, 15);
    try {
      if (MOUSE_TYPES[type]) {
        const params = {
          type: MOUSE_TYPES[type],
          x: clampInt(ev.x, 0, VIEWPORT.width),
          y: clampInt(ev.y, 0, VIEWPORT.height),
          modifiers,
          button: BUTTONS.has(ev.button) ? ev.button : 'none',
          buttons: clampInt(ev.buttons, 0, 31),
          clickCount: clampInt(ev.clickCount, 0, 3)
        };
        if (type === 'wheel') {
          params.deltaX = clampInt(ev.deltaX, -2000, 2000);
          params.deltaY = clampInt(ev.deltaY, -2000, 2000);
        }
        await this.cdp.send('Input.dispatchMouseEvent', params);
      } else if (KEY_TYPES[type]) {
        const key = String(ev.key || '').slice(0, 32);
        const code = String(ev.code || '').slice(0, 32);
        const text = typeof ev.text === 'string' ? ev.text.slice(0, 4) : undefined;
        const params = { type: KEY_TYPES[type], key, code, modifiers };
        if (Number.isFinite(Number(ev.keyCode))) {
          params.windowsVirtualKeyCode = clampInt(ev.keyCode, 0, 255);
          params.nativeVirtualKeyCode = params.windowsVirtualKeyCode;
        }
        if (type === 'keydown' && text) {
          params.text = text;
          params.unmodifiedText = text;
        }
        await this.cdp.send('Input.dispatchKeyEvent', params);
      }
    } catch (e) {
      // A closed target or an odd event; nothing the viewer can act on.
    }
  }

  addViewer(socket) {
    this.viewers.add(socket.id);
    if (this.timers.idle) { clearTimeout(this.timers.idle); this.timers.idle = null; }
    socket.join(roomFor(this.site));
    socket.emit('assist:state', this.state);
  }

  removeViewer(socket) {
    this.viewers.delete(socket.id);
    socket.leave(roomFor(this.site));
    if (this.viewers.size === 0 && !this.ended && !this.timers.idle) {
      this.timers.idle = setTimeout(() => this.end('idle'), IDLE_CLOSE_MS);
    }
  }

  async end(reason) {
    if (this.ended) return;
    this.ended = true;
    for (const t of Object.values(this.timers)) if (t) { clearTimeout(t); clearInterval(t); }
    if (this.cdp) {
      await this.cdp.send('Page.stopScreencast').catch(() => { });
      await this.cdp.detach().catch(() => { });
    }
    if (this.page) await this.page.close().catch(() => { });
    sessions.delete(this.site);
    const messages = {
      solved: this.state.message,
      timeout: `The window closed after ${Math.round(MAX_SESSION_MS / 60000)} minutes. Open it again to continue.`,
      idle: 'The window closed because nobody was watching it.',
      closed: 'The window was closed.',
      error: this.state.message
    };
    this.setState('ended', messages[reason] || 'The window was closed.', { reason });
    console.log(`[Assist] ${this.site}: session ended (${reason})`);
  }
}

// site -> AssistSession
const sessions = new Map();

/** Active assisted sessions (for status displays). */
export function listAssistSessions() {
  return [...sessions.values()].map(s => ({ site: s.site, status: s.state.status, viewers: s.viewers.size, startedAt: s.startedAt }));
}

/**
 * Attach the /assist namespace to the socket.io server.
 * @param {import('socket.io').Server} io
 * @param {{ browser: object|null, init: () => Promise<void> }} scraperFactory
 */
export function attachAssistNamespace(io, scraperFactory) {
  const nsp = io.of(ASSIST_NAMESPACE);

  // Admins only. The token is the same JWT the REST API takes; the role is
  // re-read from the database so a demoted admin is refused at once.
  nsp.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, CONFIG.auth.jwtSecret);
      const row = usersDb.getById(decoded.id);
      if (!row) return next(new Error('User no longer exists'));
      if (row.role !== 'admin') return next(new Error('Admin access required'));
      socket.data.user = { id: row.id, username: row.username, role: row.role };
      next();
    } catch (e) {
      next(new Error('Invalid or expired token'));
    }
  });

  nsp.on('connection', socket => {
    const watching = new Set();

    socket.on('assist:start', async (payload, ack) => {
      const reply = typeof ack === 'function' ? ack : () => { };
      const site = String(payload?.site || '');
      const gate = gatedSite(site);
      if (!gate) return reply({ ok: false, error: `${site || 'This site'} has no check the app can help with` });
      try {
        let session = sessions.get(site);
        if (!session) {
          session = new AssistSession(site, gate, nsp, scraperFactory);
          sessions.set(site, session);
          session.addViewer(socket);
          watching.add(site);
          console.log(`[Assist] ${site}: ${socket.data.user.username} opened the check`);
          await session.start();
        } else {
          session.addViewer(socket);
          watching.add(site);
        }
        reply({ ok: true, state: session.state });
      } catch (e) {
        const session = sessions.get(site);
        if (session) await session.end('error');
        console.warn(`[Assist] ${site}: could not open: ${e.message}`);
        reply({ ok: false, error: e.message });
      }
    });

    socket.on('assist:input', payload => {
      const site = String(payload?.site || '');
      if (!watching.has(site)) return;
      const session = sessions.get(site);
      if (session) session.input(payload);
    });

    socket.on('assist:stop', payload => {
      const site = String(payload?.site || '');
      const session = sessions.get(site);
      watching.delete(site);
      if (session) session.removeViewer(socket);
    });

    socket.on('disconnect', () => {
      for (const site of watching) {
        const session = sessions.get(site);
        if (session) session.removeViewer(socket);
      }
      watching.clear();
    });
  });

  return nsp;
}

export default { attachAssistNamespace, listAssistSessions, ASSIST_NAMESPACE, VIEWPORT };
