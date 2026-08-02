/**
 * Users Routes - admin-only user management
 */

import express from 'express';
import { usersDb } from '../database.js';
import { requireAdmin } from '../middleware/auth.js';
import { logger } from '../logger.js';

const router = express.Router();

// Everything in here is admin-only
router.use(requireAdmin);

// List users (never includes password hashes)
router.get('/', (req, res) => {
    try {
        res.json(usersDb.listUsers());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a user
router.post('/', (req, res) => {
    try {
        const { username, password, role = 'user', canDownload = true, canEdit = true } = req.body || {};
        if (!username?.trim() || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
        }
        const result = usersDb.createUser({ username, password, role, canDownload, canEdit });
        if (!result.success) {
            return res.status(409).json({ error: result.message });
        }
        logger.info(`[Users] '${req.user.username}' created user '${username}' (${role})`);
        res.status(201).json(result.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update role/flags and/or reset password
router.patch('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const existing = usersDb.getById(id);
        if (!existing) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { role, canDownload, canEdit, password } = req.body || {};

        if (role !== undefined) {
            if (!['admin', 'user'].includes(role)) {
                return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
            }
            // Never allow demoting the last admin
            if (existing.role === 'admin' && role !== 'admin' && usersDb.countAdmins() <= 1) {
                return res.status(400).json({ error: 'Cannot demote the last admin' });
            }
        }

        const updated = usersDb.updateUser(id, {
            role: role ?? existing.role ?? 'user',
            canDownload: canDownload ?? !!existing.can_download,
            canEdit: canEdit ?? !!existing.can_edit
        });

        if (password) {
            usersDb.setPassword(id, password);
            logger.info(`[Users] '${req.user.username}' reset password for '${existing.username}'`);
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const existing = usersDb.getById(id);
        if (!existing) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        if (existing.role === 'admin' && usersDb.countAdmins() <= 1) {
            return res.status(400).json({ error: 'Cannot delete the last admin' });
        }
        usersDb.deleteUser(id);
        logger.info(`[Users] '${req.user.username}' deleted user '${existing.username}'`);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
