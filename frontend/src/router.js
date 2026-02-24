/**
 * Client-side Router
 * Simple hash-based routing for SPA navigation with lazy view loading
 */

import { setupHeaderListeners } from './components/header.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentView = null;
    }

    /**
     * Initialize router and listen for hash changes
     */
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.navigate());

        // Handle initial route
        this.navigate();
    }

    /**
     * Register a route with a view module
     */
    register(path, viewModule) {
        this.routes.set(path, viewModule);
    }

    /**
     * Navigate to current hash
     */
    async navigate() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, ...params] = hash.split('/').filter(Boolean);

        const route = `/${path || ''}`;

        // Unmount previous view
        if (this.currentView && this.currentView.unmount) {
            this.currentView.unmount();
        }

        // Find matching route
        let viewModule = this.routes.get(route);

        // If no exact match, try parent route
        if (!viewModule && this.routes.has('/')) {
            viewModule = this.routes.get('/');
        }

        if (viewModule) {
            this.currentRoute = route;
            this.currentView = viewModule;

            // Mount the view
            if (viewModule.mount) {
                await viewModule.mount(params);
            }

            // Setup header listeners after mount
            setupHeaderListeners();
        }
    }

    /**
     * Programmatically change route
     */
    go(path) {
        window.location.hash = path;
    }

    /**
     * Go back
     */
    back() {
        window.history.back();
    }

    /**
     * Reload current view
     */
    reload() {
        if (this.currentView && this.currentView.mount) {
            this.currentView.mount();
            setupHeaderListeners();
        }
    }
}

// Create and export singleton
const router = new Router();

// Import views
import libraryView from './views/library.js';
import mangaView from './views/manga.js';
import readerView from './views/reader.js';
import seriesView from './views/series.js';
import settingsView from './views/settings.js';
import adminView from './views/admin.js';
import favoritesView from './views/favorites.js';

// Register routes
router.register('/', libraryView);
router.register('/manga', mangaView);
router.register('/read', readerView);
router.register('/series', seriesView);
router.register('/settings', settingsView);
router.register('/admin', adminView);
router.register('/favorites', favoritesView);

export { router };
export default router;
