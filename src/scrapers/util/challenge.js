/**
 * Site human-verification challenges, and the per-site gate they close.
 *
 * Some sources (comix.to's "/@waf/challenge" rotate-the-picture check) stop
 * serving pages to automated browsers and show a puzzle instead. The app
 * cannot and should not solve those; what it can do is notice, stop
 * hammering the site, and tell the user so they can complete the check
 * (through the app's assisted solve, or in their own browser). This module
 * tracks which sites are currently blocked, broadcasts the state to
 * connected clients, and lets work for a blocked site wait for the gate to
 * open again (`waitForSite`) instead of failing or feeding the block.
 *
 * A site's gate is closed while a challenge for it was reported within the
 * cooldown. It opens when the challenge is cleared (a page got real content,
 * cookies were accepted, an admin pressed "retry anyway") or when the
 * cooldown passes with nobody clearing it - then one attempt goes out, and
 * if the puzzle is still there it closes the gate again.
 */

import path from 'path';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import { emitToAll } from '../../services/socketService.js';
import { CONFIG } from '../../config.js';
import { hasSiteSession, markSiteSessionStale } from './site-session.js';

// Persisted so a container restart (a redeploy, for instance) does not
// forget that a site is blocked - the banner and the auto-check pause
// must survive until the user clears it or the cooldown passes.
const STATE_FILE = path.join(CONFIG.dataDir, 'site-challenges.json');

function loadState() {
  try {
    const raw = fs.readJsonSync(STATE_FILE);
    return new Map(Object.entries(raw || {}));
  } catch (e) {
    return new Map();
  }
}

function saveState(map) {
  try {
    fs.writeJsonSync(STATE_FILE, Object.fromEntries(map), { spaces: 2 });
  } catch (e) {
    console.warn(`[Challenge] Could not persist state: ${e.message}`);
  }
}

export const SITE_CHALLENGE_EVENT = 'site:challenge';
export const SITE_CHALLENGE_CLEARED_EVENT = 'site:challenge-cleared';

// How long a reported challenge keeps automated checks for that site paused
// when nobody clears it explicitly.
export const CHALLENGE_COOLDOWN_MS = 6 * 60 * 60 * 1000;

// Why a site is blocked. `check`: the site showed its puzzle to a page
// without a saved session. `rejected`: it showed the puzzle to a page that
// carried the saved cookies. `expired`: the saved cookies ran out (or are
// about to), so the gate was closed before the site had to say so.
export const CHALLENGE_REASONS = ['check', 'rejected', 'expired'];

/**
 * In-process notifications: 'report' (entry) when a site becomes blocked or
 * is reported again, 'clear' (site) when its gate opens. Used by the queue
 * (to park and resume jobs) and the auto-check (to re-run skipped manga).
 */
export const challengeEvents = new EventEmitter();
challengeEvents.setMaxListeners(50);

export class SiteChallengeError extends Error {
  constructor(site, challengeUrl, { sessionStale = false, reason } = {}) {
    super(reason === 'expired'
      ? `${site}'s verification cookies expired. Complete its check again (Solve it here, or paste fresh cookies).`
      : sessionStale
        ? `${site} no longer accepts the saved cookies. Complete its verification check again (Solve it here, or paste fresh cookies).`
        : `${site} is asking for a human verification check. Complete it (Solve it here, or in your browser and paste its cookies) - waiting work resumes by itself.`);
    this.name = 'SiteChallengeError';
    this.code = 'SITE_CHALLENGE';
    this.site = site;
    this.challengeUrl = challengeUrl;
    this.sessionStale = sessionStale;
    this.reason = reason || (sessionStale ? 'rejected' : 'check');
  }
}

// site -> { site, url, firstSeen, lastSeen, count, sessionStale, reason }
const challenges = loadState();

// ─── Gate: waiting for a site to open ────────────────────────────────

// site -> Set<wake fn>
const waiters = new Map();
// site -> timer that opens the gate when the cooldown passes
const cooldownTimers = new Map();

function cooldownRemaining(site, cooldownMs = CHALLENGE_COOLDOWN_MS) {
  const entry = challenges.get(site);
  if (!entry) return 0;
  return Math.max(0, new Date(entry.lastSeen).getTime() + cooldownMs - Date.now());
}

function wake(site) {
  const set = waiters.get(site);
  if (!set) return;
  waiters.delete(site);
  for (const fn of set) {
    try { fn(); } catch (e) { console.warn(`[Challenge] Gate waiter for ${site} failed: ${e.message}`); }
  }
}

