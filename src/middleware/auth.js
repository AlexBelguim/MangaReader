import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { logger } from '../logger.js';

export const auth = (req, res, next) => {
    // Allow public access to certain routes if needed (e.g., covers)
    // But generally API should be protected
    if (req.method === 'OPTIONS') return next();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, CONFIG.auth.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn(`[Auth] Invalid token: ${error.message}`);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
