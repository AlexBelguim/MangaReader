/**
 * "Find volumes" dialog: search Prowlarr for releases of a title and hand
 * one to qBittorrent. Opened from a manga page (target = that series) and
 * from the Scrapers page (target = a library series or a new one).
 * A grab's outcome is shown under its row: the grab itself is answered at
 * once, the fetch and hand-over happen in the background and arrive via
 * the torrent updates (socket, with polling as fallback).
 */

import { api } from './api.js';
import { socket, SocketEvents } from './socket.js';
import { showToast } from './utils/toast.js';
import { icon } from './icons.js';

const MODAL_ID = 'torrent-search-modal';
const TRACK_POLL_MS = 3000;
let openSeq = 0; // a newer open wins over one still checking the status
let cleanup = null;

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

/** What a tracked torrent row means for the release it came from. */
function outcomeOf(t) {
    switch (t.status) {
        case 'grabbing': return { kind: 'pending', text: 'Fetching the release for qBittorrent…' };
        case 'downloading': {
            const pct = Math.round((t.progress || 0) * 100);
            return { kind: 'ok', text: `Downloading in qBittorrent${pct ? ` · ${pct}%` : ''} · progress on the Queue page`, done: true };
        }
        case 'completed': return { kind: 'ok', text: 'Downloaded, waiting for import', done: true };
        case 'importing': return { kind: 'ok', text: 'Importing into the library…', done: true };
        case 'imported': return { kind: 'ok', text: 'Imported', done: true };
        case 'failed': return { kind: 'error', text: `Failed: ${t.error || 'unknown error'}`, done: true, retry: true };
        case 'removed': return { kind: 'error', text: 'Removed from qBittorrent', done: true, retry: true };
        default: return { kind: 'pending', text: t.status };
    }
}

