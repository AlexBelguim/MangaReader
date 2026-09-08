/**
 * Review what a finished torrent contains before importing it: every
 * archive or image folder with the target it would get (volume N,
 * chapter N, or skip), editable, with warnings for duplicate numbers and
 * for volumes or chapters the series already has. Opened from the Queue
 * page ("Review import" / "Import again") for a torrent, and from the
 * manga page's "Import from folder" for a release already on disk.
 */

import { api } from './api.js';
import { showToast } from './utils/toast.js';
import { icon } from './icons.js';
import { formatBytes } from './torrent-search.js';

const MODAL_ID = 'import-review-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function detectedLabel(item) {
    const p = item.parsed || {};
    if (p.volume !== null && p.volume !== undefined) return p.volumeEnd ? `name says volumes ${p.volume}–${p.volumeEnd}` : `name says volume ${p.volume}`;
    if (p.chapter !== null && p.chapter !== undefined) return p.chapterEnd ? `name says chapters ${p.chapter}–${p.chapterEnd}` : `name says chapter ${p.chapter}`;
    return 'no number in the name';
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * The import now runs as a queue task. Follow it until it ends, showing
 * progress in `el`; resolves with { bookmarkId, summary }, or null when the
 * dialog was closed meanwhile (the import carries on regardless).
 */
async function followImport(started, el) {
    if (!started.importId) return started; // an older server answering with the summary at once
    for (; ;) {
        if (!document.getElementById(MODAL_ID)) return null;
        let rec;
        try {
            rec = await api.getImport(started.importId);
        } catch (e) {
            await sleep(2000);
            continue;
        }
        if (rec.status === 'done') return { bookmarkId: rec.bookmarkId, summary: rec.summary };
        if (rec.status === 'failed') throw new Error(rec.error || 'Import failed');
        const where = rec.status === 'queued' ? 'Queued behind other tasks…' : `Importing ${Math.min(rec.done + 1, rec.total || rec.done + 1)} of ${rec.total || '?'}${rec.current ? `: ${esc(rec.current)}` : ''}`;
        el.innerHTML = `
            <div class="torrent-row-status">${icon('loader', { spin: true })} ${where}</div>
            <div class="torrent-hint">You can close this dialog; the import carries on and shows on the <a href="#/queue">Queue</a> page.</div>`;
        await sleep(1500);
    }
}

export function closeImportReviewModal() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
}

function onKey(e) {
    if (e.key === 'Escape') closeImportReviewModal();
}

/**
 * @param {object} source  a torrent row ({ hash, name, bookmarkId, newSeriesTitle })
 *   or a folder/archive on disk ({ path, name, bookmarkId })
 * @param {{ onImported?: Function }} opts
 */
