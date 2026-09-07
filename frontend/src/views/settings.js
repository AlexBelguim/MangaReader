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

// ==================== TORRENTS (Prowlarr + qBittorrent) ====================
// Admin only. Works like Sonarr's indexer / download-client settings: one
// Prowlarr URL + API key for searching, qBittorrent's WebUI login for grabs,
// and remote path mappings when qBittorrent sees the download folder under
// another path than this app does.

function renderTorrentsSection() {
    return `
        <div class="settings-group" id="torrents-group">
            <h2>Torrents</h2>
            <p class="settings-hint">Search volume releases through Prowlarr and download them with qBittorrent. Finished downloads are imported as volumes with their own pages.</p>

            <h3 class="settings-subhead">Prowlarr</h3>
            <div class="form-group">
                <label for="tor-prowlarr-url">URL</label>
                <input type="url" id="tor-prowlarr-url" placeholder="http://truenas.local:9696" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="tor-prowlarr-key">API key <span class="settings-hint-inline">(Prowlarr → Settings → General)</span></label>
                <input type="password" id="tor-prowlarr-key" autocomplete="new-password">
            </div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="tor-test-prowlarr">Test connection</button>
                <span class="torrents-test-result" id="tor-prowlarr-result"></span>
            </div>

            <h3 class="settings-subhead">qBittorrent</h3>
            <div class="form-group">
                <label for="tor-qbt-url">Web UI URL</label>
                <input type="url" id="tor-qbt-url" placeholder="http://truenas.local:8080" autocomplete="off">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tor-qbt-user">Username</label>
                    <input type="text" id="tor-qbt-user" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="tor-qbt-pass">Password</label>
                    <input type="password" id="tor-qbt-pass" autocomplete="new-password">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tor-qbt-category">Category</label>
                    <input type="text" id="tor-qbt-category" placeholder="manga" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="tor-qbt-savepath">Save path <span class="settings-hint-inline">(optional, as qBittorrent sees it)</span></label>
                    <input type="text" id="tor-qbt-savepath" placeholder="/downloads/manga" autocomplete="off">
                </div>
            </div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="tor-test-qbt">Test connection</button>
                <span class="torrents-test-result" id="tor-qbt-result"></span>
            </div>

            <h3 class="settings-subhead">Path mappings</h3>
            <p class="settings-hint">qBittorrent reports where it saved a download using its own paths. If this app sees that folder under a different path (a different container mount, or a network share), map the prefix here. Leave empty when both run on the same machine with the same paths.</p>
            <div id="tor-path-mappings"></div>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary btn-sm" id="tor-add-mapping">${icon('plus')} Add mapping</button>
            </div>

            <div class="setting-item">
                <label for="tor-auto-import">Import finished downloads automatically</label>
                <input type="checkbox" id="tor-auto-import" checked>
            </div>

            <div class="settings-actions">
                <span class="torrents-test-result" id="tor-save-result"></span>
                <button type="button" class="btn btn-primary" id="tor-save">Save torrent settings</button>
            </div>
        </div>
    `;
}

function renderCleanupSection() {
    return `
        <div class="settings-group" id="cleanup-group">
            <h2>Downloads folder</h2>
            <p class="settings-hint">Find folders on disk that nothing in the library refers to any more: chapter versions whose download was removed, volumes that were deleted, series folders left behind by a renamed alias, and unfinished imports. Scanning changes nothing; you choose what to delete.</p>
            <div class="settings-actions torrents-actions">
                <button type="button" class="btn btn-secondary" id="cleanup-scan">${icon('search')} Scan for leftovers</button>
                <span class="torrents-test-result" id="cleanup-summary"></span>
            </div>
            <div id="cleanup-results"></div>
        </div>
    `;
}

