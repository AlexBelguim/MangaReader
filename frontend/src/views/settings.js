import { api } from '../api.js';
import { showToast } from '../utils/toast.js';
import { renderHeader } from '../components/header.js';
import { router } from '../router.js';
import { session } from '../session.js';
import { icon, placeholder, coverImg } from '../icons.js';

const SLIDESHOW_DEFAULTS = {
    disabledMangaIds: [],
    includeLists: false,
    includeTrophies: false,
    intervalMs: 8000,
    shuffle: false
};

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default {
    mount: async (params) => {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${renderHeader()}
            <div class="settings-container">
                <header class="settings-header">
                    <h1>Settings</h1>
                </header>
                <div class="settings-content">
                    <div id="settings-loader" class="loader">Loading settings...</div>
                    <form id="settings-form" style="display: none;">
                        <div class="settings-group">
                            <h2>General</h2>
                            <div class="setting-item">
                                <label for="theme">Theme</label>
                                <select id="theme" name="theme">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="system">System Default</option>
                                </select>
                            </div>

                            <!-- Add more settings here as needed -->

                            <div class="settings-actions">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </form>

                    <div class="settings-group" id="anilist-group" style="display: none;">
                        <h2>AniList</h2>
                        <div id="anilist-status" class="setting-item">Loading…</div>
                        <div class="settings-actions">
                            <button id="anilist-connect" class="btn btn-primary" style="display: none;">Connect AniList</button>
                            <button id="anilist-sync" class="btn btn-secondary" style="display: none;">Sync from AniList</button>
                            <button id="anilist-disconnect" class="btn btn-secondary" style="display: none;">Disconnect</button>
                        </div>
                        <div id="anilist-sync-result"></div>
                    </div>

                    <div class="settings-group" id="slideshow-group">
                        <h2>Slideshow</h2>
                        <p class="settings-hint">Fullscreen slideshow of your volume covers. Pick which manga to include — only manga with volumes are listed.</p>
                        <div class="setting-item">
                            <label for="slideshow-interval">Slide duration</label>
                            <select id="slideshow-interval">
                                <option value="3000">3 seconds</option>
                                <option value="5000">5 seconds</option>
                                <option value="8000">8 seconds</option>
                                <option value="10000">10 seconds</option>
                                <option value="15000">15 seconds</option>
                                <option value="30000">30 seconds</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-shuffle">Shuffle order</label>
                            <input type="checkbox" id="slideshow-shuffle">
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-lists">Include gallery lists</label>
                            <input type="checkbox" id="slideshow-lists">
                        </div>
                        <div class="setting-item">
                            <label for="slideshow-trophies">Include trophy pages</label>
                            <input type="checkbox" id="slideshow-trophies">
                        </div>
                        <div id="slideshow-manga-list" class="slideshow-manga-list">
                            <div class="loader">Loading manga…</div>
                        </div>
                        <div class="settings-actions">
                            <button id="slideshow-start" class="btn btn-primary">${icon('images')} Start Slideshow</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load settings
        let loadedSettings = {};
        try {
            const settings = await api.get('/settings') || {};
            loadedSettings = settings;

            const form = document.getElementById('settings-form');
            const loader = document.getElementById('settings-loader');

            // Populate form
            if (settings.theme) {
                document.getElementById('theme').value = settings.theme;
            }

            loader.style.display = 'none';
            // Clear the inline display so the stylesheet controls the layout.
            form.style.display = '';

            // Handle submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const updates = {};

                for (const [key, value] of formData.entries()) {
                    updates[key] = value;
                }

                try {
                    await api.post('/settings/bulk', updates);
                    showToast('Settings saved successfully');

                    // Apply immediate effects if any
                    if (updates.theme) {
                        // document.documentElement.setAttribute('data-theme', updates.theme);
                    }
                } catch (err) {
                    console.error(err);
                    showToast('Failed to save settings', 'error');
                }
            });

        } catch (err) {
            console.error(err);
            document.getElementById('settings-loader').textContent = 'Error loading settings';
        }

        // ---- AniList section ----
        if (window.location.hash.includes('anilist=connected')) {
            showToast('AniList connected');
        }

        const anilistGroup = document.getElementById('anilist-group');
        const statusEl = document.getElementById('anilist-status');
        const connectBtn = document.getElementById('anilist-connect');
        const syncBtn = document.getElementById('anilist-sync');
        const disconnectBtn = document.getElementById('anilist-disconnect');
        const syncResultEl = document.getElementById('anilist-sync-result');

        const refreshAnilistStatus = async () => {
            // Show the section even if the status call fails (e.g. old backend
            // without the AniList routes) — otherwise it hides silently.
            anilistGroup.style.display = 'block';
            try {
                const status = await api.anilistStatus();

                if (!status.configured) {
                    statusEl.textContent = 'Not configured — set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env and restart the server.';
                    connectBtn.style.display = 'none';
                    syncBtn.style.display = 'none';
                    disconnectBtn.style.display = 'none';
                } else if (!status.connected) {
                    statusEl.textContent = 'Not connected. Link your AniList account to sync reading progress.';
                    connectBtn.style.display = '';
                    syncBtn.style.display = 'none';
                    disconnectBtn.style.display = 'none';
                } else {
                    statusEl.textContent = `Connected as ${status.anilistUsername || 'AniList user'}.`;
                    connectBtn.style.display = 'none';
                    syncBtn.style.display = '';
                    disconnectBtn.style.display = '';
                }
            } catch (err) {
                console.error(err);
                statusEl.textContent = 'Failed to load AniList status — is the server running the latest code?';
            }
        };

        connectBtn.addEventListener('click', async () => {
            try {
                const { url } = await api.anilistAuthUrl();
                window.location.href = url;
            } catch (err) {
                showToast(err.message || 'Failed to start AniList connection', 'error');
            }
        });

        disconnectBtn.addEventListener('click', async () => {
            try {
                await api.anilistDisconnect();
                showToast('AniList disconnected');
                refreshAnilistStatus();
            } catch (err) {
                showToast('Failed to disconnect', 'error');
            }
        });

        syncBtn.addEventListener('click', async () => {
            syncBtn.disabled = true;
            statusEl.textContent = 'Syncing from AniList…';
            try {
                const result = await api.anilistPull();
                if (result.updated.length === 0) {
                    syncResultEl.textContent = 'Everything already up to date.';
                } else {
                    syncResultEl.innerHTML = '<ul>' + result.updated.map(u =>
                        `<li>${u.title} — marked read up to chapter ${u.markedUpTo}</li>`
                    ).join('') + '</ul>';
                }
                showToast(`AniList sync: ${result.updated.length} manga updated`);
            } catch (err) {
                syncResultEl.textContent = '';
                showToast(err.message || 'AniList sync failed', 'error');
            } finally {
                syncBtn.disabled = false;
                refreshAnilistStatus();
            }
        });

        refreshAnilistStatus();

        // ---- Slideshow section ----
        const cfg = { ...SLIDESHOW_DEFAULTS, ...(loadedSettings.slideshow || {}) };
        cfg.disabledMangaIds = [...(cfg.disabledMangaIds || [])];

        const intervalSel = document.getElementById('slideshow-interval');
        const shuffleCb = document.getElementById('slideshow-shuffle');
        const listsCb = document.getElementById('slideshow-lists');
        const trophiesCb = document.getElementById('slideshow-trophies');
        const mangaListEl = document.getElementById('slideshow-manga-list');

        intervalSel.value = String(cfg.intervalMs);
        if (!intervalSel.value) intervalSel.value = '8000';
        shuffleCb.checked = !!cfg.shuffle;
        listsCb.checked = !!cfg.includeLists;
        trophiesCb.checked = !!cfg.includeTrophies;

        const saveSlideshow = async () => {
            if (session.isDemo) return; // demo settings are read-only
            try {
                await api.post('/settings', { key: 'slideshow', value: cfg });
            } catch (err) {
                console.error(err);
                showToast('Failed to save slideshow settings', 'error');
            }
        };

        intervalSel.addEventListener('change', () => {
            cfg.intervalMs = parseInt(intervalSel.value, 10) || 8000;
            saveSlideshow();
        });
        shuffleCb.addEventListener('change', () => { cfg.shuffle = shuffleCb.checked; saveSlideshow(); });
        listsCb.addEventListener('change', () => { cfg.includeLists = listsCb.checked; saveSlideshow(); });
        trophiesCb.addEventListener('change', () => { cfg.includeTrophies = trophiesCb.checked; saveSlideshow(); });

        document.getElementById('slideshow-start').addEventListener('click', () => {
            // Request fullscreen inside the click gesture — the slideshow view
            // itself can't reliably do it after an async mount.
            document.documentElement.requestFullscreen?.().catch(() => {});
            router.go('/slideshow');
        });

        try {
            const mangaList = await api.getAllVolumes();
            if (mangaList.length === 0) {
                mangaListEl.innerHTML = '<p class="settings-hint">No manga with volumes yet — create volumes from a manga\'s page first.</p>';
            } else {
                const disabled = new Set(cfg.disabledMangaIds);
                mangaListEl.innerHTML = mangaList.map(m => {
                    const name = esc(m.alias || m.title);
                    const covered = m.volumes.filter(v => v.cover).length;
                    const coverUrl = m.localCover
                        ? `/api/public/covers/${m.id}/${encodeURIComponent(m.localCover.split(/[/\\]/).pop())}`
                        : m.cover;
                    const noCovers = covered === 0;
                    return `
                        <label class="slideshow-manga-row${noCovers ? ' no-covers' : ''}" title="${noCovers ? 'No volume covers yet' : name}">
                            <input type="checkbox" data-manga-id="${m.id}" ${!disabled.has(m.id) && !noCovers ? 'checked' : ''} ${noCovers ? 'disabled' : ''}>
                            <span class="slideshow-manga-thumb">${coverUrl ? coverImg(coverUrl, name, { kind: 'book' }) : placeholder('book')}</span>
                            <span class="slideshow-manga-info">
                                <span class="slideshow-manga-name">${name}</span>
                                <span class="slideshow-manga-meta">${m.volumes.length} volume${m.volumes.length === 1 ? '' : 's'} · ${covered} cover${covered === 1 ? '' : 's'}</span>
                            </span>
                        </label>
                    `;
                }).join('');

                mangaListEl.addEventListener('change', (e) => {
                    const cb = e.target.closest('input[data-manga-id]');
                    if (!cb) return;
                    const id = cb.dataset.mangaId;
                    if (cb.checked) {
                        cfg.disabledMangaIds = cfg.disabledMangaIds.filter(x => x !== id);
                    } else if (!cfg.disabledMangaIds.includes(id)) {
                        cfg.disabledMangaIds.push(id);
                    }
                    saveSlideshow();
                });
            }
        } catch (err) {
            console.error(err);
            mangaListEl.innerHTML = '<p class="settings-hint">Failed to load manga list.</p>';
        }
    }
};
