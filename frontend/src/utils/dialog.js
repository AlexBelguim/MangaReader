/**
 * Styled replacements for the browser's confirm() and prompt(): a small
 * modal in the app's own look, returning a promise. Use `await` where a
 * confirm() used to sit inline.
 *
 *   if (!await confirmDialog('Delete this chapter?', { danger: true })) return;
 *   const { ok, option } = await confirmDialog('Delete files?', { option: 'Also hide the chapters' });
 *   const value = await promptDialog('Chapter number', { value: '12' });
 */

const MODAL_ID = 'app-dialog-modal';

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function closeDialog() {
    document.getElementById(MODAL_ID)?.remove();
}

function openDialog({ title, message, body = '', confirmText = 'OK', cancelText = 'Cancel', danger = false }) {
    closeDialog();
    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open app-dialog';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content app-dialog-content" role="dialog" aria-modal="true" ${title ? `aria-label="${esc(title)}"` : ''}>
            ${title ? `<div class="modal-header"><h2>${esc(title)}</h2></div>` : ''}
            <div class="app-dialog-body">
                ${message ? `<p class="app-dialog-message">${esc(message)}</p>` : ''}
                ${body}
            </div>
            <div class="app-dialog-footer">
                <button type="button" class="btn btn-secondary" data-act="cancel">${esc(cancelText)}</button>
                <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${esc(confirmText)}</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

/**
 * Ask for confirmation.
 * @param {string} message
 * @param {{ title?: string, confirmText?: string, cancelText?: string, danger?: boolean, option?: string }} [opts]
 *   `option`: label of a checkbox shown under the message; the result is
 *   then `{ ok, option }` instead of a boolean.
 * @returns {Promise<boolean | { ok: boolean, option: boolean }>}
 */
export function confirmDialog(message, opts = {}) {
    const { option = null, ...rest } = opts;
    const body = option
        ? `<label class="app-dialog-option"><input type="checkbox" id="app-dialog-option"> ${esc(option)}</label>`
        : '';
    return new Promise(resolve => {
        const modal = openDialog({ message, body, confirmText: rest.confirmText || (rest.danger ? 'Delete' : 'OK'), ...rest });
        const finish = (ok) => {
            const checked = option ? !!modal.querySelector('#app-dialog-option')?.checked : undefined;
            document.removeEventListener('keydown', onKey, true);
            closeDialog();
            resolve(option ? { ok, option: checked } : ok);
        };
        // Capture and stop: a dialog opened over another modal must not
        // close that one as well.
        const onKey = (e) => {
            if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); finish(false); }
            else if (e.key === 'Enter' && document.activeElement?.tagName !== 'BUTTON') { e.stopImmediatePropagation(); e.preventDefault(); finish(true); }
        };
        document.addEventListener('keydown', onKey, true);
        modal.querySelector('.modal-overlay').addEventListener('click', () => finish(false));
        modal.querySelector('[data-act="cancel"]').addEventListener('click', () => finish(false));
        modal.querySelector('[data-act="ok"]').addEventListener('click', () => finish(true));
        modal.querySelector('[data-act="ok"]').focus();
    });
}

/**
 * Ask for a value. Resolves with the string, or null when cancelled.
 * @param {string} message
 * @param {{ title?: string, value?: string, placeholder?: string, confirmText?: string, type?: string }} [opts]
 */
export function promptDialog(message, opts = {}) {
    const { value = '', placeholder = '', type = 'text', ...rest } = opts;
    const body = `<input class="app-dialog-input" id="app-dialog-input" type="${esc(type)}" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off">`;
    return new Promise(resolve => {
        const modal = openDialog({ message, body, confirmText: rest.confirmText || 'OK', ...rest });
        const input = modal.querySelector('#app-dialog-input');
        const finish = (ok) => {
            const v = input.value;
            document.removeEventListener('keydown', onKey, true);
            closeDialog();
            resolve(ok ? v : null);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); finish(false); }
            else if (e.key === 'Enter') { e.stopImmediatePropagation(); e.preventDefault(); finish(true); }
        };
        document.addEventListener('keydown', onKey, true);
        modal.querySelector('.modal-overlay').addEventListener('click', () => finish(false));
        modal.querySelector('[data-act="cancel"]').addEventListener('click', () => finish(false));
        modal.querySelector('[data-act="ok"]').addEventListener('click', () => finish(true));
        input.focus();
        input.select();
    });
}

export default { confirmDialog, promptDialog };
