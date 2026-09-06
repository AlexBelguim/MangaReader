/**
 * "Find volumes" dialog: search Prowlarr for releases of a title and hand
 * one to qBittorrent. Opened from a manga page (target = that series) and
 * from the Scrapers page (target = a library series or a new one).
 */

import { api } from './api.js';
import { showToast } from './utils/toast.js';
import { icon } from './icons.js';

const MODAL_ID = 'torrent-search-modal';
let openSeq = 0; // a newer open wins over one still checking the status

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function formatBytes(n) {
    if (!n) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let v = n;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

function ageOf(dateStr) {
    if (!dateStr) return '';
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.floor(days / 30)}mo`;
    return `${Math.floor(days / 365)}y`;
}

function volumeLabel(parsed) {
    if (!parsed) return '';
    if (parsed.volume !== null && parsed.volume !== undefined) {
        return parsed.volumeEnd ? `Vol. ${parsed.volume}–${parsed.volumeEnd}` : `Vol. ${parsed.volume}`;
    }
    if (parsed.chapter !== null && parsed.chapter !== undefined) {
        return parsed.chapterEnd ? `Ch. ${parsed.chapter}–${parsed.chapterEnd}` : `Ch. ${parsed.chapter}`;
    }
    return '';
}

export function closeTorrentSearchModal() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
}

function onKey(e) {
    if (e.key === 'Escape') closeTorrentSearchModal();
}

/**
 * @param {{ query?: string, bookmarkId?: string|null, bookmarkTitle?: string, library?: Array<{id, title, alias}>, onGrabbed?: Function }} opts
 *   bookmarkId set: releases go to that series. Otherwise the dialog offers
 *   the library titles plus "new series", defaulting to the parsed title.
 */
export async function openTorrentSearchModal({ query = '', bookmarkId = null, bookmarkTitle = '', library = null, onGrabbed } = {}) {
    const seq = ++openSeq;
    closeTorrentSearchModal();

    let status;
    try {
        status = await api.getTorrentStatus();
    } catch (e) {
        status = { prowlarr: false, qbittorrent: false };
    }
    if (seq !== openSeq) return; // opened again meanwhile
    if (!status.prowlarr || !status.qbittorrent) {
        showToast('Set up Prowlarr and qBittorrent under Settings > Torrents first', 'info');
        return;
    }

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open torrent-modal';
    const targetHtml = bookmarkId
        ? `<div class="torrent-target">Releases go to <strong>${esc(bookmarkTitle)}</strong> and are imported as volumes when they finish.</div>`
        : `<div class="torrent-target">
             <label>Add to
               <select id="torrent-target-select">
                 <option value="">New series (named after the release)</option>
                 ${(library || []).map(b => `<option value="${esc(b.id)}">${esc(b.alias || b.title)}</option>`).join('')}
               </select>
             </label>
           </div>`;
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${icon('download')} Find volume releases</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <form class="torrent-search-form" id="torrent-search-form">
                    <input type="text" id="torrent-query" value="${esc(query)}" placeholder="Title to search the indexers for" autocomplete="off">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                ${targetHtml}
                <div class="torrent-results" id="torrent-results"><div class="torrent-hint">Searches every indexer enabled in Prowlarr. Volume releases show their volume number when the name says it.</div></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    modal.querySelector('.modal-overlay').addEventListener('click', closeTorrentSearchModal);
    modal.querySelector('[data-act="close"]').addEventListener('click', closeTorrentSearchModal);

    const results = modal.querySelector('#torrent-results');
    const input = modal.querySelector('#torrent-query');
    let current = [];

    const render = (list) => {
        current = list;
        if (list.length === 0) {
            results.innerHTML = '<div class="torrent-hint">No releases found. Try a shorter title.</div>';
            return;
        }
        results.innerHTML = `
            <table class="torrent-table">
                <thead><tr><th>Release</th><th>Vol.</th><th>Size</th><th>Seeds</th><th>Indexer</th><th>Age</th><th></th></tr></thead>
                <tbody>
                ${list.map((r, i) => `
                    <tr>
                        <td class="torrent-title" title="${esc(r.title)}">${esc(r.title)}${r.parsed?.digital ? ' <span class="badge badge-downloaded">Digital</span>' : ''}${r.infoUrl ? ` <a href="${esc(r.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${icon('globe')}</a>` : ''}</td>
                        <td>${esc(volumeLabel(r.parsed))}</td>
                        <td>${formatBytes(r.size)}</td>
                        <td class="${(r.seeders ?? 0) === 0 ? 'torrent-dead' : ''}">${r.seeders ?? '?'}</td>
                        <td>${esc(r.indexer)}</td>
                        <td>${ageOf(r.publishDate)}</td>
                        <td>${r.hasDownload === false
                            ? '<span class="text-muted" title="The indexer gave no download link">No link</span>'
                            : `<button class="btn btn-sm btn-primary torrent-grab" data-index="${i}">Grab</button>`}</td>
                    </tr>`).join('')}
                </tbody>
            </table>`;
        results.querySelectorAll('.torrent-grab').forEach(btn => btn.addEventListener('click', () => grab(parseInt(btn.dataset.index, 10), btn)));
    };

    const search = async () => {
        const q = input.value.trim();
        if (!q) return;
        results.innerHTML = `<div class="torrent-hint">${icon('loader', { spin: true })} Searching the indexers…</div>`;
        try {
            const data = await api.searchTorrents(q);
            render(data.results || []);
        } catch (e) {
            results.innerHTML = `<div class="torrent-hint error">${esc(e.message)}</div>`;
        }
    };

    const grab = async (index, btn) => {
        const release = current[index];
        if (!release) return;
        const select = modal.querySelector('#torrent-target-select');
        const targetId = bookmarkId || (select ? select.value || null : null);
        btn.disabled = true;
        btn.textContent = 'Sending…';
        try {
            const result = await api.grabTorrent(release.id, { bookmarkId: targetId, newSeriesTitle: targetId ? null : release.parsed?.title || null });
            btn.textContent = 'Grabbed';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            showToast(`Sent to qBittorrent: ${release.title}. Progress is on the Queue page.`, 'success');
            if (typeof onGrabbed === 'function') onGrabbed(result.torrent);
        } catch (e) {
            btn.disabled = false;
            btn.textContent = 'Grab';
            showToast(`Grab failed: ${e.message}`, 'error');
        }
    };

    modal.querySelector('#torrent-search-form').addEventListener('submit', (e) => { e.preventDefault(); search(); });
    if (query) search(); else input.focus();
}

export default { openTorrentSearchModal, closeTorrentSearchModal, formatBytes };
