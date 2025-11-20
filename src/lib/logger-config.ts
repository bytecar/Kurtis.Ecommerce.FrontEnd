/**
 * Centralized logging configuration
 */

export enum LogVerbosity {
    MINIMAL = 'minimal',     // Only errors and critical info
    MODERATE = 'moderate',   // Errors, warnings, and basic request info
    DETAILED = 'detailed',   // Everything including request/response bodies
}

export interface LoggerConfig {
    // Verbosity level
    verbosity: LogVerbosity;

    // Enable/disable specific log types
    enableRequestLogging: boolean;
    enableResponseLogging: boolean;
    enableHeaderLogging: boolean;
    enableBodyLogging: boolean;
    enableQueryParamLogging: boolean;
    enableErrorStackTraces: boolean;

    // Size limits
    maxBodyLogSize: number; // in bytes
    maxHeaderLogSize: number; // in bytes

    // Output format
    colorize: boolean;
    prettyPrint: boolean;
    jsonOutput: boolean;

    // Sensitive data patterns to sanitize
    sensitiveFields: string[];
    sensitivePatterns: RegExp[];

    // Performance
    slowRequestThreshold: number; // in ms
}

// Default configuration based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';

export const defaultLoggerConfig: LoggerConfig = {
    verbosity: isDevelopment ? LogVerbosity.DETAILED : LogVerbosity.MODERATE,

    enableRequestLogging: true,
    enableResponseLogging: true,
    enableHeaderLogging: isDevelopment,
    enableBodyLogging: isDevelopment,
    enableQueryParamLogging: true,
    enableErrorStackTraces: true,

    maxBodyLogSize: 10000, // 10KB
    maxHeaderLogSize: 2000, // 2KB

    colorize: isDevelopment,
    prettyPrint: isDevelopment,
    jsonOutput: false,

    sensitiveFields: [
        'password',
        'token',
        'accessToken',
        'refreshToken',
        'authorization',
        'cookie',
        'secret',
        'apiKey',
        'api_key',
        'creditCard',
        'cvv',
        'ssn',
    ],

    sensitivePatterns: [
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card numbers
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses (optional)
    ],

    slowRequestThreshold: 1000, // 1 second
};

// Allow runtime configuration via environment variables
export function getLoggerConfig(): LoggerConfig {
    const config = { ...defaultLoggerConfig };

    // Override verbosity from env
    if (process.env.LOG_VERBOSITY) {
        const verbosity = process.env.LOG_VERBOSITY.toLowerCase();
        if (Object.values(LogVerbosity).includes(verbosity as LogVerbosity)) {
            config.verbosity = verbosity as LogVerbosity;
        }
    }

    // Override specific settings from env
    if (process.env.LOG_BODIES === 'false') {
        config.enableBodyLogging = false;
    }

    if (process.env.LOG_HEADERS === 'false') {
        config.enableHeaderLogging = false;
    }

    if (process.env.SLOW_REQUEST_THRESHOLD) {
        const threshold = parseInt(process.env.SLOW_REQUEST_THRESHOLD, 10);
        if (!isNaN(threshold)) {
            config.slowRequestThreshold = threshold;
        }
    }

    return config;
}

/**
 * Sanitize sensitive data from objects
 */
export function sanitizeData(data: any, config: LoggerConfig): any {
    if (!data || typeof data !== 'object') {
        return data;
    }

    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    // Sanitize sensitive fields
    for (const key in sanitized) {
        const lowerKey = key.toLowerCase();

        // Check if field name matches sensitive fields
        if (config.sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
            sanitized[key] = '***REDACTED***';
            continue;
        }

        // Recursively sanitize nested objects
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeData(sanitized[key], config);
            continue;
        }

        // Check if value matches sensitive patterns
        if (typeof sanitized[key] === 'string') {
            for (const pattern of config.sensitivePatterns) {
                if (pattern.test(sanitized[key])) {
                    sanitized[key] = sanitized[key].replace(pattern, '***REDACTED***');
                }
            }
        }
    }

    return sanitized;
}

/**
 * Truncate data if it exceeds size limit
 */
export function truncateData(data: any, maxSize: number): { data: any; truncated: boolean } {
    const str = typeof data === 'string' ? data : JSON.stringify(data);

    if (str.length <= maxSize) {
        return { data, truncated: false };
    }

    const truncated = str.substring(0, maxSize) + '... [truncated]';
    return { data: truncated, truncated: true };
}
