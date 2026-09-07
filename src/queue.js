import { getDb } from './database.js';
import { logger } from './logger.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Persistent job queue with an optional site gate.
 *
 * Two kinds of work go through it: processor jobs (`add`, run by a handler
 * registered per type, one at a time) and closure tasks (`addAndWait` /
 * `addAsync`, serialised through one lock). Both are recorded in the
 * job_queue table for the queue page.
 *
 * The gate (see scrapers/util/site-gate.js, wired in server.js) says
 * whether work for a site may run right now. A job for a closed site is not
 * failed and does not hold the lock: it is marked `waiting` and picked up
 * again when the gate opens, while work for other sites keeps flowing. A
 * task that runs into the site's check half-way (throws an error with
 * `code === 'SITE_CHALLENGE'`) is parked the same way and re-run later - the
 * task itself is responsible for skipping what it already did.
 */
class PersistentQueue {
    constructor() {
        this.isProcessing = false;
        this.inlineTaskRunning = false;
        this.processors = new Map();
        this.gate = null;
    }

    // Register a processor for a specific job type
    registerProcessor(type, handler) {
        this.processors.set(type, handler);
        logger.info(`[Queue] Registered processor for job type: ${type}`);
    }

    /**
     * Install the site gate.
     * @param {{
     *   siteForJob: (type: string, data: object) => string|null,
     *   isSiteOpen: (site: string) => boolean,
     *   waitForSite: (site: string) => Promise<void>,
     *   describeClosed: (site: string) => string,
     *   onOpen: (cb: (site: string) => void) => void
     * }} gate
     */
    useGate(gate) {
        this.gate = gate;
        gate.onOpen(site => {
            logger.info(`[Queue] ${site} is open again; resuming waiting jobs`);
            this.processNext();
        });
    }

    siteOf(type, data) {
        if (!this.gate) return null;
        try {
            return this.gate.siteForJob(type, data) || null;
        } catch (e) {
            return null;
        }
    }

    isOpen(site) {
        return !site || !this.gate || this.gate.isSiteOpen(site);
    }

    markWaiting(jobId, site, message) {
        const db = getDb();
        const text = message || (this.gate ? this.gate.describeClosed(site) : `Waiting for ${site}`);
        db.prepare(`UPDATE job_queue SET status = 'waiting', error = ? WHERE id = ?`).run(text, jobId);
    }

    // Add a job to the queue
    // userId: owning user for per-user visibility (null = system job, admins only)
    add(type, data, userId = null) {
        const db = getDb();
        const result = db.prepare(`
      INSERT INTO job_queue (type, data, status, created_at, user_id)
      VALUES (?, ?, 'pending', ?, ?)
    `).run(type, JSON.stringify(data), new Date().toISOString(), userId);

        logger.info(`[Queue] Added job ${result.lastInsertRowid} (${type})`);

        // Trigger processing (async)
        this.processNext();

        return {
            id: result.lastInsertRowid,
            status: 'pending'
        };
    }

    // Add a job and wait for it to complete inline (synchronous execution)
    // This is for operations that need immediate results
    // Uses a lock to ensure only one task runs at a time
    async addAndWait(task) {
        const { type, description, execute, mangaId, mangaTitle, userId = null } = task;

        // Insert into DB as pending initially
        const db = getDb();
        const data = { description, mangaId, mangaTitle };
        const insertResult = db.prepare(`
            INSERT INTO job_queue (type, data, status, created_at, user_id)
            VALUES (?, ?, 'pending', ?, ?)
        `).run(type || 'inline', JSON.stringify(data), new Date().toISOString(), userId);

        const jobId = insertResult.lastInsertRowid;

        // Wait for any currently running inline task to complete
        while (this.inlineTaskRunning) {
            await sleep(100);
        }

        this.inlineTaskRunning = true;

        // Mark as processing
        db.prepare(`
            UPDATE job_queue
            SET status = 'processing', started_at = ?
            WHERE id = ?
        `).run(new Date().toISOString(), jobId);

        logger.info(`[Queue] Running inline task ${jobId}: ${description || type}`);

        try {
            // Execute the task directly
            const result = await execute();

            // Mark as completed
            db.prepare(`
                UPDATE job_queue
                SET status = 'completed', completed_at = ?, result = ?
                WHERE id = ?
            `).run(new Date().toISOString(), JSON.stringify(result || {}), jobId);

            logger.info(`[Queue] Inline task ${jobId} completed: ${description || type}`);
            return result;
        } catch (error) {
            // Mark as failed
            db.prepare(`
                UPDATE job_queue
                SET status = 'failed', completed_at = ?, error = ?
                WHERE id = ?
            `).run(new Date().toISOString(), error.message, jobId);

            logger.error(`[Queue] Inline task ${jobId} failed: ${description || type} - ${error.message}`);
            throw error;
        } finally {
            this.inlineTaskRunning = false;
        }
    }

