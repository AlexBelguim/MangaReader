/**
 * Import a release that is already on disk - in the folder qBittorrent
 * saves to, or anywhere a path mapping points at - without downloading
 * anything: browse to the folder (or .cbz/.zip), then review what it would
 * import as (the same dialog a finished torrent gets) and import it.
 * Opened from the manga page ("Import from folder").
 */

import { api } from './api.js';
import { icon } from './icons.js';
import { formatBytes } from './torrent-search.js';
import { openImportReviewModal } from './import-review.js';

const MODAL_ID = 'folder-import-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function closeFolderImportModal() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
}

function onKey(e) {
    if (e.key === 'Escape') closeFolderImportModal();
}

/**
 * @param {{ bookmarkId?: string|null, bookmarkTitle?: string, onImported?: Function }} opts
 *   Without a bookmark the review dialog offers a new series or any library title.
 */
export function openFolderImportModal({ bookmarkId = null, bookmarkTitle = '', onImported } = {}) {
    closeFolderImportModal();
    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open torrent-modal folder-import-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${icon('folder')} Import from folder${bookmarkTitle ? ` into ${esc(bookmarkTitle)}` : ''}</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body">
                <p class="torrent-hint">Pick a release folder (or a single .cbz/.zip) that is already on disk. Only the torrent save path and the path mappings from Settings can be browsed. Nothing is downloaded and the source files are left as they are.</p>
                <div class="folder-crumbs" id="fi-crumbs"></div>
                <div class="folder-list" id="fi-list"><div class="torrent-hint">${icon('loader', { spin: true })} Loading…</div></div>
            </div>
            <div class="modal-footer">
                <span class="torrent-hint" id="fi-current"></span>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Cancel</button>
                <button type="button" class="btn btn-primary" id="fi-import" disabled>Import this folder</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    modal.querySelector('.modal-overlay').addEventListener('click', closeFolderImportModal);
    modal.querySelectorAll('[data-act="close"]').forEach(b => b.addEventListener('click', closeFolderImportModal));

    const crumbs = modal.querySelector('#fi-crumbs');
    const list = modal.querySelector('#fi-list');
    const currentEl = modal.querySelector('#fi-current');
    const importBtn = modal.querySelector('#fi-import');
    let current = null;   // folder shown
    let picked = null;    // { path, name, kind } chosen for import (folder shown, or a highlighted entry)

    const setPicked = (entry) => {
        picked = entry;
        importBtn.disabled = !entry;
        importBtn.textContent = entry?.kind === 'archive' ? 'Import this archive' : 'Import this folder';
        currentEl.textContent = entry ? entry.path : '';
        list.querySelectorAll('.folder-entry').forEach(el => el.classList.toggle('picked', !!entry && el.dataset.path === entry.path));
    };

    const load = async (dirPath) => {
        list.innerHTML = `<div class="torrent-hint">${icon('loader', { spin: true })} Loading…</div>`;
        let data;
        try {
            data = await api.browseImportFolders(dirPath);
        } catch (e) {
            list.innerHTML = `<div class="torrent-hint error">${esc(e.message)}</div>`;
            crumbs.innerHTML = '';
            setPicked(null);
            return;
        }
        current = data.path;
        crumbs.innerHTML = data.path
            ? `<button type="button" class="btn btn-sm btn-secondary" data-go="">${icon('hard-drive')} Roots</button>
               ${data.parent ? `<button type="button" class="btn btn-sm btn-secondary" data-go="${esc(data.parent)}">${icon('chevron-left')} Up</button>` : ''}
               <span class="folder-path" title="${esc(data.path)}">${esc(data.path)}</span>`
            : `<span class="folder-path">Folders this app may import from</span>`;
        crumbs.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => load(b.dataset.go || null)));

        const entries = data.entries || [];
        list.innerHTML = entries.length
            ? entries.map(e => `
                <div class="folder-entry ${e.exists === false ? 'missing' : ''}" data-path="${esc(e.path)}" data-kind="${e.kind}" data-name="${esc(e.name)}">
                    <span class="folder-entry-icon">${e.kind === 'dir' ? icon('folder') : icon('package')}</span>
                    <span class="folder-entry-name">${esc(e.name)}${e.exists === false ? ' <small>(not found on this machine)</small>' : ''}</span>
                    <span class="folder-entry-meta">${e.kind === 'archive' ? formatBytes(e.size) : ''}</span>
                    ${e.kind === 'dir' && e.exists !== false ? `<button type="button" class="btn btn-sm btn-secondary" data-open="${esc(e.path)}">Open</button>` : ''}
                </div>`).join('')
            : '<div class="torrent-hint">Empty: no sub-folders and no .cbz/.zip files here.</div>';

        list.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', (ev) => { ev.stopPropagation(); load(b.dataset.open); }));
        list.querySelectorAll('.folder-entry').forEach(el => {
            el.addEventListener('click', () => {
                if (el.classList.contains('missing')) return;
                setPicked({ path: el.dataset.path, name: el.dataset.name, kind: el.dataset.kind });
            });
            el.addEventListener('dblclick', () => { if (el.dataset.kind === 'dir' && !el.classList.contains('missing')) load(el.dataset.path); });
        });
        // The folder being shown is importable as a whole (not the roots list)
        setPicked(data.path && !data.roots.includes(data.path) ? { path: data.path, name: data.path.split(/[\\/]/).pop(), kind: 'dir' } : null);
    };

    importBtn.addEventListener('click', () => {
        if (!picked) return;
        const source = { path: picked.path, name: picked.name, bookmarkId, bookmarkTitle };
        closeFolderImportModal();
        openImportReviewModal(source, { onImported });
    });

    load(null);
}

export default { openFolderImportModal, closeFolderImportModal };
