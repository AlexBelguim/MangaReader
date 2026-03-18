/**
 * PWA Utilities
 * Detection and state management for PWA mode
 */

/**
 * Check if the app is running in PWA mode (standalone)
 * @returns {boolean}
 */
export function isPwa() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true || // iOS
        document.referrer.includes('android-app://')
    );
}

/**
 * Get the current display mode
 * @returns {string} 'standalone' | 'browser'
 */
export function getDisplayMode() {
    if (isPwa()) return 'standalone';
    return 'browser';
}

/**
 * Hook for PWA mode changes (e.g. if user installs)
 * @param {Function} callback 
 */
export function onDisplayModeChange(callback) {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        callback(e.matches ? 'standalone' : 'browser');
    });
}
