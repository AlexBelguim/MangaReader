/**
 * Volume manager: every volume of a manga in one list, to rename,
 * renumber, reorder and delete without opening each one. Opened from
 * the volumes section of a manga page.
 */

import { api } from './api.js';
import { showToast } from './utils/toast.js';
import { icon } from './icons.js';
import { confirmDialog, promptDialog } from './utils/dialog.js';

const MODAL_ID = 'volume-manager-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function closeVolumeManager() {
    document.getElementById(MODAL_ID)?.remove();
    document.removeEventListener('keydown', onKey);
}

function onKey(e) {
    if (e.key === 'Escape') closeVolumeManager();
}

function kindText(vol) {
    if (vol.kind === 'release') return `${vol.source === 'torrent' ? 'Torrent' : 'Archive'} release · ${vol.pageCount || 0} pages`;
    const n = (vol.chapters || []).length;
    return `Chapter collection · ${n} chapter${n === 1 ? '' : 's'}`;
}

/**
 * @param {object} manga  the bookmark with its volumes
 * @param {{ onChanged?: Function }} opts  called after anything was saved or deleted
 */
export function openVolumeManager(manga, { onChanged } = {}) {
    closeVolumeManager();
    let volumes = [...(manga.volumes || [])];
    let dirty = false;

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open torrent-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${icon('settings')} Manage volumes</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="torrent-body" id="vm-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-danger" id="vm-delete" disabled>Delete selected</button>
                <span class="spacer"></span>
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
                <button type="button" class="btn btn-primary" id="vm-save" disabled>Save changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    const body = modal.querySelector('#vm-body');
    const deleteBtn = modal.querySelector('#vm-delete');
    const saveBtn = modal.querySelector('#vm-save');
    const close = () => {
        closeVolumeManager();
        if (dirty && typeof onChanged === 'function') onChanged();
    };
    modal.querySelector('.modal-overlay').addEventListener('click', close);
    modal.querySelectorAll('[data-act="close"]').forEach(b => b.addEventListener('click', close));

    const render = () => {
        body.innerHTML = volumes.length === 0
            ? '<div class="torrent-hint">No volumes left.</div>'
            : `
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="vm-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="vm-none">Select none</button>
                <span class="torrent-hint">Edit a name or number and press Save. Deleting a release volume removes its pages from disk.</span>
            </div>
            <table class="torrent-table volume-manager-table">
                <thead><tr><th></th><th></th><th>No.</th><th>Name</th><th>Kind</th><th>Order</th><th></th></tr></thead>
                <tbody>
                ${volumes.map((vol, i) => `
                    <tr data-id="${esc(vol.id)}">
                        <td><input type="checkbox" class="vm-pick"></td>
                        <td>${vol.cover ? `<img class="vm-cover" src="${esc(vol.cover)}" alt="">` : `<span class="vm-cover vm-cover-empty">${icon('book')}</span>`}</td>
                        <td><input type="number" step="any" min="0" class="vm-number" value="${vol.number ?? ''}" placeholder="–"></td>
                        <td><input type="text" class="vm-name" value="${esc(vol.name)}"></td>
                        <td class="vm-kind">${esc(kindText(vol))}</td>
                        <td class="vm-order">
                            <button type="button" class="btn-icon small vm-move" data-dir="up" title="Move up" ${i === 0 ? 'disabled' : ''}>${icon('chevron-up')}</button>
                            <button type="button" class="btn-icon small vm-move" data-dir="down" title="Move down" ${i === volumes.length - 1 ? 'disabled' : ''}>${icon('chevron-down')}</button>
                        </td>
                        <td><button type="button" class="btn-icon small danger vm-delete-one" title="Delete this volume">${icon('trash-2')}</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <div id="vm-result"></div>`;
        body.querySelector('#vm-all')?.addEventListener('click', () => { body.querySelectorAll('.vm-pick').forEach(c => { c.checked = true; }); refreshButtons(); });
        body.querySelector('#vm-none')?.addEventListener('click', () => { body.querySelectorAll('.vm-pick').forEach(c => { c.checked = false; }); refreshButtons(); });
        body.querySelectorAll('.vm-move').forEach(btn => btn.addEventListener('click', () => move(btn.closest('tr').dataset.id, btn.dataset.dir)));
        body.querySelectorAll('.vm-delete-one').forEach(btn => btn.addEventListener('click', () => remove([btn.closest('tr').dataset.id])));
        refreshButtons();
    };

    const rows = () => [...body.querySelectorAll('tr[data-id]')];
    const changes = () => rows().map(tr => {
        const vol = volumes.find(v => v.id === tr.dataset.id);
        const name = tr.querySelector('.vm-name').value.trim();
        const raw = tr.querySelector('.vm-number').value;
        const number = raw === '' ? null : parseFloat(raw);
        const patch = {};
        if (name && name !== vol.name) patch.name = name;
        if (number !== null && Number.isFinite(number) && number !== vol.number) patch.number = number;
        return { id: vol.id, patch, tr };
    }).filter(c => Object.keys(c.patch).length > 0);
    const picked = () => rows().filter(tr => tr.querySelector('.vm-pick').checked).map(tr => tr.dataset.id);

    const refreshButtons = () => {
        const n = picked().length;
        deleteBtn.disabled = n === 0;
        deleteBtn.textContent = n ? `Delete ${n} selected` : 'Delete selected';
        const c = changes().length;
        saveBtn.disabled = c === 0;
        saveBtn.textContent = c ? `Save ${c} change${c === 1 ? '' : 's'}` : 'Save changes';
    };
    body.addEventListener('input', refreshButtons);
    body.addEventListener('change', refreshButtons);

    const reload = async () => {
        const fresh = await api.getBookmark(manga.id);
        volumes = [...((fresh.bookmark || fresh).volumes || [])];
        render();
    };

    const move = async (id, dir) => {
        try {
            await api.reorderVolume(manga.id, id, dir);
            dirty = true;
            await reload();
        } catch (e) {
            showToast(`Could not move: ${e.message}`, 'error');
        }
    };

    const remove = async (ids) => {
        const chosen = volumes.filter(v => ids.includes(v.id));
        if (chosen.length === 0) return;
        const releases = chosen.filter(v => v.kind === 'release').length;
        const what = chosen.length === 1 ? `“${chosen[0].name}”` : `${chosen.length} volumes`;
        const pages = releases ? ` ${releases === chosen.length ? (chosen.length === 1 ? 'Its' : 'Their') : `${releases} of them are releases; their`} pages are removed from disk.` : '';
        if (!await confirmDialog(`Delete ${what}?${pages}`, { danger: true })) return;
        try {
            const r = await api.bulkDeleteVolumes(manga.id, ids);
            dirty = true;
            showToast(`Deleted ${r.deleted} volume${r.deleted === 1 ? '' : 's'}`, 'success');
            await reload();
        } catch (e) {
            showToast(`Delete failed: ${e.message}`, 'error');
        }
    };

    deleteBtn.addEventListener('click', () => remove(picked()));

    saveBtn.addEventListener('click', async () => {
        const list = changes();
        if (list.length === 0) return;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
        const errors = [];
        for (const c of list) {
            try {
                await api.updateVolume(manga.id, c.id, c.patch);
                dirty = true;
            } catch (e) {
                const vol = volumes.find(v => v.id === c.id);
                errors.push(`${vol?.name || c.id}: ${e.message}`);
            }
        }
        if (errors.length) showToast(errors.join(' · '), 'error');
        else showToast(`Saved ${list.length} change${list.length === 1 ? '' : 's'}`, 'success');
        await reload();
        if (errors.length) {
            const result = body.querySelector('#vm-result');
            if (result) result.innerHTML = `<ul class="task-error-list">${errors.map(esc).map(x => `<li>${x}</li>`).join('')}</ul>`;
        }
    });

    render();
}

export default { openVolumeManager, closeVolumeManager };
