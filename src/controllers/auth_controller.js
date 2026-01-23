import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { logger } from '../logger.js';

export const login = (req, res) => {
    const { username, password } = req.body;

    // Simple static check against existing config
    // In a real DB-backed user system, we would query the 'users' table and compare hashes.
    // Since we are using a single admin user defined in .env for now:

    if (username === CONFIG.auth.username && password === CONFIG.auth.password) {
        const token = jwt.sign(
            { username, role: 'admin' },
            CONFIG.auth.jwtSecret,
            { expiresIn: '7d' }
        );

        logger.info(`[Auth] Successful login for user: ${username}`);
        res.json({ token });
    } else {
        logger.warn(`[Auth] Failed login attempt for user: ${username}`);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};