export async function openImportReviewModal(source, { onImported } = {}) {
    const torrent = source;
    const fromDisk = !source.hash;
    closeImportReviewModal();
    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open torrent-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${icon('list-checks')} Review import</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="review-body"><div class="torrent-hint">${icon('loader', { spin: true })} Reading the download…</div></div>
            <div class="modal-footer" id="review-footer" hidden></div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    modal.querySelector('.modal-overlay').addEventListener('click', closeImportReviewModal);
    modal.querySelector('[data-act="close"]').addEventListener('click', closeImportReviewModal);
    const body = modal.querySelector('#review-body');
    const footer = modal.querySelector('#review-footer');

    let data;
    try {
        data = fromDisk ? await api.getFolderContents(source.path, source.bookmarkId || null) : await api.getTorrentContents(torrent.hash);
    } catch (e) {
        body.innerHTML = `<div class="torrent-hint error">${esc(e.message)}</div>`;
        return;
    }
    if (!document.getElementById(MODAL_ID)) return; // closed meanwhile

    // Library titles, for a download that has no series yet
    let library = [];
    if (!data.bookmarkId) {
        try {
            const b = await api.getBookmarks();
            library = (b.bookmarks || b || []).map(x => ({ id: x.id, title: x.alias || x.title })).sort((a, c) => a.title.localeCompare(c.title));
        } catch (e) { /* new series only */ }
    }

    const items = data.items || [];
    const existingVolumes = new Map((data.existing?.volumes || []).map(v => [Number(v.number), v.name]));
    const existingChapters = new Set((data.existing?.chapters || []).map(Number));

    body.innerHTML = `
        <div class="torrent-target">
            <strong>${esc(data.releaseName || torrent.name)}</strong> · ${items.length} item${items.length === 1 ? '' : 's'}
            ${data.bookmarkId
                ? ` · into <strong>${esc(data.bookmarkTitle)}</strong>`
                : ` · into <label>
                    <select id="review-target">
                        <option value="">New series “${esc(data.newSeriesTitle || torrent.name)}”</option>
                        ${library.map(b => `<option value="${esc(b.id)}">${esc(b.title)}</option>`).join('')}
                    </select></label>`}
        </div>
        ${items.length === 0 ? '<div class="torrent-hint">Nothing importable in this download: no .cbz/.zip archives or image folders.</div>' : `
        <div class="review-tools">
            <button type="button" class="btn btn-sm btn-secondary" id="review-all">Select all</button>
            <button type="button" class="btn btn-sm btn-secondary" id="review-none">Select none</button>
            <span class="torrent-hint">Untick what you don't want. Change Volume/Chapter and the number where the name was read wrongly.</span>
        </div>
        <table class="torrent-table review-table">
            <thead><tr><th></th><th>File</th><th>Size</th><th>Import as</th><th>Number</th><th></th></tr></thead>
            <tbody>
            ${items.map((it, i) => `
                <tr data-index="${i}">
                    <td><input type="checkbox" class="rv-pick" checked></td>
                    <td class="torrent-title">
                        <div>${it.kind === 'dir' ? icon('folder') : icon('package')} ${esc(it.name)}</div>
                        <div class="torrent-row-status">${esc(detectedLabel(it))}</div>
                    </td>
                    <td>${it.kind === 'dir' ? `${it.pages ?? '?'} pages` : formatBytes(it.size)}</td>
                    <td>
                        <select class="rv-as">
                            <option value="volume" ${it.as === 'volume' ? 'selected' : ''}>Volume</option>
                            <option value="chapter" ${it.as === 'chapter' ? 'selected' : ''} ${it.kind === 'dir' ? 'disabled' : ''}>Chapter</option>
                        </select>
                    </td>
                    <td><input type="number" step="any" min="0" class="rv-num" value="${it.number ?? ''}"></td>
                    <td class="rv-warn"></td>
                </tr>`).join('')}
            </tbody>
        </table>`}
        ${data.unsupported?.length ? `<div class="torrent-hint">Cannot import: ${data.unsupported.map(esc).join(', ')} (only .cbz/.zip and image folders).</div>` : ''}
        <div id="review-result"></div>
    `;

    const rows = () => [...body.querySelectorAll('tr[data-index]')];
    const rowState = (tr) => ({
        index: parseInt(tr.dataset.index, 10),
        picked: tr.querySelector('.rv-pick').checked,
        as: tr.querySelector('.rv-as').value,
        number: parseFloat(tr.querySelector('.rv-num').value)
    });

    // Warnings: the same number twice in the selection, or something the
    // series already has (which the import replaces)
    const refresh = () => {
        const states = rows().map(rowState);
        const seen = new Map();
        for (const s of states) {
            if (!s.picked || !Number.isFinite(s.number)) continue;
            const key = `${s.as}:${s.number}`;
            seen.set(key, (seen.get(key) || 0) + 1);
        }
        let picked = 0;
        for (const tr of rows()) {
            const s = rowState(tr);
            const warn = tr.querySelector('.rv-warn');
            const notes = [];
            if (s.picked) {
                picked++;
                if (!Number.isFinite(s.number)) notes.push('needs a number');
                else {
                    if (seen.get(`${s.as}:${s.number}`) > 1) notes.push(`same ${s.as} number as another file`);
                    if (s.as === 'volume' && existingVolumes.has(s.number)) notes.push(`replaces ${existingVolumes.get(s.number)}`);
                    if (s.as === 'chapter' && existingChapters.has(s.number)) notes.push(`replaces downloaded chapter ${s.number}`);
                }
            }
            warn.textContent = notes.join(' · ');
            tr.classList.toggle('rv-skipped', !s.picked);
        }
        const btn = footer.querySelector('#review-import');
        if (btn) {
            btn.disabled = picked === 0;
            btn.textContent = `Import ${picked} selected`;
        }
    };
    body.addEventListener('change', refresh);
    body.addEventListener('input', refresh);
    body.querySelector('#review-all')?.addEventListener('click', () => { rows().forEach(tr => { tr.querySelector('.rv-pick').checked = true; }); refresh(); });
    body.querySelector('#review-none')?.addEventListener('click', () => { rows().forEach(tr => { tr.querySelector('.rv-pick').checked = false; }); refresh(); });

    footer.hidden = false;
    footer.innerHTML = `
        <span class="torrent-hint">Existing volumes with the same number are replaced.</span>
        <span class="spacer"></span>
        <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
        ${items.length ? '<button type="button" class="btn btn-primary" id="review-import">Import</button>' : ''}
    `;
    footer.querySelector('[data-act="close"]').addEventListener('click', closeImportReviewModal);
    refresh();

    footer.querySelector('#review-import')?.addEventListener('click', async () => {
        const btn = footer.querySelector('#review-import');
        const states = rows().map(rowState);
        const selection = states.map(s => ({
            path: items[s.index].path,
            as: s.picked ? s.as : 'skip',
            number: s.number
        }));
        const picked = states.filter(s => s.picked);
        if (picked.length === 0) return;
        if (picked.some(s => !Number.isFinite(s.number))) {
            showToast('Every selected item needs a number', 'error');
            return;
        }
        const targetId = data.bookmarkId || body.querySelector('#review-target')?.value || null;
        btn.disabled = true;
        btn.textContent = 'Importing…';
        body.querySelectorAll('input, select, button').forEach(el => { el.disabled = true; });
        try {
            const started = fromDisk
                ? await api.importFolder({ path: source.path, bookmarkId: targetId, newSeriesTitle: data.newSeriesTitle || source.name, selection })
                : await api.importTorrent(torrent.hash, targetId, selection);
            btn.textContent = 'Importing…';
            footer.querySelector('[data-act="close"]').textContent = 'Close';
            const r = await followImport(started, body.querySelector('#review-result'));
            if (!r) return; // dialog closed; the queue page shows the rest
            const v = r.summary?.volumes || [];
            const c = r.summary?.chapters || [];
            const skipped = r.summary?.skipped || [];
            body.querySelector('#review-result').innerHTML = `
                <div class="torrent-row-status ok">${icon('check')} Imported ${v.length} volume${v.length === 1 ? '' : 's'}${v.length ? ` (${v.map(x => esc(x.name)).join(', ')})` : ''}${c.length ? ` and ${c.length} chapter${c.length === 1 ? '' : 's'}` : ''}.</div>
                ${skipped.length ? `<ul class="task-error-list">${skipped.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
                <a href="#/manga/${esc(r.bookmarkId)}" class="btn btn-sm btn-secondary">Open the series</a>
            `;
            btn.textContent = 'Done';
            footer.querySelector('[data-act="close"]').textContent = 'Close';
            if (typeof onImported === 'function') onImported(r);
        } catch (e) {
            body.querySelectorAll('input, select, button').forEach(el => { el.disabled = false; });
            body.querySelector('#review-result').innerHTML = `<div class="torrent-row-status error">Import failed: ${esc(e.message)}</div>`;
            btn.disabled = false;
            refresh();
        }
    });
}

export default { openImportReviewModal, closeImportReviewModal };