    // Add a job to run asynchronously in the background (for downloads)
    // Still serializes with other inline tasks via the same lock.
    // `site`: the site the task scrapes; while that site's gate is closed
    // the task waits (without the lock) instead of running into the check.
    // `onWait(site, message)` / `onResume()` let the caller mirror that in
    // its own progress record.
    addAsync(task) {
        const { type, description, execute, mangaId, mangaTitle, userId = null, site = null, onWait = null, onResume = null } = task;

        // Insert into DB as pending
        const db = getDb();
        const data = { description, mangaId, mangaTitle, site };
        const insertResult = db.prepare(`
            INSERT INTO job_queue (type, data, status, created_at, user_id)
            VALUES (?, ?, 'pending', ?, ?)
        `).run(type || 'async', JSON.stringify(data), new Date().toISOString(), userId);

        const jobId = insertResult.lastInsertRowid;

        const runTask = async () => {
            for (; ;) {
                // Closed gate: park without taking the lock, so work for
                // other sites keeps running.
                if (site && !this.isOpen(site)) {
                    this.markWaiting(jobId, site);
                    logger.info(`[Queue] Async task ${jobId} waits for ${site}: ${description || type}`);
                    if (onWait) { try { onWait(site, this.gate.describeClosed(site)); } catch (e) { /* caller's problem */ } }
                    await this.gate.waitForSite(site);
                    if (onResume) { try { onResume(site); } catch (e) { /* caller's problem */ } }
                    continue;
                }

                // Wait for any currently running inline task to complete
                while (this.inlineTaskRunning) {
                    await sleep(100);
                }
                this.inlineTaskRunning = true;

                // Mark as processing
                db.prepare(`
                    UPDATE job_queue
                    SET status = 'processing', started_at = ?, error = NULL
                    WHERE id = ?
                `).run(new Date().toISOString(), jobId);

                logger.info(`[Queue] Running async task ${jobId}: ${description || type}`);

                let waitSite = null;
                let waitMessage = null;
                try {
                    const result = await execute();

                    // Mark as completed
                    db.prepare(`
                        UPDATE job_queue
                        SET status = 'completed', completed_at = ?, result = ?
                        WHERE id = ?
                    `).run(new Date().toISOString(), JSON.stringify(result || {}), jobId);

                    logger.info(`[Queue] Async task ${jobId} completed: ${description || type}`);
                    return;
                } catch (error) {
                    if (error && error.code === 'SITE_CHALLENGE' && error.site && this.gate) {
                        waitSite = error.site;
                        waitMessage = error.message;
                    } else {
                        // Mark as failed
                        db.prepare(`
                            UPDATE job_queue
                            SET status = 'failed', completed_at = ?, error = ?
                            WHERE id = ?
                        `).run(new Date().toISOString(), error.message, jobId);

                        logger.error(`[Queue] Async task ${jobId} failed: ${description || type} - ${error.message}`);
                        return;
                    }
                } finally {
                    this.inlineTaskRunning = false;
                }

                // The task ran into the site's check: park it (lock already
                // released) and run it again once the site opens.
                this.markWaiting(jobId, waitSite, waitMessage);
                logger.warn(`[Queue] Async task ${jobId} paused by ${waitSite}'s verification check; it resumes when the site is open again`);
                await this.gate.waitForSite(waitSite);
                if (onResume) { try { onResume(waitSite); } catch (e) { /* caller's problem */ } }
            }
        };

        // Fire and forget - start the task but don't wait
        runTask();

        return {
            id: jobId,
            status: 'pending'
        };
    }

    // Get job status
    // Non-admin callers only see their own jobs (null = not found/forbidden)
    getJob(id, userId = null, isAdmin = false) {
        const db = getDb();
        const job = db.prepare('SELECT * FROM job_queue WHERE id = ?').get(id);
        if (job && !isAdmin && userId !== null && userId !== undefined && job.user_id !== userId) {
            return null;
        }
        if (job) {
            job.data = JSON.parse(job.data);
            if (job.result) job.result = JSON.parse(job.result);
        }
        return job;
    }

    // Get all active jobs (pending, running, or waiting for a site). Admins
    // see everything (incl. NULL/system jobs); non-admins only their own.
    getActiveJobs(userId = null, isAdmin = false) {
        const db = getDb();
        const scoped = !isAdmin && userId !== null && userId !== undefined;
        const jobs = db.prepare(`
      SELECT * FROM job_queue
      WHERE status IN ('pending', 'processing', 'waiting')
      ${scoped ? 'AND user_id = ?' : ''}
      ORDER BY created_at ASC
    `).all(...(scoped ? [userId] : []));

        return jobs.map(job => ({
            ...job,
            data: JSON.parse(job.data),
            result: job.result ? JSON.parse(job.result) : null
        }));
    }

    // Get historical jobs. Admins see everything (incl. NULL/system jobs);
    // non-admins only see their own.
    getHistory(limit = 100, userId = null, isAdmin = false) {
        const db = getDb();
        const scoped = !isAdmin && userId !== null && userId !== undefined;
        const jobs = db.prepare(`
      SELECT * FROM job_queue
      WHERE status IN ('completed', 'failed', 'cancelled')
      ${scoped ? 'AND user_id = ?' : ''}
      ORDER BY created_at DESC
      LIMIT ?
    `).all(...(scoped ? [userId, limit] : [limit]));

        return jobs.map(job => ({
            ...job,
            data: JSON.parse(job.data),
            result: job.result ? JSON.parse(job.result) : null
        }));
    }

