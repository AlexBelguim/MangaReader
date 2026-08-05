import { CONFIG } from '../config.js';
import { logger } from '../logger.js';
import { anilistDb } from '../db/anilist.js';

/**
 * AniList sync service.
 *
 * Thin GraphQL client (https://graphql.anilist.co, no extra deps — Node 18+
 * global fetch) plus the push logic that mirrors local read state to AniList.
 * Everything here fails soft: sync problems are logged, never thrown into the
 * request that triggered them, so reading never breaks because of AniList.
 */

const API_URL = 'https://graphql.anilist.co';
const TOKEN_URL = 'https://anilist.co/api/v2/oauth/token';
const AUTHORIZE_URL = 'https://anilist.co/api/v2/oauth/authorize';

export const anilistService = {
    isConfigured() {
        return !!(CONFIG.anilist.clientId && CONFIG.anilist.clientSecret);
    },

    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: CONFIG.anilist.clientId,
            response_type: 'code',
            state
        });
        return `${AUTHORIZE_URL}?${params}`;
    },

    /** Exchange an OAuth authorization code for an access token (valid ~1 year, no refresh). */
    async exchangeCode(code, redirectUri) {
        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: CONFIG.anilist.clientId,
                client_secret: CONFIG.anilist.clientSecret,
                redirect_uri: redirectUri,
                code
            })
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`AniList token exchange failed (${res.status}): ${body}`);
        }
        return res.json(); // { access_token, token_type, expires_in }
    },

    /** Shared GraphQL caller. One retry on 429 using Retry-After. */
    async graphql(token, query, variables = {}, retried = false) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ query, variables })
        });

        if (res.status === 429 && !retried) {
            const wait = (parseInt(res.headers.get('retry-after') || '5', 10)) * 1000;
            await new Promise(r => setTimeout(r, wait));
            return this.graphql(token, query, variables, true);
        }
        if (!res.ok) {
            const err = new Error(`AniList API error ${res.status}`);
            err.status = res.status;
            throw err;
        }
        const json = await res.json();
        if (json.errors?.length) {
            throw new Error(`AniList GraphQL error: ${json.errors[0].message}`);
        }
        return json.data;
    },

    /** The AniList user behind this token (id + name). */
    async getViewer(token) {
        const data = await this.graphql(token, `query { Viewer { id name } }`);
        return data.Viewer;
    },

    /** Search manga by title. Returns up to 8 candidates. */
    async searchManga(query) {
        const data = await this.graphql(null, `
            query ($search: String) {
                Page(perPage: 8) {
                    media(type: MANGA, search: $search) {
                        id
                        title { romaji english native }
                        coverImage { medium }
                        format
                        chapters
                        status
                        startDate { year }
                    }
                }
            }
        `, { search: query });
        return data.Page.media;
    },

    /** Fetch one media entry by id (used to confirm a mapping). */
    async getMedia(id) {
        const data = await this.graphql(null, `
            query ($id: Int) {
                Media(id: $id, type: MANGA) {
                    id
                    title { romaji english native }
                    coverImage { medium }
                    format
                    chapters
                    status
                }
            }
        `, { id });
        return data.Media;
    },

    /** The user's list entry for one media (progress/status), or null if not listed. */
    async getListEntry(token, anilistUserId, mediaId) {
        const data = await this.graphql(token, `
            query ($userId: Int, $mediaId: Int) {
                MediaList(userId: $userId, mediaId: $mediaId) { progress status }
            }
        `, { userId: anilistUserId, mediaId });
        return data.MediaList;
    },

    /** The user's full manga list: [{ mediaId, progress, status, updatedAt }]. */
    async getMangaList(token, anilistUserId) {
        const data = await this.graphql(token, `
            query ($userId: Int) {
                MediaListCollection(userId: $userId, type: MANGA) {
                    lists {
                        entries {
                            mediaId
                            progress
                            status
                            updatedAt
                        }
                    }
                }
            }
        `, { userId: anilistUserId });
        return data.MediaListCollection.lists.flatMap(l => l.entries);
    },

    /**
     * Write progress to AniList. Status becomes CURRENT, or COMPLETED when the
     * chapter total is known and progress reaches it.
     */
    async saveProgress(token, mediaId, progress, chaptersTotal) {
        const status = chaptersTotal && progress >= chaptersTotal ? 'COMPLETED' : 'CURRENT';
        const data = await this.graphql(token, `
            mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
                SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) {
                    id progress status
                }
            }
        `, { mediaId, progress, status });
        return data.SaveMediaListEntry;
    },

    /**
     * Push local read state for one bookmark to AniList.
     * Fire-and-forget from route handlers — resolves to a small result object,
     * never throws. Progress only moves forward (skips when not higher than
     * the last value we pushed).
     */
    async pushProgress(userId, bookmarkId) {
        try {
            if (!this.isConfigured()) return { synced: false, reason: 'not-configured' };

            const tokenRow = anilistDb.getToken(userId);
            if (!tokenRow) return { synced: false, reason: 'not-connected' };

            const mapping = anilistDb.getMapping(bookmarkId);
            if (!mapping || !mapping.sync_enabled) return { synced: false, reason: 'not-mapped' };

            const highest = Math.floor(anilistDb.highestReadChapter(bookmarkId, userId));
            const lastPushed = anilistDb.getLastPushed(userId, bookmarkId);
            if (highest <= lastPushed) {
                return { synced: false, reason: 'not-higher', progress: highest };
            }

            await this.saveProgress(tokenRow.access_token, mapping.anilist_id, highest, mapping.chapters_total);
            anilistDb.setLastPushed(userId, bookmarkId, highest);
            logger.info(`[AniList] Pushed progress ${highest} for "${mapping.anilist_title}" (${mapping.anilist_id})`);
            return { synced: true, progress: highest };
        } catch (err) {
            if (err.status === 401) {
                // Token died (revoked/expired) — drop it so the UI offers reconnect.
                anilistDb.deleteToken(userId);
                logger.warn('[AniList] Token rejected (401); removed. Reconnect in settings.');
            } else {
                logger.warn(`[AniList] Push failed for bookmark ${bookmarkId}: ${err.message}`);
            }
            return { synced: false, reason: 'error', error: err.message };
        }
    }
};
