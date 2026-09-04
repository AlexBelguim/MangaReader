/**
 * Site human-verification challenges.
 *
 * Some sources (comix.to's "/@waf/challenge" rotate-the-picture check) stop
 * serving pages to automated browsers and show a puzzle instead. The app
 * cannot and should not solve those; what it can do is notice, stop
 * hammering the site, and tell the user so they can complete the check in
 * their own browser. This module tracks which sites are currently blocked
 * and broadcasts the state to connected clients.
 */

import path from 'path';
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

export class SiteChallengeError extends Error {
  constructor(site, challengeUrl, { sessionStale = false } = {}) {
    super(sessionStale
      ? `${site} no longer accepts the saved cookies. Open ${site} in your browser, complete its verification check again, then paste fresh cookies.`
      : `${site} is asking for a human verification check. Open ${site} in your browser, complete it, then paste its cookies here (or retry).`);
    this.name = 'SiteChallengeError';
    this.code = 'SITE_CHALLENGE';
    this.site = site;
    this.challengeUrl = challengeUrl;
    this.sessionStale = sessionStale;
  }
}

// site -> { site, url, firstSeen, lastSeen, count, sessionStale }
const challenges = loadState();

/**
 * Record that a site answered with its human check.
 * @param {string} site
 * @param {string} challengeUrl
 * @param {{ usedSession?: boolean }} [opts] - whether the page that hit the
 *   check was presenting the user's handed-over cookies. Only then does the
 *   check mean those cookies stopped working; a session-less page (or one
 *   prepared before the import) says nothing about them.
 */
export function reportChallenge(site, challengeUrl, { usedSession = false } = {}) {
  const now = new Date().toISOString();
  const sessionStale = usedSession && hasSiteSession(site);
  if (sessionStale) markSiteSessionStale(site);

  const existing = challenges.get(site);
  const entry = existing
    ? { ...existing, url: challengeUrl || existing.url, lastSeen: now, count: existing.count + 1, sessionStale }
    : { site, url: challengeUrl, firstSeen: now, lastSeen: now, count: 1, sessionStale };
  challenges.set(site, entry);
  saveState(challenges);
  console.warn(`[Challenge] ${site} is showing a human verification check (${challengeUrl})${sessionStale ? ' - saved cookies rejected' : ''}`);
  emitToAll(SITE_CHALLENGE_EVENT, entry);
  return new SiteChallengeError(site, challengeUrl, { sessionStale });
}

export function clearChallenge(site) {
  if (!challenges.delete(site)) return false;
  saveState(challenges);
  console.log(`[Challenge] ${site} check cleared`);
  emitToAll(SITE_CHALLENGE_CLEARED_EVENT, { site });
  return true;
}

export function getChallenges() {
  return [...challenges.values()];
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
