/**
 * Human-verification hand-off UI.
 *
 * Some sites (comix.to) stop serving the scraper and show a "verify you're
 * human" puzzle instead. The scraper cannot get past it; the user can, in
 * their own browser. The site then trusts that browser through a cookie.
 * Browsers never let this page read another site's cookies, so the user
 * copies them (Cookie-Editor export, devtools, cookies.txt) and pastes them
 * here; the server stores them, gives the headless browser the same cookies
 * and identity (user agent), and immediately tests whether the site is
 * reachable again.
 *
 * Two entry points: the fixed banner (any page) and `openCookieImportModal`
 * (used by the queue and scrapers views as well).
 */

import { api } from './api.js';
import { socket } from './socket.js';
import { session } from './session.js';
import { showToast } from './utils/toast.js';

const BANNER_ID = 'site-challenge-banner';
const MODAL_ID = 'site-cookie-modal';
const dismissed = new Set(); // sites the user closed the banner for (this page load)

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Open the site in a fresh tab of the user's own browser, so a person does the check. */
export function openSite(site, url) {
    window.open(url || `https://${site}/`, '_blank', 'noopener');
}

// ==================== COOKIE IMPORT MODAL ====================

export function closeCookieImportModal() {
    const existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();
    document.removeEventListener('keydown', onModalKey);
}

function onModalKey(e) {
    if (e.key === 'Escape') closeCookieImportModal();
}

function describeResult(site, result) {
    const n = result.session?.cookieCount ?? 0;
    const probe = result.probe;
    if (probe && probe.ok) {
        return {
            kind: 'ok',
            html: `<strong>${esc(site)} accepted the cookies.</strong> ${n} saved; update checks for this site resume.
                   Downloads that stopped on the check can be retried from the <a href="#/queue">Task Queue</a>.`
        };
    }
    if (probe && !probe.ok && probe.error) {
        // The server never reached the site; nothing is known about the cookies yet.
        return {
            kind: 'warn',
            html: `<strong>Saved ${n} cookie${n === 1 ? '' : 's'}, but the server could not load ${esc(site)} to test them.</strong>
                   ${esc(probe.error)}. Retry a download to find out whether they work.`
        };
    }
    if (probe && !probe.ok) {
        return {
            kind: 'warn',
            html: `<strong>Saved ${n} cookie${n === 1 ? '' : 's'}, but ${esc(site)} still shows its check to the server.</strong>
                   Usually one of: the check was done on a different network than the server (the cookie can be tied to the
                   IP address), or in a different browser than the identity filled in above. Complete the check again from a
                   device on the server's network, export the cookies right away, make sure the identity is that browser's,
                   and paste again.${probe.error ? `<br><small>${esc(probe.error)}</small>` : ''}`
        };
    }
    return {
        kind: 'ok',
        html: `<strong>Saved ${n} cookie${n === 1 ? '' : 's'}.</strong> The site could not be tested right now; retry your download to find out.`
    };
}

/**
 * Show the paste-your-cookies dialog for a site.
 * @param {{ site: string, url?: string, stale?: boolean, onImported?: (result) => void }} opts
 */
