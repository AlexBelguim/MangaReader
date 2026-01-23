import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

const logDir = 'logs';
fs.ensureDirSync(logDir);

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Write all error logs to `logs/error.log`
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),
        // Write all logs to `logs/combined.log`
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

// If we're not in production, log to the console with the custom format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log when the request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

        logger.log({
            level: logLevel,
            message: `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip
        });
    });

    next();
};

export default logger;