async function initCleanupSection() {
    const $ = (id) => document.getElementById(id);
    const scanBtn = $('cleanup-scan');
    const summary = $('cleanup-summary');
    const results = $('cleanup-results');
    if (!scanBtn) return;

    const fmt = (n) => {
        if (!n) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0; let v = n;
        while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
        return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
    };
    const kindLabel = { series: 'Series folder', chapter: 'Chapter folder', volume: 'Volume folder', temp: 'Unfinished import' };

    const picked = () => [...results.querySelectorAll('.cl-pick:checked')].map(cb => cb.value);
    const updateDeleteBtn = () => {
        const btn = results.querySelector('#cleanup-delete');
        if (!btn) return;
        const n = picked().length;
        btn.disabled = n === 0;
        btn.textContent = n ? `Delete ${n} selected` : 'Delete selected';
    };

    const render = (data) => {
        if (!data.groups.length) {
            results.innerHTML = '<p class="settings-hint">Nothing left over. Every folder on disk is in use.</p>';
            return;
        }
        results.innerHTML = `
            <div class="review-tools">
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-all">Select all</button>
                <button type="button" class="btn btn-sm btn-secondary" id="cleanup-none">Select none</button>
                <span class="spacer"></span>
                <button type="button" class="btn btn-sm btn-danger" id="cleanup-delete" disabled>Delete selected</button>
            </div>
            ${data.groups.map(g => `
                <div class="cleanup-group">
                    <div class="cleanup-series">${icon('book-open')} ${esc(g.series)}${g.bookmarkIds.length ? '' : ' <small>(no series in the library)</small>'}</div>
                    ${g.items.map(it => `
                        <label class="cleanup-item">
                            <input type="checkbox" class="cl-pick" value="${esc(it.path)}">
                            <span class="cleanup-kind">${kindLabel[it.kind] || it.kind}</span>
                            <span class="cleanup-name" title="${esc(it.path)}">${esc(it.name)}</span>
                            <span class="cleanup-note">${esc(it.note)}</span>
                            <span class="cleanup-size">${fmt(it.size)}</span>
                        </label>`).join('')}
                </div>`).join('')}
            <div id="cleanup-result"></div>
        `;
        results.querySelector('#cleanup-all').addEventListener('click', () => { results.querySelectorAll('.cl-pick').forEach(cb => { cb.checked = true; }); updateDeleteBtn(); });
        results.querySelector('#cleanup-none').addEventListener('click', () => { results.querySelectorAll('.cl-pick').forEach(cb => { cb.checked = false; }); updateDeleteBtn(); });
        results.addEventListener('change', updateDeleteBtn);
        results.querySelector('#cleanup-delete').addEventListener('click', async () => {
            const paths = picked();
            if (!paths.length) return;
            const size = data.groups.flatMap(g => g.items).filter(it => paths.includes(it.path)).reduce((a, it) => a + it.size, 0);
            if (!confirm(`Delete ${paths.length} folder${paths.length === 1 ? '' : 's'} from disk (${fmt(size)})? This cannot be undone.`)) return;
            const btn = results.querySelector('#cleanup-delete');
            btn.disabled = true;
            btn.textContent = 'Deleting…';
            try {
                const r = await api.removeDownloadLeftovers(paths);
                showToast(`Deleted ${r.removed.length} folder${r.removed.length === 1 ? '' : 's'}, freed ${fmt(r.freed)}`, 'success');
                if (r.skipped.length) {
                    results.querySelector('#cleanup-result').innerHTML = `<ul class="task-error-list">${r.skipped.map(s => `<li>${esc(s.path)}: ${esc(s.reason)}</li>`).join('')}</ul>`;
                }
                await scan();
            } catch (e) {
                showToast(`Delete failed: ${e.message}`, 'error');
                updateDeleteBtn();
            }
        });
    };

    const scan = async () => {
        scanBtn.disabled = true;
        summary.textContent = 'Scanning…';
        try {
            const data = await api.getDownloadLeftovers();
            summary.textContent = data.totalItems
                ? `${data.totalItems} leftover${data.totalItems === 1 ? '' : 's'}, ${fmt(data.totalSize)}`
                : 'Nothing left over';
            render(data);
        } catch (e) {
            summary.textContent = `Scan failed: ${e.message}`;
        } finally {
            scanBtn.disabled = false;
        }
    };
    scanBtn.addEventListener('click', scan);
}