export function openCookieImportModal({ site, url, stale = false, onImported } = {}) {
    if (!site) return;
    if (!session.isAdmin) {
        showToast('Only an admin can hand site cookies to the scraper', 'error');
        return;
    }
    closeCookieImportModal();
    const ua = navigator.userAgent || '';

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open site-cookie-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Hand ${esc(site)}'s cookies to the scraper</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-cookie-body">
                <ol class="site-cookie-steps">
                    <li><button type="button" class="btn btn-sm btn-secondary" data-act="open">Open ${esc(site)}</button>
                        and complete its "verify you're human" check.
                        ${stale ? `If no puzzle appears, that browser is still trusted: export its cookies anyway (the site
                        may have renewed them), or clear the site's cookies in that browser to get the puzzle back.` : ''}</li>
                    <li>Copy the cookies ${esc(site)} gave that browser, right after the check. Easiest: the
                        <strong>Cookie-Editor</strong> extension (Chrome, Edge, Firefox): open it on the ${esc(site)} tab,
                        choose <em>Export</em>, then <em>JSON</em> or <em>Header String</em>. A Netscape <code>cookies.txt</code>
                        export works too. (The browser console's <code>document.cookie</code> does not: it hides the cookie that matters.)</li>
                    <li>Paste them here and save. The server then loads ${esc(site)} once to see whether it is trusted.</li>
                </ol>
                <div class="form-group">
                    <label for="site-cookie-input">Cookies for ${esc(site)}</label>
                    <textarea id="site-cookie-input" rows="5" spellcheck="false" autocomplete="off" autocapitalize="off"
                        placeholder='[{"name": "...", "value": "..."}]   or   name=value; name2=value2'></textarea>
                </div>
                <div class="form-group site-cookie-ua">
                    <label for="site-cookie-ua">Identity (user agent) of the browser that completed the check</label>
                    <input type="text" id="site-cookie-ua" value="${esc(ua)}" spellcheck="false" autocomplete="off">
                    <small>Prefilled with this browser's. Did the check on another device? Paste that browser's user agent
                        instead (search "what is my user agent" on it). Empty keeps the scraper's own identity.</small>
                </div>
                <div class="site-cookie-result" id="site-cookie-result" hidden></div>
            </div>
            <div class="site-cookie-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
                <button type="button" class="btn btn-primary" data-act="save">Save &amp; test</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onModalKey);

    const textarea = modal.querySelector('#site-cookie-input');
    const uaInput = modal.querySelector('#site-cookie-ua');
    const resultEl = modal.querySelector('#site-cookie-result');
    const saveBtn = modal.querySelector('[data-act="save"]');

    const showResult = (kind, html) => {
        resultEl.className = `site-cookie-result ${kind}`;
        resultEl.innerHTML = html;
        resultEl.hidden = false;
    };

    modal.querySelector('.modal-overlay').addEventListener('click', closeCookieImportModal);
    modal.querySelectorAll('[data-act="close"]').forEach(b => b.addEventListener('click', closeCookieImportModal));
    modal.querySelector('[data-act="open"]').addEventListener('click', () => openSite(site, url));

    let busy = false;
    saveBtn.addEventListener('click', async () => {
        if (busy) return;
        const text = textarea.value.trim();
        if (!text) {
            showResult('error', 'Paste the cookies first.');
            textarea.focus();
            return;
        }
        busy = true;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving & testing…';
        resultEl.hidden = true;
        try {
            const result = await api.importSiteSession(site, text, uaInput.value.trim());
            const { kind, html } = describeResult(site, result);
            const ignored = result.ignored || {};
            const notes = [];
            if (ignored.foreign) notes.push(`${ignored.foreign} for other sites`);
            if (ignored.expired) notes.push(`${ignored.expired} already expired`);
            if (ignored.invalid) notes.push(`${ignored.invalid} unreadable`);
            showResult(kind, html + (notes.length ? `<br><small>Skipped: ${notes.join(', ')}.</small>` : ''));
            // The cookies now live on the server; don't keep them on screen.
            textarea.value = '';
            if (typeof onImported === 'function') onImported(result);
            if (result.probe?.ok) {
                showToast(`${site}: cookies accepted, checks resume`, 'success');
                setTimeout(closeCookieImportModal, 2500);
            }
        } catch (e) {
            showResult('error', esc(e.message || 'Import failed'));
        } finally {
            busy = false;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save & test';
        }
    });

    textarea.focus();
}

// ==================== BANNER ====================

function render(entry) {
    let banner = document.getElementById(BANNER_ID);
    if (!banner) {
        banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.className = 'site-challenge-banner';
        document.body.appendChild(banner);
    }
    banner.dataset.site = entry.site;
    const admin = session.isAdmin;
    let message = entry.sessionStale
        ? `<strong>${esc(entry.site)}</strong> no longer accepts the cookies handed over earlier. Complete its verification check again and paste fresh ones.`
        : `<strong>${esc(entry.site)}</strong> is asking for a human verification check. Automatic update checks for this site are paused and downloads stop at the first blocked chapter until someone completes it and hands over its cookies.`;
    if (!admin) message += ' Ask an admin to do that.';
    banner.innerHTML = `
        <div class="site-challenge-text">${message}</div>
        <div class="site-challenge-actions">
            <button class="btn btn-primary btn-sm" data-act="open">${admin ? '1. ' : ''}Open ${esc(entry.site)}</button>
            ${admin ? '<button class="btn btn-primary btn-sm" data-act="import">2. Paste cookies</button>' : ''}
            <button class="btn btn-secondary btn-sm" data-act="retry" title="Resume without handing over cookies. Only works if the site stopped asking.">Retry anyway</button>
            <button class="site-challenge-close" data-act="close" title="Hide">×</button>
        </div>
    `;
    banner.querySelector('[data-act="open"]').addEventListener('click', () => openSite(entry.site, entry.url));
    banner.querySelector('[data-act="import"]')?.addEventListener('click', () => {
        openCookieImportModal({ site: entry.site, url: entry.url, stale: !!entry.sessionStale });
    });
    banner.querySelector('[data-act="retry"]').addEventListener('click', async () => {
        try {
            await api.clearSiteChallenge(entry.site);
            showToast(`${entry.site}: checks resumed. If the puzzle comes back, hand over its cookies instead.`, 'info');
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

export default { initSiteChallengeBanner, openCookieImportModal, closeCookieImportModal, openSite };