export function closeTorrentSearchModal() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
    if (cleanup) { cleanup(); cleanup = null; }
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
                <label class="torrent-option">
                    <input type="checkbox" id="torrent-auto-import" ${status.autoImport === false ? '' : 'checked'}>
                    Import automatically when a download finishes. Untick to review what it contains first (Queue page).
                </label>
                <form class="torrent-magnet-form" id="torrent-magnet-form">
                    <input type="text" id="torrent-magnet" placeholder="Or paste a magnet link / .torrent URL from elsewhere" autocomplete="off" spellcheck="false">
                    <button type="submit" class="btn btn-secondary">Add</button>
                </form>
                <div class="torrent-hint" id="torrent-magnet-result" hidden></div>
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
    // Grabs made from this dialog: row index -> { hash (pending, then real), title, done }
    const tracked = new Map();
    let pollTimer = null;

    const setRowStatus = (index, kind, text) => {
        const el = results.querySelector(`.torrent-row-status[data-index="${index}"]`);
        if (!el) return;
        el.className = `torrent-row-status ${kind}`;
        el.textContent = text;
    };
    const setRowButton = (index, label, enabled, primary) => {
        const btn = results.querySelector(`.torrent-grab[data-index="${index}"]`);
        if (!btn) return;
        btn.textContent = label;
        btn.disabled = !enabled;
        btn.classList.toggle('btn-primary', primary);
        btn.classList.toggle('btn-secondary', !primary);
    };

    // Match the torrent list against the grabs made here. A pending entry
    // is replaced by the real torrent, so fall back to the newest entry
    // with the same release title.
    const applyTorrents = (torrents) => {
        if (!Array.isArray(torrents)) return;
        for (const [index, track] of tracked) {
            let t = torrents.find(x => x.hash === track.hash);
            if (!t) {
                t = torrents.filter(x => x.releaseTitle === track.title).sort((a, b) => String(b.addedAt || '').localeCompare(String(a.addedAt || '')))[0];
            }
            if (!t) continue;
            track.hash = t.hash;
            const o = outcomeOf(t);
            setRowStatus(index, o.kind, o.text);
            if (o.retry) setRowButton(index, 'Grab again', true, true);
            else if (o.done) setRowButton(index, 'Grabbed', false, false);
            if (o.done) track.done = true;
        }
        if (![...tracked.values()].some(x => !x.done)) stopPolling();
    };
    const onUpdate = (payload) => applyTorrents(payload?.torrents);
    const pollTracked = async () => {
        try {
            const data = await api.getTorrentDownloads();
            applyTorrents(data.torrents);
        } catch (e) { /* next round */ }
    };
    const startPolling = () => {
        if (!pollTimer) pollTimer = setInterval(pollTracked, TRACK_POLL_MS);
    };
    const stopPolling = () => {
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    };
    socket.on(SocketEvents.TORRENT_UPDATE, onUpdate);
    cleanup = () => {
        socket.off(SocketEvents.TORRENT_UPDATE, onUpdate);
        stopPolling();
    };

    const render = (list) => {
        current = list;
        tracked.clear();
        stopPolling();
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
                        <td class="torrent-title" title="${esc(r.title)}">
                            <div>${esc(r.title)}${r.parsed?.digital ? ' <span class="badge badge-downloaded">Digital</span>' : ''}${r.infoUrl ? ` <a href="${esc(r.infoUrl)}" target="_blank" rel="noopener" class="torrent-info-link" title="Open on the indexer">${icon('globe')}</a>` : ''}</div>
                            <div class="torrent-row-status" data-index="${i}"></div>
                        </td>
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
        setRowStatus(index, 'pending', 'Sending to qBittorrent…');
        try {
            const autoImport = modal.querySelector('#torrent-auto-import')?.checked ?? null;
            const result = await api.grabTorrent(release.id, { bookmarkId: targetId, newSeriesTitle: targetId ? null : release.parsed?.title || null, autoImport });
            tracked.set(index, { hash: result.torrent?.hash, title: release.title, done: false });
            setRowButton(index, 'Grabbed', false, false);
            if (result.torrent) applyTorrents([result.torrent]);
            startPolling();
            if (typeof onGrabbed === 'function') onGrabbed(result.torrent);
        } catch (e) {
            setRowButton(index, 'Grab again', true, true);
            setRowStatus(index, 'error', `Failed: ${e.message}`);
        }
    };

    // A magnet link (or .torrent URL) from elsewhere: same target, same tracking
    modal.querySelector('#torrent-magnet-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const field = modal.querySelector('#torrent-magnet');
        const out = modal.querySelector('#torrent-magnet-result');
        const link = field.value.trim();
        if (!link) { field.focus(); return; }
        const select = modal.querySelector('#torrent-target-select');
        const targetId = bookmarkId || (select ? select.value || null : null);
        const autoImport = modal.querySelector('#torrent-auto-import')?.checked ?? null;
        const btn = e.currentTarget.querySelector('button');
        btn.disabled = true;
        out.hidden = false;
        out.className = 'torrent-hint';
        out.textContent = 'Sending to qBittorrent…';
        try {
            const result = await api.addMagnet(link, { bookmarkId: targetId, autoImport });
            field.value = '';
            out.textContent = `Added "${result.torrent?.name || 'link'}"${targetId ? '' : ' as a new series'}; follow it on the Queue page.`;
            if (result.torrent) applyTorrents([result.torrent]);
            startPolling();
            showToast('Magnet link added', 'success');
            if (typeof onGrabbed === 'function') onGrabbed(result.torrent);
        } catch (err) {
            out.className = 'torrent-hint error';
            out.textContent = err.message;
        } finally {
            btn.disabled = false;
        }
    });

    modal.querySelector('#torrent-search-form').addEventListener('submit', (e) => { e.preventDefault(); search(); });
    if (query) search(); else input.focus();
}

export default { openTorrentSearchModal, closeTorrentSearchModal, formatBytes };