    // Clear historical jobs. Admins clear everything; non-admins only their own.
    clearHistory(userId = null, isAdmin = false) {
        const db = getDb();
        const scoped = !isAdmin && userId !== null && userId !== undefined;
        const result = db.prepare(`
            DELETE FROM job_queue
            WHERE status IN ('completed', 'failed', 'cancelled')
            ${scoped ? 'AND user_id = ?' : ''}
        `).run(...(scoped ? [userId] : []));
        logger.info(`[Queue] Cleared ${result.changes} historical jobs`);
        return result.changes;
    }

    /**
     * The next processor job that may run: the oldest pending or waiting
     * job (of a type with a handler) whose site is open. Jobs for closed
     * sites are marked waiting on the way past.
     */
    pickNextJob(db) {
        const types = [...this.processors.keys()];
        if (types.length === 0) return null;
        const candidates = db.prepare(`
        SELECT * FROM job_queue
        WHERE status IN ('pending', 'waiting') AND type IN (${types.map(() => '?').join(',')})
        ORDER BY created_at ASC
      `).all(...types);

        for (const job of candidates) {
            let data = {};
            try { data = JSON.parse(job.data); } catch (e) { /* run it; the handler reports the bad data */ }
            const site = this.siteOf(job.type, data);
            if (this.isOpen(site)) return job;
            if (job.status !== 'waiting') {
                this.markWaiting(job.id, site);
                logger.info(`[Queue] Job ${job.id} (${job.type}) waits for ${site}`);
            }
        }
        return null;
    }

    // Main processing loop
    async processNext() {
        if (this.isProcessing) return;

        try {
            this.isProcessing = true;
            const db = getDb();

            const job = this.pickNextJob(db);
            if (!job) {
                this.isProcessing = false;
                return;
            }

            // Mark as processing
            db.prepare(`
        UPDATE job_queue
        SET status = 'processing', started_at = ?, error = NULL
        WHERE id = ?
      `).run(new Date().toISOString(), job.id);

            logger.info(`[Queue] Starting job ${job.id} (${job.type})`);

            try {
                const handler = this.processors.get(job.type);
                if (!handler) {
                    throw new Error(`No processor registered for job type: ${job.type}`);
                }

                const data = JSON.parse(job.data);
                const result = await handler(data, job.id);

                // Mark as completed
                db.prepare(`
          UPDATE job_queue
          SET status = 'completed', completed_at = ?, result = ?
          WHERE id = ?
        `).run(
                    new Date().toISOString(),
                    JSON.stringify(result || {}),
                    job.id
                );

                logger.info(`[Queue] Job ${job.id} completed`);

            } catch (error) {
                if (error && error.code === 'SITE_CHALLENGE' && error.site && this.gate) {
                    // The site showed its check: keep the job, run it again
                    // when the site opens (the gate's onOpen calls processNext).
                    this.markWaiting(job.id, error.site, error.message);
                    logger.warn(`[Queue] Job ${job.id} paused by ${error.site}'s verification check; it resumes when the site is open again`);
                } else {
                    logger.error(`[Queue] Job ${job.id} failed: ${error.message}`, { stack: error.stack });

                    // Mark as failed
                    db.prepare(`
          UPDATE job_queue
          SET status = 'failed', completed_at = ?, error = ?
          WHERE id = ?
        `).run(
                        new Date().toISOString(),
                        error.message,
                        job.id
                    );
                }
            }

            // Process next job immediately
            this.isProcessing = false;
            this.processNext();

        } catch (err) {
            logger.error(`[Queue] System error: ${err.message}`);
            this.isProcessing = false;
        }
    }

    // Reset stuck jobs on startup
    async recover() {
        const db = getDb();
        const now = new Date().toISOString();

        // Closure tasks (downloads, inline checks) cannot be restarted from
        // the table - their code lived in the previous process. Close their
        // rows out instead of leaving them "pending" or "waiting" forever.
        const types = [...this.processors.keys()];
        const notIn = types.length ? `AND type NOT IN (${types.map(() => '?').join(',')})` : '';
        const orphaned = db.prepare(`
      UPDATE job_queue
      SET status = 'failed', completed_at = ?, error = ?
      WHERE status IN ('pending', 'processing', 'waiting') ${notIn}
    `).run(now, 'The server restarted before this task finished; start it again', ...types);
        if (orphaned.changes > 0) {
            logger.info(`[Queue] Closed ${orphaned.changes} task(s) the restart interrupted`);
        }

        // Processor jobs are restartable: run them again (a waiting one is
        // still waiting; pickNextJob sorts that out).
        const result = db.prepare(`
      UPDATE job_queue
      SET status = 'pending', started_at = NULL
      WHERE status = 'processing'
    `).run();

        if (result.changes > 0) {
            logger.info(`[Queue] Recovered ${result.changes} stuck jobs`);
        }
        this.processNext();
    }
}

export const queue = new PersistentQueue();
