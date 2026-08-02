/**
 * Session — who is currently logged in and what they may do.
 *
 * Populated once at boot (main.js / demo.js) from `GET /api/auth/me`.
 * Views should read these flags to hide controls the backend would reject
 * anyway; the backend (guardPermissions middleware) remains the real gate.
 */

export const session = {
    user: null,

    get isAdmin() {
        return this.user?.role === 'admin';
    },

    get isDemo() {
        return this.user?.role === 'demo';
    },

    get canDownload() {
        return this.isAdmin || (!this.isDemo && !!this.user?.canDownload);
    },

    get canEdit() {
        return this.isAdmin || (!this.isDemo && !!this.user?.canEdit);
    }
};

export function setSessionUser(user) {
    session.user = user || null;
}
