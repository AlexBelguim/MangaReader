/**
 * Details of a title on a source site, without adding it first: cover,
 * description, chapter count, artists and tags, fetched from the scraper
 * that handles its URL. The same look as the browse view's info panel, but
 * reusable - opened from the series page's "Find more like this" results.
 *
 * The fetch asks for a brief look (see BaseScraper.getMangaInfo): the title
 * page only, not a walk of every chapter page, which would hold that
 * scraper - and the downloads behind it - for minutes on a long series.
 * Closing the panel aborts the request.
 */

import { api } from './api.js';
import { icon, placeholder, coverImg } from './icons.js';

const MODAL_ID = 'scraper-info-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function coverUrlOf(raw) {
    if (!raw) return '';
    return raw.startsWith('/covers/') ? raw : `/api/scrapers/proxy-cover?url=${encodeURIComponent(raw)}`;
}

let onKey = null;

export function closeScraperInfoModal() {
    const modal = document.getElementById(MODAL_ID);
    if (modal?._abort) modal._abort.abort();
    modal?.remove();
    if (onKey) document.removeEventListener('keydown', onKey, true);
    onKey = null;
}

/**
 * @param {{
 *   result: { title: string, url: string, cover?: string, website?: string, chapterCount?: number },
 *   action?: { label: string, onClick: (result) => any, done?: string },
 *   onDone?: Function
 * }} opts
 *   `action`: an extra button (for example "Add to series"). Its onClick may
 *   return a promise; the button shows `done` when it resolves.
 */
export function openScraperInfoModal({ result, action = null } = {}) {
    if (!result?.url) return;
    closeScraperInfoModal();

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open scraper-info-modal';
    const cover = coverUrlOf(result.cover);
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${esc(result.title)}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="scraper-info-body">
                <div class="scraper-info-top">
                    <div class="scraper-info-cover">
                        ${cover ? coverImg(cover, esc(result.title), { kind: 'series', self: true }) : placeholder('series')}
                    </div>
                    <div class="scraper-info-main">
                        <div class="scraper-info-meta">
                            <span class="badge badge-scraper">${esc(result.website || '')}</span>
                            ${result.chapterCount ? `<span class="badge badge-chapters">${result.chapterCount} ch</span>` : ''}
                        </div>
                        <div id="scraper-info-details" class="scraper-info-details">
                            <div class="torrent-hint">${icon('loader', { spin: true })} Reading the title page…</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scraper-info-footer">
                <a class="btn btn-secondary" href="${esc(result.url)}" target="_blank" rel="noopener">${icon('globe')} Open on the site</a>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
                ${action ? `<button type="button" class="btn btn-primary" data-act="action">${esc(action.label)}</button>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Capture, and stop the event: this panel opens on top of another
    // dialog whose own Escape handler would otherwise close that one too.
    onKey = (e) => {
        if (e.key !== 'Escape') return;
        e.stopImmediatePropagation();
        e.preventDefault();
        closeScraperInfoModal();
    };
    document.addEventListener('keydown', onKey, true);
    modal.querySelector('.modal-overlay').addEventListener('click', closeScraperInfoModal);
    modal.querySelectorAll('[data-act="close"]').forEach(b => b.addEventListener('click', closeScraperInfoModal));

    const actionBtn = modal.querySelector('[data-act="action"]');
    if (actionBtn && action) {
        actionBtn.addEventListener('click', async () => {
            actionBtn.disabled = true;
            try {
                await action.onClick(result);
                actionBtn.textContent = action.done || 'Added';
            } catch (e) {
                actionBtn.disabled = false;
            }
        });
    }

    // ── Details ──
    const details = modal.querySelector('#scraper-info-details');
    const controller = new AbortController();
    modal._abort = controller;

    const chips = (label, list) => (list?.length
        ? `<div class="scraper-info-group">
             <h4>${esc(label)}</h4>
             <div class="scraper-info-chips">${list.map(x => `<span class="badge badge-chapters">${esc(x)}</span>`).join('')}</div>
           </div>`
        : '');

    api.get(`/scrapers/info?url=${encodeURIComponent(result.url)}&brief=1`, { signal: controller.signal })
        .then(data => {
            if (!document.getElementById(MODAL_ID)) return;
            const info = data?.info;
            if (!data?.success || !info) {
                details.innerHTML = '<div class="torrent-hint error">The site did not return any details.</div>';
                return;
            }
            const chapters = info.totalChapters || info.chapters?.length || result.chapterCount || null;
            const facts = [
                chapters ? { label: 'Chapters', value: chapters } : null,
                info.uniqueChapters && info.uniqueChapters !== chapters ? { label: 'Unique', value: info.uniqueChapters } : null,
                info.pageCount ? { label: 'Pages', value: info.pageCount } : null,
                info.displayId ? { label: 'Gallery', value: info.displayId } : null
            ].filter(Boolean);
            details.innerHTML = `
                ${facts.length ? `<div class="scraper-info-facts">${facts.map(f => `
                    <div><div class="scraper-info-fact-label">${esc(f.label)}</div><div class="scraper-info-fact-value">${esc(f.value)}</div></div>`).join('')}</div>` : ''}
                ${info.description ? `<p class="scraper-info-description">${esc(info.description)}</p>` : ''}
                ${chips('Artists', info.artists)}
                ${chips('Tags', info.tags)}
            `;
            // A better cover than the search thumbnail sometimes comes back
            const better = coverUrlOf(info.cover);
            const img = modal.querySelector('.scraper-info-cover img');
            if (better && img && !result.cover) img.src = better;
        })
        .catch(e => {
            if (controller.signal.aborted || e.name === 'AbortError') return;
            if (!document.getElementById(MODAL_ID)) return;
            details.innerHTML = `<div class="torrent-hint error">${esc(e.message)}</div>`;
        });
}

export default { openScraperInfoModal, closeScraperInfoModal };
