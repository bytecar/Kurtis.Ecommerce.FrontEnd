import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { getLoggerConfig, sanitizeData, truncateData, LogVerbosity } from './logger-config';

/**
 * Colors for console output
 */
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Text colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',

    // Background colors
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};

/**
 * Format timestamp
 */
function formatTimestamp(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
}

/**
 * Colorize text
 */
function colorize(text: string, color: keyof typeof colors, enabled: boolean): string {
    if (!enabled) return text;
    return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Get color for HTTP status code
 */
function getStatusColor(status: number): keyof typeof colors {
    if (status >= 500) return 'red';
    if (status >= 400) return 'yellow';
    if (status >= 300) return 'cyan';
    if (status >= 200) return 'green';
    return 'white';
}

/**
 * Get color for HTTP method
 */
function getMethodColor(method: string): keyof typeof colors {
    switch (method.toUpperCase()) {
        case 'GET': return 'green';
        case 'POST': return 'blue';
        case 'PUT': return 'yellow';
        case 'PATCH': return 'magenta';
        case 'DELETE': return 'red';
        default: return 'white';
    }
}

/**
 * Format duration with color
 */
function formatDuration(ms: number, slowThreshold: number, colorEnabled: boolean): string {
    const color = ms > slowThreshold ? 'red' : ms > slowThreshold / 2 ? 'yellow' : 'green';
    const duration = `${ms}ms`;
    return colorize(duration, color, colorEnabled);
}

/**
 * Format object for logging
 */
function formatObject(obj: any, config: ReturnType<typeof getLoggerConfig>): string {
    if (!obj || Object.keys(obj).length === 0) {
        return colorize('(empty)', 'gray', config.colorize);
    }

    if (config.prettyPrint) {
        return '\n' + JSON.stringify(obj, null, 2);
    }

    return JSON.stringify(obj);
}

/**
 * Request logger middleware
 */
export function requestLogger() {
    const config = getLoggerConfig();

    return (req: Request, res: Response, next: NextFunction) => {
        // Generate unique request ID
        const requestId = nanoid(10);
        (req as any).requestId = requestId;

        const start = Date.now();
        const { method, path, query, headers, body } = req;

        // Log request
        if (config.enableRequestLogging) {
            const timestamp = formatTimestamp();
            const methodStr = colorize(method.padEnd(7), getMethodColor(method), config.colorize);
            const pathStr = colorize(path, 'cyan', config.colorize);
            const idStr = colorize(`[${requestId}]`, 'gray', config.colorize);

            console.log(`\n${colorize('→', 'blue', config.colorize)} ${timestamp} ${idStr} ${methodStr} ${pathStr}`);

            // Log query parameters
            if (config.enableQueryParamLogging && Object.keys(query).length > 0) {
                const sanitizedQuery = sanitizeData(query, config);
                console.log(`  ${colorize('Query:', 'gray', config.colorize)} ${formatObject(sanitizedQuery, config)}`);
            }

            // Log headers (filtered)
            if (config.enableHeaderLogging && config.verbosity === LogVerbosity.DETAILED) {
                const relevantHeaders = {
                    'content-type': headers['content-type'],
                    'user-agent': headers['user-agent'],
                    'authorization': headers['authorization'] ? '***REDACTED***' : undefined,
                    'cookie': headers['cookie'] ? '***REDACTED***' : undefined,
                };

                const filteredHeaders = Object.fromEntries(
                    Object.entries(relevantHeaders).filter(([_, v]) => v !== undefined)
                );

                if (Object.keys(filteredHeaders).length > 0) {
                    const { data: truncatedHeaders } = truncateData(filteredHeaders, config.maxHeaderLogSize);
                    console.log(`  ${colorize('Headers:', 'gray', config.colorize)} ${formatObject(truncatedHeaders, config)}`);
                }
            }

            // Log request body
            if (config.enableBodyLogging && body && Object.keys(body).length > 0) {
                const sanitizedBody = sanitizeData(body, config);
                const { data: truncatedBody, truncated } = truncateData(sanitizedBody, config.maxBodyLogSize);

                console.log(`  ${colorize('Body:', 'gray', config.colorize)} ${formatObject(truncatedBody, config)}`);
                if (truncated) {
                    console.log(`  ${colorize('(body truncated)', 'yellow', config.colorize)}`);
                }
            }
        }

        // Capture response
        let capturedJsonResponse: Record<string, any> | undefined = undefined;
        const originalResJson = res.json;

        res.json = function (bodyJson, ...args) {
            capturedJsonResponse = bodyJson;
            return originalResJson.apply(res, [bodyJson, ...args]);
        };

        // Log response when finished
        res.on('finish', () => {
            const duration = Date.now() - start;

            if (config.enableResponseLogging) {
                const timestamp = formatTimestamp();
                const statusStr = colorize(res.statusCode.toString(), getStatusColor(res.statusCode), config.colorize);
                const durationStr = formatDuration(duration, config.slowRequestThreshold, config.colorize);
                const idStr = colorize(`[${requestId}]`, 'gray', config.colorize);

                console.log(`${colorize('←', 'green', config.colorize)} ${timestamp} ${idStr} ${statusStr} ${durationStr}`);

                // Log response body
                if (config.enableBodyLogging && capturedJsonResponse) {
                    const sanitizedResponse = sanitizeData(capturedJsonResponse, config);
                    const { data: truncatedResponse, truncated } = truncateData(sanitizedResponse, config.maxBodyLogSize);

                    console.log(`  ${colorize('Response:', 'gray', config.colorize)} ${formatObject(truncatedResponse, config)}`);
                    if (truncated) {
                        console.log(`  ${colorize('(response truncated)', 'yellow', config.colorize)}`);
                    }
                }

                // Warn about slow requests
                if (duration > config.slowRequestThreshold) {
                    console.log(`  ${colorize('⚠ SLOW REQUEST', 'red', config.colorize)}`);
                }
            }
        });

        next();
    };
}

/**
 * Error logger middleware
 */
export function errorLogger() {
    const config = getLoggerConfig();

    return (err: any, req: Request, res: Response, next: NextFunction) => {
        const timestamp = formatTimestamp();
        const requestId = (req as any).requestId || 'unknown';
        const idStr = colorize(`[${requestId}]`, 'gray', config.colorize);

        console.log(`\n${colorize('✖', 'red', config.colorize)} ${timestamp} ${idStr} ${colorize('ERROR', 'red', config.colorize)}`);
        console.log(`  ${colorize('Message:', 'red', config.colorize)} ${err.message}`);
        console.log(`  ${colorize('Path:', 'gray', config.colorize)} ${req.method} ${req.path}`);

        if (err.status || err.statusCode) {
            console.log(`  ${colorize('Status:', 'gray', config.colorize)} ${err.status || err.statusCode}`);
        }

        // Log stack trace in development
        if (config.enableErrorStackTraces && err.stack) {
            console.log(`  ${colorize('Stack:', 'gray', config.colorize)}`);
            console.log(colorize(err.stack, 'dim', config.colorize));
        }

        // Log request context
        if (config.verbosity === LogVerbosity.DETAILED) {
            console.log(`  ${colorize('Request Context:', 'gray', config.colorize)}`);
            console.log(`    Method: ${req.method}`);
            console.log(`    Path: ${req.path}`);
            console.log(`    Query: ${JSON.stringify(req.query)}`);
            if (req.body && Object.keys(req.body).length > 0) {
                const sanitizedBody = sanitizeData(req.body, config);
                console.log(`    Body: ${JSON.stringify(sanitizedBody)}`);
            }
        }

        next(err);
    };
}

/**
 * Simple log function with levels
 */
export function log(message: string, level: 'info' | 'debug' | 'warn' | 'error' = 'info', source = 'app') {
    const config = getLoggerConfig();
    const timestamp = formatTimestamp();

    let color: keyof typeof colors = 'white';
    let prefix = '';

    switch (level) {
        case 'debug':
            color = 'gray';
            prefix = '🔍';
            break;
        case 'info':
            color = 'blue';
            prefix = 'ℹ';
            break;
        case 'warn':
            color = 'yellow';
            prefix = '⚠';
            break;
        case 'error':
            color = 'red';
            prefix = '✖';
            break;
    }

    const levelStr = colorize(level.toUpperCase().padEnd(5), color, config.colorize);
    const sourceStr = colorize(`[${source}]`, 'gray', config.colorize);

    console.log(`${prefix} ${timestamp} ${sourceStr} ${levelStr} ${message}`);
}
