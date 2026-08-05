import { api } from '../api.js';
import { showToast } from '../utils/toast.js';
import { renderHeader } from '../components/header.js';

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
                </div>
            </div>
        `;

        // Load settings
        try {
            const settings = await api.get('/settings') || {};

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
    }
};
