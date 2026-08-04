import { getDb } from './database.js';
import { logger } from './logger.js';

class PersistentQueue {
    constructor() {
        this.isProcessing = false;
        this.inlineTaskRunning = false;
        this.processors = new Map();
    }

    // Register a processor for a specific job type
    registerProcessor(type, handler) {
        this.processors.set(type, handler);
        logger.info(`[Queue] Registered processor for job type: ${type}`);
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
            await new Promise(resolve => setTimeout(resolve, 100));
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
    // Still serializes with other inline tasks via the same lock
    addAsync(task) {
        const { type, description, execute, mangaId, mangaTitle, userId = null } = task;

        // Insert into DB as pending
        const db = getDb();
        const data = { description, mangaId, mangaTitle };
        const insertResult = db.prepare(`
            INSERT INTO job_queue (type, data, status, created_at, user_id)
            VALUES (?, ?, 'pending', ?, ?)
        `).run(type || 'async', JSON.stringify(data), new Date().toISOString(), userId);

        const jobId = insertResult.lastInsertRowid;

        // Start the task in background but still serialize with lock
        const runTask = async () => {
            // Wait for any currently running inline task to complete
            while (this.inlineTaskRunning) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            this.inlineTaskRunning = true;

            // Mark as processing
            db.prepare(`
                UPDATE job_queue 
                SET status = 'processing', started_at = ? 
                WHERE id = ?
            `).run(new Date().toISOString(), jobId);

            logger.info(`[Queue] Running async task ${jobId}: ${description || type}`);

            try {
                const result = await execute();

                // Mark as completed
                db.prepare(`
                    UPDATE job_queue 
                    SET status = 'completed', completed_at = ?, result = ? 
                    WHERE id = ?
                `).run(new Date().toISOString(), JSON.stringify(result || {}), jobId);

                logger.info(`[Queue] Async task ${jobId} completed: ${description || type}`);
            } catch (error) {
                // Mark as failed
                db.prepare(`
                    UPDATE job_queue 
                    SET status = 'failed', completed_at = ?, error = ? 
                    WHERE id = ?
                `).run(new Date().toISOString(), error.message, jobId);

                logger.error(`[Queue] Async task ${jobId} failed: ${description || type} - ${error.message}`);
            } finally {
                this.inlineTaskRunning = false;
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

    // Get all active jobs. Admins see everything (incl. NULL/system jobs);
    // non-admins only see their own.
    getActiveJobs(userId = null, isAdmin = false) {
        const db = getDb();
        const scoped = !isAdmin && userId !== null && userId !== undefined;
        const jobs = db.prepare(`
      SELECT * FROM job_queue 
      WHERE status IN ('pending', 'processing')
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

    // Main processing loop
    async processNext() {
        if (this.isProcessing) return;

        try {
            this.isProcessing = true;
            const db = getDb();

            // Get next pending job
            const job = db.prepare(`
        SELECT * FROM job_queue 
        WHERE status = 'pending' 
        ORDER BY created_at ASC 
        LIMIT 1
      `).get();

            if (!job) {
                this.isProcessing = false;
                return;
            }

            // Mark as processing
            db.prepare(`
        UPDATE job_queue 
        SET status = 'processing', started_at = ? 
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
        const result = db.prepare(`
      UPDATE job_queue 
      SET status = 'pending', started_at = NULL 
      WHERE status = 'processing'
    `).run();

        if (result.changes > 0) {
            logger.info(`[Queue] Recovered ${result.changes} stuck jobs`);
            this.processNext();
        }
    }
}

export const queue = new PersistentQueue();
