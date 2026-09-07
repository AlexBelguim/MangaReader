/**
 * Assisted solve: pass a site's human-verification check from inside the
 * app, in the scraper's own browser.
 *
 * The server opens the site in a page of the scraper browser and streams
 * that page here as JPEG frames over the admin-only `/assist` socket
 * namespace (see server: services/assistedChallenge.js). Pointer and
 * keyboard events on the picture are sent back and replayed on the page,
 * so the person drags, clicks and types as if it were local. Once the site
 * accepts the check, the server keeps the cookies as the site's session,
 * lifts the block and closes the page; every download or check that was
 * waiting for the site resumes by itself.
 *
 * This is preferable to pasting cookies: the site then trusts exactly the
 * browser, identity and network address that the scrapers use.
 */

import { io } from 'socket.io-client';
import { api } from './api.js';
import { session } from './session.js';
import { showToast } from './utils/toast.js';
import { openCookieImportModal, openSite } from './site-challenge.js';

const MODAL_ID = 'site-assist-modal';
const NAMESPACE = '/assist';
// Modifier bits as CDP expects them
const MOD_ALT = 1, MOD_CTRL = 2, MOD_META = 4, MOD_SHIFT = 8;
const BUTTON_NAMES = ['left', 'middle', 'right'];

let current = null; // { site, socket, modal, ... } while a modal is open

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function modifiersOf(e) {
    return (e.altKey ? MOD_ALT : 0) | (e.ctrlKey ? MOD_CTRL : 0) | (e.metaKey ? MOD_META : 0) | (e.shiftKey ? MOD_SHIFT : 0);
}

export function closeAssistModal() {
    if (!current) return;
    const { socket, modal, site, onKey } = current;
    current = null;
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('keyup', onKey, true);
    try { socket.emit('assist:stop', { site }); } catch (e) { /* already gone */ }
    try { socket.disconnect(); } catch (e) { /* already gone */ }
    modal.remove();
}

/**
 * Open the streamed check for a site.
 * @param {{ site: string, url?: string, reason?: string, onSolved?: () => void }} opts
 */