async function initTorrentsSection() {
    const $ = (id) => document.getElementById(id);
    const mappingsEl = $('tor-path-mappings');
    if (!mappingsEl) return;

    const renderMappings = (list) => {
        mappingsEl.innerHTML = list.length
            ? list.map((m, i) => `
                <div class="tor-mapping" data-index="${i}">
                    <input type="text" class="tor-map-from" value="${esc(m.from)}" placeholder="qBittorrent path, e.g. /downloads">
                    <span class="tor-map-arrow">→</span>
                    <input type="text" class="tor-map-to" value="${esc(m.to)}" placeholder="path this app sees, e.g. /app/torrents">
                    <button type="button" class="btn-icon small danger tor-map-remove" title="Remove">×</button>
                </div>`).join('')
            : '<p class="settings-hint">No mappings.</p>';
        mappingsEl.querySelectorAll('.tor-map-remove').forEach(btn => btn.addEventListener('click', () => {
            btn.closest('.tor-mapping').remove();
            if (!mappingsEl.querySelector('.tor-mapping')) renderMappings([]);
        }));
    };
    // Every row as typed (to re-render) and only the complete ones (to save)
    const readMappingRows = () => [...mappingsEl.querySelectorAll('.tor-mapping')]
        .map(row => ({ from: row.querySelector('.tor-map-from').value.trim(), to: row.querySelector('.tor-map-to').value.trim() }));
    const readMappings = () => readMappingRows().filter(m => m.from && m.to);

    const formValues = () => ({
        prowlarr: { baseUrl: $('tor-prowlarr-url').value.trim(), apiKey: $('tor-prowlarr-key').value },
        qbittorrent: {
            baseUrl: $('tor-qbt-url').value.trim(),
            username: $('tor-qbt-user').value.trim(),
            password: $('tor-qbt-pass').value,
            category: $('tor-qbt-category').value.trim() || 'manga',
            savePath: $('tor-qbt-savepath').value.trim()
        },
        pathMappings: readMappings(),
        autoImport: $('tor-auto-import').checked
    });

    const show = (el, ok, text) => {
        el.textContent = text;
        el.className = `torrents-test-result ${ok ? 'ok' : 'error'}`;
    };

    try {
        const { settings } = await api.getTorrentSettings();
        $('tor-prowlarr-url').value = settings.prowlarr.baseUrl || '';
        $('tor-prowlarr-key').value = settings.prowlarr.apiKey || '';
        $('tor-qbt-url').value = settings.qbittorrent.baseUrl || '';
        $('tor-qbt-user').value = settings.qbittorrent.username || '';
        $('tor-qbt-pass').value = settings.qbittorrent.password || '';
        $('tor-qbt-category').value = settings.qbittorrent.category || 'manga';
        $('tor-qbt-savepath').value = settings.qbittorrent.savePath || '';
        $('tor-auto-import').checked = settings.autoImport !== false;
        renderMappings(settings.pathMappings || []);
    } catch (e) {
        renderMappings([]);
        show($('tor-save-result'), false, `Could not load torrent settings: ${e.message}`);
    }

    $('tor-add-mapping').addEventListener('click', () => renderMappings([...readMappingRows(), { from: '', to: '' }]));

    const runTest = async (service, btn, resultEl) => {
        btn.disabled = true;
        resultEl.textContent = 'Testing…';
        resultEl.className = 'torrents-test-result';
        try {
            const { result } = await api.testTorrentService(service, formValues()[service]);
            if (service === 'prowlarr') {
                show(resultEl, true, `Connected: ${result.appName} ${result.version}${result.indexers !== null ? `, ${result.indexers} indexer${result.indexers === 1 ? '' : 's'} enabled` : ''}`);
            } else {
                show(resultEl, true, `Connected: qBittorrent ${result.version}${result.savePath ? `, default save path ${result.savePath}` : ''}`);
            }
        } catch (e) {
            show(resultEl, false, e.message);
        } finally {
            btn.disabled = false;
        }
    };
    $('tor-test-prowlarr').addEventListener('click', (e) => runTest('prowlarr', e.currentTarget, $('tor-prowlarr-result')));
    $('tor-test-qbt').addEventListener('click', (e) => runTest('qbittorrent', e.currentTarget, $('tor-qbt-result')));

    $('tor-save').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
            const { settings } = await api.saveTorrentSettings(formValues());
            // Secrets come back masked; keep the fields showing that
            $('tor-prowlarr-key').value = settings.prowlarr.apiKey || '';
            $('tor-qbt-pass').value = settings.qbittorrent.password || '';
            show($('tor-save-result'), true, 'Saved');
            showToast('Torrent settings saved', 'success');
        } catch (err) {
            show($('tor-save-result'), false, err.message);
        } finally {
            btn.disabled = false;
        }
    });
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

                    ${session.isAdmin ? renderTorrentsSection() : ''}
                    ${session.isAdmin ? renderCleanupSection() : ''}
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

        if (session.isAdmin) initTorrentsSection();
        if (session.isAdmin) initCleanupSection();

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
