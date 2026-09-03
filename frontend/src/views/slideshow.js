/**
 * Slideshow View — fullscreen crossfading slideshow of volume covers,
 * optionally mixed with favorite-gallery pages and trophy pages.
 * Configured from the Settings page (setting key: `slideshow`).
 */

import { api } from '../api.js';
import { store } from '../store.js';
import { router } from '../router.js';
import { icon } from '../icons.js';
import { showToast } from '../utils/toast.js';

const DEFAULT_CONFIG = {
    disabledMangaIds: [],
    includeLists: false,
    includeTrophies: false,
    intervalMs: 8000,
    shuffle: false
};

let state = null;

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shuffleInPlace(arr, from = 0) {
    for (let i = arr.length - 1; i > from; i--) {
        const j = from + Math.floor(Math.random() * (i - from + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/** Filename out of a favorites imagePaths entry (string or object). */
function imagePathFilename(imgPath) {
    let filename;
    if (typeof imgPath === 'string') {
        filename = imgPath;
    } else if (imgPath && typeof imgPath === 'object') {
        filename = imgPath.filename || imgPath.path || imgPath.name || imgPath.url;
    }
    if (!filename) return null;
    if (filename.includes('/')) filename = filename.split('/').pop();
    if (filename.includes('\\')) filename = filename.split('\\').pop();
    return filename;
}

function kindBadge(kind) {
    if (kind === 'gallery') return icon('folder');
    if (kind === 'trophy') return icon('trophy');
    return icon('book-open');
}

// ==================== SLIDE BUILDING ====================

function buildVolumeSlides(mangaList, disabled) {
    const slides = [];
    for (const manga of mangaList) {
        if (disabled.has(manga.id)) continue;
        const name = manga.alias || manga.title;
        for (const vol of manga.volumes) {
            if (!vol.cover) continue;
            slides.push({ url: vol.cover, title: name, subtitle: vol.name, kind: 'volume' });
        }
    }
    return slides;
}

async function loadGallerySlides() {
    const data = await api.getFavorites();
    const listOrder = data.listOrder?.length ? data.listOrder : Object.keys(data.favorites || {});
    const slides = [];
    for (const listName of listOrder) {
        for (const item of data.favorites?.[listName] || []) {
            for (const imgPath of item.imagePaths || []) {
                const filename = imagePathFilename(imgPath);
                if (!filename) continue;
                slides.push({
                    url: `/api/public/chapter-images/${item.mangaId}/${item.chapterNum}/${encodeURIComponent(filename)}`,
                    title: listName,
                    subtitle: item.mangaTitle ? `${item.mangaTitle} · Ch. ${item.chapterNum}` : `Ch. ${item.chapterNum}`,
                    kind: 'gallery'
                });
            }
        }
    }
    return slides;
}

async function loadTrophySlides(disabled) {
    const trophyPages = await api.get('/trophy-pages');
    const bookmarks = await store.loadBookmarks().catch(() => []);
    const nameOf = (id) => {
        const b = bookmarks.find(bm => bm.id === id);
        return b ? (b.alias || b.title) : 'Trophies';
    };

    const slides = [];
    for (const [mangaId, chapters] of Object.entries(trophyPages || {})) {
        if (disabled.has(mangaId)) continue;
        for (const [chNum, pages] of Object.entries(chapters || {})) {
            const pageIndices = Object.keys(pages || {});
            if (pageIndices.length === 0) continue;
            let images;
            try {
                images = (await api.getChapterImages(mangaId, chNum)).images || [];
            } catch {
                continue; // chapter not downloaded / not accessible
            }
            for (const pgIdx of pageIndices) {
                const imgUrl = images[pgIdx];
                if (!imgUrl) continue;
                let filename = typeof imgUrl === 'string' ? imgUrl.split('/').pop() : imgUrl?.filename || imgUrl?.path;
                if (!filename) continue;
                try { filename = decodeURIComponent(filename); } catch { /* keep as-is */ }
                slides.push({
                    url: `/api/public/chapter-images/${mangaId}/${chNum}/${encodeURIComponent(filename)}`,
                    title: nameOf(mangaId),
                    subtitle: `Ch. ${chNum} · Trophy`,
                    kind: 'trophy'
                });
            }
        }
    }
    return slides;
}

// ==================== PLAYBACK ====================

function scheduleNext() {
    if (!state) return;
    clearTimeout(state.timer);
    if (state.playing && state.slides.length > 1) {
        state.timer = setTimeout(() => showSlide(state.index + 1), state.config.intervalMs);
    }
}

function updateHud() {
    if (!state) return;
    const slide = state.slides[state.index];
    const counter = document.getElementById('ss-counter');
    const title = document.getElementById('ss-title');
    const subtitle = document.getElementById('ss-subtitle');
    if (counter) counter.textContent = state.slides.length ? `${state.index + 1} / ${state.slides.length}` : '';
    if (title && slide) title.innerHTML = `${kindBadge(slide.kind)} ${esc(slide.title)}`;
    if (subtitle && slide) subtitle.textContent = slide.subtitle || '';
}

function showSlide(rawIndex) {
    if (!state || state.slides.length === 0) return;
    const index = ((rawIndex % state.slides.length) + state.slides.length) % state.slides.length;
    state.index = index;
    const slide = state.slides[index];
    const token = ++state.loadToken;

    const next = 1 - state.activeLayer;
    const nextImg = state.layers[next];
    const curImg = state.layers[state.activeLayer];

    nextImg.onload = () => {
        if (!state || token !== state.loadToken) return;
        state.activeLayer = next;
        nextImg.classList.add('active');
        curImg.classList.remove('active');
        updateHud();
        scheduleNext();
        // Warm the cache for the slide after this one
        if (state.slides.length > 1) {
            const upcoming = state.slides[(index + 1) % state.slides.length];
            if (upcoming) new Image().src = upcoming.url;
        }
    };
    nextImg.onerror = () => {
        if (!state || token !== state.loadToken) return;
        // Drop the broken slide and move on
        state.slides.splice(index, 1);
        if (state.slides.length === 0) {
            renderEmpty();
            return;
        }
        showSlide(index);
    };
    nextImg.src = slide.url;
    updateHud();
}

function setPlaying(playing) {
    if (!state) return;
    state.playing = playing;
    const btn = document.getElementById('ss-play');
    if (btn) btn.innerHTML = playing ? icon('pause') : icon('play');
    scheduleNext();
}

function pokeControls() {
    if (!state) return;
    const root = document.getElementById('slideshow');
    if (!root) return;
    root.classList.remove('controls-hidden');
    clearTimeout(state.hideTimer);
    state.hideTimer = setTimeout(() => {
        document.getElementById('slideshow')?.classList.add('controls-hidden');
    }, 3000);
}

function exitSlideshow() {
    router.go('/settings');
}

function renderEmpty() {
    const root = document.getElementById('slideshow');
    if (!root) return;
    root.innerHTML = `
        <div class="slideshow-empty">
            ${icon('images', { size: 48 })}
            <p>Nothing to show yet — add covers to your volumes, or enable galleries and trophies in Settings.</p>
            <button id="ss-empty-back" class="btn btn-primary">Back to Settings</button>
        </div>
    `;
    document.getElementById('ss-empty-back')?.addEventListener('click', exitSlideshow);
}

// ==================== VIEW ====================

export default {
    mount: async () => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="slideshow" id="slideshow">
                <div class="slideshow-stage" id="ss-stage">
                    <img class="slideshow-img" alt="">
                    <img class="slideshow-img" alt="">
                </div>
                <div class="slideshow-ui">
                    <div class="slideshow-topbar">
                        <button class="slideshow-btn" id="ss-exit" title="Exit slideshow">${icon('x')}</button>
                        <div class="slideshow-counter" id="ss-counter"></div>
                        <button class="slideshow-btn" id="ss-fullscreen" title="Toggle fullscreen">${icon('maximize')}</button>
                    </div>
                    <div class="slideshow-bottombar">
                        <div class="slideshow-caption">
                            <div class="slideshow-title" id="ss-title"></div>
                            <div class="slideshow-subtitle" id="ss-subtitle"></div>
                        </div>
                        <div class="slideshow-transport">
                            <button class="slideshow-btn" id="ss-prev" title="Previous">${icon('chevron-left')}</button>
                            <button class="slideshow-btn" id="ss-play" title="Pause">${icon('pause')}</button>
                            <button class="slideshow-btn" id="ss-next" title="Next">${icon('chevron-right')}</button>
                        </div>
                    </div>
                </div>
                <div class="slideshow-loading" id="ss-loading">${icon('loader', { spin: true })} Loading covers…</div>
            </div>
        `;

        const stage = document.getElementById('ss-stage');
        state = {
            slides: [],
            index: 0,
            playing: true,
            timer: null,
            hideTimer: null,
            loadToken: 0,
            activeLayer: 0,
            layers: [...stage.querySelectorAll('.slideshow-img')],
            config: { ...DEFAULT_CONFIG },
            keyHandler: null,
            moveHandler: null
        };

        // ---- controls ----
        document.getElementById('ss-exit').addEventListener('click', exitSlideshow);
        document.getElementById('ss-prev').addEventListener('click', () => { showSlide(state.index - 1); pokeControls(); });
        document.getElementById('ss-next').addEventListener('click', () => { showSlide(state.index + 1); pokeControls(); });
        document.getElementById('ss-play').addEventListener('click', () => { setPlaying(!state.playing); pokeControls(); });
        document.getElementById('ss-fullscreen').addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen().catch(() => showToast('Fullscreen not supported', 'info'));
            }
        });

        // Tap zones: left third previous, right third next, middle toggles controls
        stage.addEventListener('click', (e) => {
            const x = e.clientX / window.innerWidth;
            if (x < 0.3) { showSlide(state.index - 1); pokeControls(); }
            else if (x > 0.7) { showSlide(state.index + 1); pokeControls(); }
            else {
                const root = document.getElementById('slideshow');
                if (root.classList.contains('controls-hidden')) pokeControls();
                else { clearTimeout(state.hideTimer); root.classList.add('controls-hidden'); }
            }
        });

        state.keyHandler = (e) => {
            if (!state) return;
            switch (e.key) {
                case 'ArrowLeft': showSlide(state.index - 1); pokeControls(); break;
                case 'ArrowRight': showSlide(state.index + 1); pokeControls(); break;
                case ' ': e.preventDefault(); setPlaying(!state.playing); pokeControls(); break;
                case 'f': case 'F':
                    if (document.fullscreenElement) document.exitFullscreen();
                    else document.documentElement.requestFullscreen().catch(() => {});
                    break;
                case 'Escape':
                    // In fullscreen the browser consumes Escape to leave fullscreen;
                    // a second press (not fullscreen anymore) exits the slideshow.
                    if (!document.fullscreenElement) exitSlideshow();
                    break;
            }
        };
        document.addEventListener('keydown', state.keyHandler);
        state.moveHandler = () => pokeControls();
        document.addEventListener('mousemove', state.moveHandler);
        pokeControls();

        // ---- data ----
        let settings = {};
        try {
            settings = await api.get('/settings') || {};
        } catch { /* fall back to defaults */ }
        state.config = { ...DEFAULT_CONFIG, ...(settings.slideshow || {}) };
        const disabled = new Set(state.config.disabledMangaIds || []);

        let mangaList = [];
        try {
            mangaList = await api.getAllVolumes();
        } catch (err) {
            console.error(err);
        }

        state.slides = buildVolumeSlides(mangaList, disabled);
        if (state.config.shuffle) shuffleInPlace(state.slides, -1);

        const loading = document.getElementById('ss-loading');
        if (state.slides.length > 0) {
            loading?.remove();
            showSlide(0);
        }

        // Galleries and trophies stream in after the show starts (trophy image
        // lookups are one request per chapter, so they can take a moment).
        const appendExtra = (extra) => {
            if (!state || extra.length === 0) return;
            const wasEmpty = state.slides.length === 0;
            state.slides.push(...extra);
            if (state.config.shuffle) shuffleInPlace(state.slides, wasEmpty ? -1 : state.index);
            if (wasEmpty) {
                document.getElementById('ss-loading')?.remove();
                showSlide(0);
            } else {
                updateHud();
            }
        };

        const extras = [];
        if (state.config.includeLists) {
            extras.push(loadGallerySlides().then(appendExtra).catch(err => console.warn('Slideshow: galleries unavailable', err)));
        }
        if (state.config.includeTrophies) {
            extras.push(loadTrophySlides(disabled).then(appendExtra).catch(err => console.warn('Slideshow: trophies unavailable', err)));
        }

        if (state.slides.length === 0) {
            if (extras.length === 0) {
                renderEmpty();
            } else {
                Promise.allSettled(extras).then(() => {
                    if (state && state.slides.length === 0) renderEmpty();
                });
            }
        }
    },

    unmount: () => {
        if (!state) return;
        clearTimeout(state.timer);
        clearTimeout(state.hideTimer);
        document.removeEventListener('keydown', state.keyHandler);
        document.removeEventListener('mousemove', state.moveHandler);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        state = null;
    }
};
