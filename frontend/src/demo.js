/**
 * Demo page entry — public, read-only.
 *
 * Boots the same library/manga/reader views as the main app, but:
 *  - shows an 18+ age gate first (the demo library contains adult content)
 *  - logs in with a short-lived demo token (no credentials, read-only role)
 *  - restricts the router to /, /manga and /read
 *  - the backend (guardPermissions) rejects every mutation and all other
 *    API surface for the demo role; header/views hide the matching controls
 */

import { api } from './api.js';
import { router } from './router.js';
import { setSessionUser } from './session.js';

const AGE_GATE_KEY = 'demo_age_confirmed';
const DEMO_ROUTES = new Set(['/', '/manga', '/read']);

function waitForAgeGate() {
    const gate = document.getElementById('age-gate');
    if (!gate) return Promise.resolve();
    if (sessionStorage.getItem(AGE_GATE_KEY) === '1') {
        gate.remove();
        return Promise.resolve();
    }
    return new Promise(resolve => {
        document.getElementById('age-gate-enter').addEventListener('click', () => {
            sessionStorage.setItem(AGE_GATE_KEY, '1');
            gate.remove();
            resolve();
        });
    });
}

async function boot() {
    await waitForAgeGate();

    await api.demoLogin();

    // Demo tokens expire after 12h — silently get a fresh one instead of
    // bouncing the visitor to the login page.
    api.onUnauthorized = () => {
        api.demoLogin().catch(e => console.warn('[Demo] re-login failed:', e));
    };

    const { user } = await api.me();
    setSessionUser(user);

    // Persistent "nothing is saved" banner
    const banner = document.createElement('div');
    banner.className = 'demo-banner';
    banner.textContent = 'Demo — browsing only, changes are not saved';
    document.body.appendChild(banner);

    // Only browsing + reading; everything else falls back to the library
    for (const key of [...router.routes.keys()]) {
        if (!DEMO_ROUTES.has(key)) router.routes.delete(key);
    }

    router.init();

    const loading = document.querySelector('.loading-screen');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 300);
    }

    console.log('[Demo] Ready');
}

document.addEventListener('DOMContentLoaded', () => {
    boot().catch(err => {
        console.error('[Demo] boot failed:', err);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<div class="empty-state">Demo unavailable: ${err.message}</div>`;
        }
    });
});