// One timer per site; re-armed on every report so it fires when the latest
// report's cooldown passes. Unref'd so it never keeps the process alive.
function armCooldownTimer(site) {
  const existing = cooldownTimers.get(site);
  if (existing) clearTimeout(existing);
  const remaining = cooldownRemaining(site);
  const t = setTimeout(() => {
    cooldownTimers.delete(site);
    if (isChallenged(site)) { armCooldownTimer(site); return; } // reported again meanwhile
    console.log(`[Challenge] ${site}: cooldown passed, trying again`);
    challengeEvents.emit('clear', site, { cooldown: true });
    wake(site);
  }, remaining + 50);
  if (typeof t.unref === 'function') t.unref();
  cooldownTimers.set(site, t);
}

// Sites blocked at startup (persisted state) need their timers too.
for (const site of challenges.keys()) {
  if (isChallenged(site)) armCooldownTimer(site);
}

/**
 * Resolves when the site's gate is open: at once when it is not blocked,
 * otherwise when the challenge is cleared or the cooldown passes. Never
 * rejects. `signal` (AbortSignal) stops waiting early - the promise then
 * resolves as well, so callers re-check what they were waiting for.
 */
export function waitForSite(site, { signal } = {}) {
  if (!site || !isChallenged(site)) return Promise.resolve();
  return new Promise(resolve => {
    let set = waiters.get(site);
    if (!set) waiters.set(site, set = new Set());
    const done = () => {
      set.delete(done);
      signal?.removeEventListener('abort', done);
      resolve();
    };
    set.add(done);
    signal?.addEventListener('abort', done, { once: true });
    armCooldownTimer(site);
  });
}

/** How many callers are parked on a site's gate (for status displays). */
export function waitingCount(site) {
  return waiters.get(site)?.size || 0;
}

// ─── Reporting ───────────────────────────────────────────────────────

/**
 * Record that a site answered with its human check (or that its saved
 * session expired, `reason: 'expired'`).
 * @param {string} site
 * @param {string} challengeUrl
 * @param {{ usedSession?: boolean, reason?: string }} [opts] - `usedSession`:
 *   whether the page that hit the check was presenting the user's
 *   handed-over cookies. Only then does the check mean those cookies
 *   stopped working; a session-less page (or one prepared before the
 *   import) says nothing about them.
 */
export function reportChallenge(site, challengeUrl, { usedSession = false, reason } = {}) {
  const now = new Date().toISOString();
  const sessionStale = usedSession && hasSiteSession(site);
  if (sessionStale) markSiteSessionStale(site, reason === 'expired' ? 'The verification cookies expired' : undefined);
  const why = CHALLENGE_REASONS.includes(reason) ? reason : (sessionStale ? 'rejected' : 'check');

  const existing = challenges.get(site);
  const entry = existing
    ? { ...existing, url: challengeUrl || existing.url, lastSeen: now, count: existing.count + 1, sessionStale, reason: why }
    : { site, url: challengeUrl, firstSeen: now, lastSeen: now, count: 1, sessionStale, reason: why };
  challenges.set(site, entry);
  saveState(challenges);
  armCooldownTimer(site);
  console.warn(`[Challenge] ${site}: ${why === 'expired' ? 'saved cookies expired' : `showing a human verification check (${challengeUrl})`}${sessionStale && why !== 'expired' ? ' - saved cookies rejected' : ''}; work for this site waits`);
  emitToAll(SITE_CHALLENGE_EVENT, entry);
  challengeEvents.emit('report', entry);
  return new SiteChallengeError(site, challengeUrl, { sessionStale, reason: why });
}

export function clearChallenge(site) {
  const timer = cooldownTimers.get(site);
  if (timer) { clearTimeout(timer); cooldownTimers.delete(site); }
  if (!challenges.delete(site)) return false;
  saveState(challenges);
  console.log(`[Challenge] ${site} check cleared${waitingCount(site) ? ` - ${waitingCount(site)} waiting task(s) resume` : ''}`);
  emitToAll(SITE_CHALLENGE_CLEARED_EVENT, { site });
  challengeEvents.emit('clear', site, { cooldown: false });
  wake(site);
  return true;
}

export function getChallenges() {
  return [...challenges.values()].map(e => ({ ...e, waiting: waitingCount(e.site) }));
}

export function getChallenge(site) {
  return challenges.get(site) || null;
}

// True while a challenge for the site was reported within the cooldown.
export function isChallenged(site, cooldownMs = CHALLENGE_COOLDOWN_MS) {
  const entry = challenges.get(site);
  if (!entry) return false;
  return Date.now() - new Date(entry.lastSeen).getTime() < cooldownMs;
}

export function isChallengeError(err) {
  return !!err && err.code === 'SITE_CHALLENGE';
}