export function openAssistModal({ site, url, reason, onSolved } = {}) {
    if (!site) return;
    if (!session.isAdmin) {
        showToast('Only an admin can solve a site check for the scraper', 'error');
        return;
    }
    closeAssistModal();

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal open site-assist-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Solve ${esc(site)}'s check here</h2>
                <button class="modal-close" data-act="close" title="Close">×</button>
            </div>
            <div class="site-assist-body">
                <p class="site-assist-intro">
                    ${reason === 'expired'
                        ? `${esc(site)}'s verification cookies ran out, so its work is on hold.`
                        : `${esc(site)} wants a person to pass its check before the scraper may continue.`}
                    Below is the scraper's own browser on the server. Complete the check in it, the way you would
                    in your browser (drag, click, type). When ${esc(site)} accepts it, the scraper keeps the cookies and
                    every waiting download or check resumes by itself.
                </p>
                <div class="site-assist-status" id="site-assist-status" data-status="connecting">Connecting…</div>
                <div class="site-assist-stage" id="site-assist-stage">
                    <canvas id="site-assist-canvas" width="1024" height="720" tabindex="0" aria-label="${esc(site)} in the scraper's browser"></canvas>
                    <div class="site-assist-overlay" id="site-assist-overlay">Waiting for the first picture…</div>
                </div>
                <div class="site-assist-hint">
                    Click the picture first so your keyboard goes to it. Escape closes this window.
                    Not working? <a href="#" data-act="paste">Paste cookies from your own browser</a> instead,
                    or <a href="#" data-act="open">open ${esc(site)}</a> yourself.
                </div>
            </div>
            <div class="site-assist-footer">
                <button type="button" class="btn btn-secondary" data-act="close">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const canvas = modal.querySelector('#site-assist-canvas');
    const ctx = canvas.getContext('2d');
    const statusEl = modal.querySelector('#site-assist-status');
    const overlay = modal.querySelector('#site-assist-overlay');

    const setStatus = (status, message) => {
        statusEl.dataset.status = status;
        statusEl.textContent = message || '';
    };

    // ── Streaming ──
    const socket = io(NAMESPACE, {
        auth: { token: api.getToken() },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
    });

    let live = false;   // frames arriving and input accepted
    let ended = false;
    const img = new Image();
    let pendingFrame = null;
    img.onload = () => {
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }
        ctx.drawImage(img, 0, 0);
        if (pendingFrame) { const next = pendingFrame; pendingFrame = null; img.src = next; }
    };
    img.onerror = () => { pendingFrame = null; };

    socket.on('connect', () => {
        setStatus('connecting', `Opening ${site} in the scraper's browser…`);
        socket.emit('assist:start', { site }, (reply) => {
            if (!reply || !reply.ok) {
                setStatus('error', reply?.error || 'The check could not be opened');
                overlay.textContent = reply?.error || 'The check could not be opened';
                overlay.hidden = false;
            }
        });
    });
    socket.on('connect_error', (err) => {
        setStatus('error', `Not connected: ${err.message}`);
        overlay.textContent = `Not connected: ${err.message}`;
        overlay.hidden = false;
    });
    socket.on('assist:state', (state) => {
        if (!state || state.site !== site) return;
        if (state.status === 'streaming') {
            live = true;
            overlay.hidden = true;
        }
        setStatus(state.status, state.message);
        if (state.status === 'solved') {
            live = false;
            showToast(`${site}: check passed, waiting work resumes`, 'success');
            if (typeof onSolved === 'function') onSolved();
            setTimeout(closeAssistModal, 2500);
        } else if (state.status === 'ended') {
            live = false;
            ended = true;
            overlay.textContent = state.message || 'The window was closed.';
            overlay.hidden = false;
            if (state.reason !== 'solved') {
                setStatus('ended', state.message);
            }
        } else if (state.status === 'error') {
            overlay.textContent = state.message;
            overlay.hidden = false;
        }
    });
    socket.on('assist:frame', (frame) => {
        if (!frame || frame.site !== site || ended) return;
        const src = `data:image/jpeg;base64,${frame.data}`;
        // Draw the newest frame; skip intermediates while one is decoding
        if (img.complete && !pendingFrame) img.src = src;
        else pendingFrame = src;
        if (!live) { live = true; overlay.hidden = true; }
    });

    // ── Input ──
    // Pointer positions are in the page's own pixels (the canvas bitmap
    // size), whatever size the canvas is displayed at.
    const toPage = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        return { x: Math.round(x), y: Math.round(y) };
    };
    const send = (ev) => { if (live && !ended) socket.emit('assist:input', { site, ...ev }); };

    let moveQueued = null;
    const flushMove = () => {
        if (moveQueued) { send(moveQueued); moveQueued = null; }
    };
    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        canvas.focus();
        canvas.setPointerCapture(e.pointerId);
        const { x, y } = toPage(e);
        send({ type: 'mousedown', x, y, button: BUTTON_NAMES[e.button] || 'left', buttons: e.buttons, clickCount: 1, modifiers: modifiersOf(e) });
    });
    canvas.addEventListener('pointermove', (e) => {
        const { x, y } = toPage(e);
        const first = !moveQueued;
        moveQueued = { type: 'mousemove', x, y, button: e.buttons & 1 ? 'left' : e.buttons & 2 ? 'right' : 'none', buttons: e.buttons, modifiers: modifiersOf(e) };
        if (first) requestAnimationFrame(flushMove);
    });
    canvas.addEventListener('pointerup', (e) => {
        e.preventDefault();
        flushMove();
        const { x, y } = toPage(e);
        send({ type: 'mouseup', x, y, button: BUTTON_NAMES[e.button] || 'left', buttons: e.buttons, clickCount: 1, modifiers: modifiersOf(e) });
        try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* not captured */ }
    });
    canvas.addEventListener('pointercancel', (e) => {
        const { x, y } = toPage(e);
        send({ type: 'mouseup', x, y, button: 'left', buttons: 0, clickCount: 1 });
    });
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const { x, y } = toPage(e);
        send({ type: 'wheel', x, y, deltaX: e.deltaX, deltaY: e.deltaY, modifiers: modifiersOf(e) });
    }, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Keys go to the page while the picture has focus; Escape closes.
    const onKey = (e) => {
        if (!current || current.modal !== modal) return;
        if (e.key === 'Escape') {
            if (e.type === 'keydown') closeAssistModal();
            return;
        }
        if (document.activeElement !== canvas) return;
        e.preventDefault();
        e.stopPropagation();
        const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey;
        send({ type: e.type, key: e.key, code: e.code, keyCode: e.keyCode, text: printable ? e.key : undefined, modifiers: modifiersOf(e) });
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('keyup', onKey, true);

    // ── Chrome ──
    modal.querySelector('.modal-overlay').addEventListener('click', closeAssistModal);
    modal.querySelectorAll('[data-act="close"]').forEach(b => b.addEventListener('click', closeAssistModal));
    modal.querySelector('[data-act="paste"]').addEventListener('click', (e) => {
        e.preventDefault();
        closeAssistModal();
        openCookieImportModal({ site, url, stale: reason === 'expired' || reason === 'rejected' });
    });
    modal.querySelector('[data-act="open"]').addEventListener('click', (e) => {
        e.preventDefault();
        openSite(site, url);
    });

    current = { site, socket, modal, onKey };
    canvas.focus();
}

export default { openAssistModal, closeAssistModal };
