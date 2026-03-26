/**
 * Notification Manager
 * Handles Web Push notification subscription and permission management.
 */

import { api } from './api.js';

// ==================== PERMISSION ====================

/**
 * Check if notifications are supported.
 */
function isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current notification permission status.
 * @returns {'granted'|'denied'|'default'|'unsupported'}
 */
function getPermissionStatus() {
    if (!isSupported()) return 'unsupported';
    return Notification.permission;
}

/**
 * Request notification permission from the user.
 * @returns {Promise<'granted'|'denied'|'default'>}
 */
async function requestPermission() {
    if (!isSupported()) throw new Error('Push notifications not supported');
    return Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
}

// ==================== PUSH SUBSCRIPTION ====================

/**
 * Subscribe to push notifications.
 * Gets VAPID key from server, subscribes via PushManager, sends subscription to backend.
 * @returns {Promise<boolean>}
 */
async function subscribeToPush() {
    if (!isSupported()) return false;

    const permission = await requestPermission();
    if (permission !== 'granted') return false;

    try {
        const reg = await navigator.serviceWorker.ready;

        // Get VAPID public key from server
        const { publicKey } = await api.get('/push/vapid-public-key');
        if (!publicKey) {
            console.warn('[Notifications] No VAPID key configured on server');
            return false;
        }

        // Convert VAPID key to Uint8Array
        const vapidKey = urlBase64ToUint8Array(publicKey);

        // Subscribe via PushManager
        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey
        });

        // Send subscription to backend
        const sub = subscription.toJSON();
        await api.post('/push/subscribe', {
            endpoint: sub.endpoint,
            keys: sub.keys
        });

        console.log('[Notifications] Subscribed to push');
        return true;
    } catch (e) {
        console.error('[Notifications] Subscribe failed:', e);
        return false;
    }
}

/**
 * Unsubscribe from push notifications.
 * @returns {Promise<boolean>}
 */
async function unsubscribeFromPush() {
    try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();

        if (subscription) {
            const endpoint = subscription.endpoint;
            await subscription.unsubscribe();
            await api.post('/push/unsubscribe', { endpoint });
        }

        console.log('[Notifications] Unsubscribed from push');
        return true;
    } catch (e) {
        console.error('[Notifications] Unsubscribe failed:', e);
        return false;
    }
}

/**
 * Check if currently subscribed to push notifications.
 * @returns {Promise<boolean>}
 */
async function isSubscribed() {
    if (!isSupported()) return false;

    try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        return !!subscription;
    } catch (e) {
        return false;
    }
}

// ==================== HELPERS ====================

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// ==================== EXPORT ====================

export const notificationManager = {
    isSupported,
    getPermissionStatus,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    isSubscribed
};

export default notificationManager;
