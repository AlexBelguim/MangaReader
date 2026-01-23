import { z } from 'zod';
import { logger } from '../logger.js';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            logger.warn(`[Validation] Invalid input: ${errorMessages}`);
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        next(error);
    }
};

// Common schemas
export const schemas = {
    addBookmark: z.object({
        url: z.string().url({ message: 'Must be a valid URL' })
    }),
    renameBookmark: z.object({
        alias: z.string().min(1, 'Alias cannot be empty').optional().nullable(),
        readChapters: z.array(z.number()).optional()
    })
};
