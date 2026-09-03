/**
 * Banner shown when a source site is asking for a human verification check.
 *
 * The scraper cannot get past those; the user can, in their own browser. So
 * the banner names the site, opens the challenge page in a new tab, and has
 * a "done, retry" button that lifts the pause on automated checks.
 */

import { api } from './api.js';
import { socket } from './socket.js';
import { showToast } from './utils/toast.js';

const BANNER_ID = 'site-challenge-banner';
const dismissed = new Set(); // sites the user closed the banner for (this page load)

function render(entry) {
    let banner = document.getElementById(BANNER_ID);
    if (!banner) {
        banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.className = 'site-challenge-banner';
        document.body.appendChild(banner);
    }
    banner.dataset.site = entry.site;
    banner.innerHTML = `
        <div class="site-challenge-text">
            <strong>${entry.site}</strong> is asking for a human verification check.
            Downloads and update checks for this site are paused until it is completed.
        </div>
        <div class="site-challenge-actions">
            <button class="btn btn-primary btn-sm" data-act="open">Open ${entry.site}</button>
            <button class="btn btn-secondary btn-sm" data-act="retry">I've done it, retry</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `;
    banner.querySelector('[data-act="open"]').addEventListener('click', () => {
        // A fresh tab in the user's own browser, so the check is done by a
        // person and any cookies it sets stay in their session.
        window.open(entry.url || `https://${entry.site}/`, '_blank', 'noopener');
    });
    banner.querySelector('[data-act="retry"]').addEventListener('click', async () => {
        try {
            await api.clearSiteChallenge(entry.site);
            showToast(`${entry.site}: checks resumed. If the puzzle comes back, wait a while before retrying.`, 'info');
        } catch (e) {
            showToast('Failed: ' + e.message, 'error');
        }
        hide();
    });
    banner.querySelector('[data-act="close"]').addEventListener('click', () => {
        dismissed.add(entry.site);
        hide();
    });
    banner.classList.add('show');
}

function hide() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
}

function show(entry) {
    if (!entry || dismissed.has(entry.site)) return;
    render(entry);
}

/**
 * Wire up: listen for live challenge events and pick up any challenge that
 * was already active when the page loaded.
 */
export async function initSiteChallengeBanner() {
    socket.on('site:challenge', (entry) => {
        dismissed.delete(entry.site); // a new report re-surfaces a closed banner
        show(entry);
    });
    socket.on('site:challenge-cleared', ({ site }) => {
        const banner = document.getElementById(BANNER_ID);
        if (banner && banner.dataset.site === site) hide();
    });

    try {
        const status = await api.getSiteStatus();
        const active = (status.challenges || [])[0];
        if (active) show(active);
    } catch (e) {
        // Not fatal; the live event will still show it.
    }
}

export default { initSiteChallengeBanner };
