/**
 * Authentication event logger
 * Specialized logging for authentication-related events
 */

import { log } from './request-logger';

export enum AuthEvent {
    LOGIN_ATTEMPT = 'login_attempt',
    LOGIN_SUCCESS = 'login_success',
    LOGIN_FAILURE = 'login_failure',
    LOGOUT = 'logout',
    TOKEN_GENERATED = 'token_generated',
    TOKEN_VALIDATED = 'token_validated',
    TOKEN_EXPIRED = 'token_expired',
    TOKEN_INVALID = 'token_invalid',
    SESSION_CREATED = 'session_created',
    SESSION_DESTROYED = 'session_destroyed',
    PERMISSION_DENIED = 'permission_denied',
    RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
}

interface AuthLogContext {
    userId?: number | string;
    username?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    resource?: string;
    action?: string;
    reason?: string;
    [key: string]: any;
}

/**
 * Log authentication events
 */
export function logAuthEvent(
    event: AuthEvent,
    context: AuthLogContext = {},
    success: boolean = true
) {
    const level = success ? 'info' : 'warn';
    const emoji = getEventEmoji(event);

    let message = `${emoji} ${formatEventName(event)}`;

    // Add user identifier if available
    if (context.userId) {
        message += ` - User ID: ${context.userId}`;
    } else if (context.username) {
        message += ` - Username: ${context.username}`;
    } else if (context.email) {
        message += ` - Email: ${context.email}`;
    }

    // Add IP address if available
    if (context.ipAddress) {
        message += ` - IP: ${context.ipAddress}`;
    }

    // Add reason for failures
    if (!success && context.reason) {
        message += ` - Reason: ${context.reason}`;
    }

    log(message, level, 'auth');

    // Log additional context in debug mode
    if (process.env.NODE_ENV !== 'production' && Object.keys(context).length > 0) {
        console.log('  Context:', {
            ...context,
            // Don't log sensitive data
            password: undefined,
            token: undefined,
        });
    }
}

/**
 * Get emoji for auth event
 */
function getEventEmoji(event: AuthEvent): string {
    switch (event) {
        case AuthEvent.LOGIN_SUCCESS:
            return '✅';
        case AuthEvent.LOGIN_FAILURE:
            return '❌';
        case AuthEvent.LOGIN_ATTEMPT:
            return '🔐';
        case AuthEvent.LOGOUT:
            return '👋';
        case AuthEvent.TOKEN_GENERATED:
        case AuthEvent.TOKEN_VALIDATED:
            return '🎫';
        case AuthEvent.TOKEN_EXPIRED:
        case AuthEvent.TOKEN_INVALID:
            return '⚠️';
        case AuthEvent.SESSION_CREATED:
            return '📝';
        case AuthEvent.SESSION_DESTROYED:
            return '🗑️';
        case AuthEvent.PERMISSION_DENIED:
            return '🚫';
        case AuthEvent.RATE_LIMIT_EXCEEDED:
            return '⏱️';
        default:
            return '🔒';
    }
}

/**
 * Format event name for display
 */
function formatEventName(event: AuthEvent): string {
    return event
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Convenience functions for common auth events
 */
export const authLogger = {
    loginAttempt: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.LOGIN_ATTEMPT, context),

    loginSuccess: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.LOGIN_SUCCESS, context, true),

    loginFailure: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.LOGIN_FAILURE, context, false),

    logout: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.LOGOUT, context),

    tokenGenerated: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.TOKEN_GENERATED, context),

    tokenValidated: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.TOKEN_VALIDATED, context),

    tokenExpired: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.TOKEN_EXPIRED, context, false),

    tokenInvalid: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.TOKEN_INVALID, context, false),

    sessionCreated: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.SESSION_CREATED, context),

    sessionDestroyed: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.SESSION_DESTROYED, context),

    permissionDenied: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.PERMISSION_DENIED, context, false),

    rateLimitExceeded: (context: AuthLogContext) =>
        logAuthEvent(AuthEvent.RATE_LIMIT_EXCEEDED, context, false),
};
