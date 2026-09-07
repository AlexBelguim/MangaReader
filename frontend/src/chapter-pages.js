/**
 * Pages of a downloaded chapter, as a grid with the page tools: rotate,
 * cut a spread in two, swap two pages, delete. Opened from the chapter's
 * page-count pill on the manga page, for every downloaded chapter (not only
 * ones with several versions). Uses the same server endpoints as the
 * reader's page tools, so edits land in the exact version folder shown.
 */

import { api } from './api.js';
import { showToast } from './utils/toast.js';
import { icon } from './icons.js';

const MODAL_ID = 'chapter-pages-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fileNameOf(url) {
    try {
        const clean = String(url).split('?')[0];
        return decodeURIComponent(clean.slice(clean.lastIndexOf('/') + 1));
    } catch (e) {
        return String(url).slice(String(url).lastIndexOf('/') + 1);
    }
}

export function closeChapterPagesModal() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
}

function onKey(e) {
    if (e.key === 'Escape') closeChapterPagesModal();
}

/**
 * @param {{ mangaId: string, num: number, title?: string,
 *   versions?: Array<{ url: string|null, folder: string, imageCount: number, label?: string }>,
 *   versionUrl?: string|null, onChanged?: Function }} opts
 *   `versions`: the chapter's folders on disk with the version URL each
 *   belongs to (from the bookmark's chapterFolders); a folder without a URL
 *   cannot be edited here, only listed.
 */
export function openChapterPagesModal({ mangaId, num, title = '', versions = [], versionUrl = null, onChanged } = {}) {
    closeChapterPagesModal();
    const editable = versions.filter(v => v.url);
    let current = versionUrl && editable.some(v => v.url === versionUrl) ? versionUrl : (editable[0]?.url ?? null);

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open chapter-pages-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${icon('images')} Chapter ${esc(num)}${title ? ` · ${esc(title)}` : ''}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="chapter-pages-toolbar">
                ${editable.length > 1 ? `<label class="chapter-pages-version">Version
                    <select id="cp-version">${editable.map(v => `<option value="${esc(v.url)}" ${v.url === current ? 'selected' : ''}>${esc(v.label || v.folder)} · ${v.imageCount} pages</option>`).join('')}</select>
                </label>` : `<span class="torrent-hint" id="cp-folder">${esc(editable[0]?.folder || versions[0]?.folder || '')}</span>`}
                <span class="spacer"></span>
                <span class="torrent-hint" id="cp-count"></span>
                <button type="button" class="btn btn-sm btn-secondary" id="cp-read" title="Open in the reader">${icon('play')} Read</button>
            </div>
            <div class="chapter-pages-hint">Rotate, cut a double page in two, swap two pages (pick one, then the other) or delete. Changes are made to the files on disk right away.</div>
            <div class="chapter-pages-body" id="cp-body"><div class="torrent-hint">${icon('loader', { spin: true })} Loading pages…</div></div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    modal.querySelector('.modal-overlay').addEventListener('click', closeChapterPagesModal);
    modal.querySelector('[data-act="close"]').addEventListener('click', closeChapterPagesModal);

    const body = modal.querySelector('#cp-body');
    const countEl = modal.querySelector('#cp-count');
    let images = [];
    let swapFrom = null;
    let busy = false;
    let changed = false;

    const setImages = (list) => {
        images = (list || []).map(x => (typeof x === 'string' ? x : x?.url)).filter(Boolean);
    };

    const render = () => {
        countEl.textContent = `${images.length} page${images.length === 1 ? '' : 's'}`;
        if (images.length === 0) {
            body.innerHTML = '<div class="torrent-hint">No pages on disk for this version.</div>';
            return;
        }
        body.innerHTML = `<div class="chapter-pages-grid">${images.map((url, i) => {
            const name = fileNameOf(url);
            const picked = swapFrom === name;
            return `
            <figure class="chapter-page ${picked ? 'picked' : ''}" data-name="${esc(name)}">
                <img src="${esc(url)}${url.includes('?') ? '&' : '?'}t=${Date.now()}" alt="Page ${i + 1}" loading="lazy" decoding="async">
                <figcaption>
                    <span class="chapter-page-num">${i + 1}</span>
                    <span class="chapter-page-tools">
                        <button type="button" class="btn-icon small" data-tool="rotate" title="Rotate 90°">${icon('rotate-cw')}</button>
                        <button type="button" class="btn-icon small" data-tool="split" title="Cut this page in two">${icon('columns-2')}</button>
                        <button type="button" class="btn-icon small ${picked ? 'success' : ''}" data-tool="swap" title="${picked ? 'Cancel swap' : swapFrom ? 'Swap with the picked page' : 'Swap: pick this page, then another'}">${icon('arrow-left-right')}</button>
                        <button type="button" class="btn-icon small danger" data-tool="delete" title="Delete this page">${icon('trash-2')}</button>
                    </span>
                </figcaption>
            </figure>`;
        }).join('')}</div>`;
    };

    const load = async () => {
        if (!current) {
            body.innerHTML = `<div class="torrent-hint">${versions.length ? 'This folder is not linked to a downloaded version, so its pages cannot be edited here. Use the versions list on the chapter row to delete it.' : 'This chapter has no pages on disk.'}</div>`;
            countEl.textContent = '';
            return;
        }
        try {
            const data = await api.getReaderImages(mangaId, num, current);
            setImages(data.images);
            render();
        } catch (e) {
            body.innerHTML = `<div class="torrent-hint error">${esc(e.message)}</div>`;
        }
    };

    const run = async (label, fn) => {
        if (busy) return;
        busy = true;
        body.classList.add('busy');
        try {
            const result = await fn();
            changed = true;
            if (result && Array.isArray(result.images)) { setImages(result.images); render(); }
            else await load();
        } catch (e) {
            showToast(`${label} failed: ${e.message}`, 'error');
        } finally {
            busy = false;
            body.classList.remove('busy');
        }
    };

    body.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-tool]');
        if (!btn) return;
        const name = btn.closest('.chapter-page')?.dataset.name;
        if (!name) return;
        const tool = btn.dataset.tool;
        if (tool === 'rotate') return run('Rotate', () => api.rotatePage(mangaId, num, name, 90, current));
        if (tool === 'split') return run('Split', () => api.splitPage(mangaId, num, name, current));
        if (tool === 'delete') {
            if (!confirm(`Delete page "${name}" from disk?`)) return;
            return run('Delete', () => api.deletePage(mangaId, num, name, current));
        }
        if (tool === 'swap') {
            if (swapFrom === name) { swapFrom = null; render(); return; }
            if (!swapFrom) { swapFrom = name; render(); return; }
            const from = swapFrom;
            swapFrom = null;
            return run('Swap', () => api.swapPages(mangaId, num, from, name, current));
        }
    });

    modal.querySelector('#cp-version')?.addEventListener('change', (e) => {
        current = e.target.value;
        swapFrom = null;
        load();
    });
    modal.querySelector('#cp-read').addEventListener('click', () => {
        closeChapterPagesModal();
        window.location.hash = `#/read/${mangaId}/${num}${current ? `?version=${encodeURIComponent(current)}` : ''}`;
    });

    // Tell the manga page to refresh its counts once the dialog closes after an edit
    const observer = new MutationObserver(() => {
        if (!document.getElementById(MODAL_ID)) {
            observer.disconnect();
            if (changed && typeof onChanged === 'function') onChanged();
        }
    });
    observer.observe(document.body, { childList: true });

    load();
}

export default { openChapterPagesModal, closeChapterPagesModal };
