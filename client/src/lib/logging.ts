/**
 * Comprehensive logging system for the application
 * This module provides utilities for consistent logging across the application.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogCategory {
  API = 'api',
  AUTH = 'auth',
  UI = 'ui',
  DATA = 'data',
  PERFORMANCE = 'performance',
  USER_ACTION = 'user_action',
  NAVIGATION = 'navigation',
  SYSTEM = 'system',
}

export interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  componentName?: string;
  userId?: number;
}

// In-memory log storage
const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

// Current log level (can be changed at runtime)
let currentLogLevel: LogLevel = LogLevel.INFO;

// Override browser's console methods to add structured logging
const originalConsole = {
  debug: console.debug,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

/**
 * Sets the current log level
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * Determines if a log at the given level should be processed
 */
function shouldLog(level: LogLevel): boolean {
  const levels = Object.values(LogLevel);
  const currentLevelIndex = levels.indexOf(currentLogLevel);
  const logLevelIndex = levels.indexOf(level);
  
  return logLevelIndex >= currentLevelIndex;
}

/**
 * Creates a structured log entry
 */
export function createLogEntry(
  message: string,
  level: LogLevel = LogLevel.INFO,
  category: LogCategory = LogCategory.SYSTEM,
  options: Partial<LogEntry> = {}
): LogEntry {
  return {
    message,
    level,
    category,
    timestamp: new Date(),
    ...options,
  };
}

/**
 * Logs a message with the specified level and category
 */
export function log(
  message: string,
  level: LogLevel = LogLevel.INFO,
  category: LogCategory = LogCategory.SYSTEM,
  context?: Record<string, any>,
  componentName?: string
): void {
  if (!shouldLog(level)) {
    return;
  }
  
  const entry = createLogEntry(message, level, category, {
    context,
    componentName,
  });
  
  // Add to in-memory logs
  logs.unshift(entry);
  
  // Trim log to maximum size
  if (logs.length > MAX_LOGS) {
    logs.splice(MAX_LOGS);
  }
  
  // Format for console
  const timestamp = entry.timestamp.toISOString();
  const prefix = `[${level.toUpperCase()}][${category}]`;
  const meta: Record<string, any> = {};
  
  if (entry.componentName) {
    meta.component = entry.componentName;
  }
  
  if (entry.context) {
    meta.context = entry.context;
  }
  
  // Log to console with appropriate level
  switch (level) {
    case LogLevel.DEBUG:
      originalConsole.debug(`${prefix} ${message}`, meta);
      break;
    case LogLevel.INFO:
      originalConsole.info(`${prefix} ${message}`, meta);
      break;
    case LogLevel.WARN:
      originalConsole.warn(`${prefix} ${message}`, meta);
      break;
    case LogLevel.ERROR:
      originalConsole.error(`${prefix} ${message}`, meta);
      break;
  }
}

/**
 * Debug level logging
 */
export function debug(
  message: string,
  category: LogCategory = LogCategory.SYSTEM,
  context?: Record<string, any>,
  componentName?: string
): void {
  log(message, LogLevel.DEBUG, category, context, componentName);
}

/**
 * Info level logging
 */
export function info(
  message: string,
  category: LogCategory = LogCategory.SYSTEM,
  context?: Record<string, any>,
  componentName?: string
): void {
  log(message, LogLevel.INFO, category, context, componentName);
}

/**
 * Warning level logging
 */
export function warn(
  message: string,
  category: LogCategory = LogCategory.SYSTEM,
  context?: Record<string, any>,
  componentName?: string
): void {
  log(message, LogLevel.WARN, category, context, componentName);
}

/**
 * Error level logging
 */
export function error(
  message: string,
  category: LogCategory = LogCategory.SYSTEM,
  context?: Record<string, any>,
  componentName?: string
): void {
  log(message, LogLevel.ERROR, category, context, componentName);
}

/**
 * Get all logs
 */
export function getLogs(limit: number = MAX_LOGS): LogEntry[] {
  return logs.slice(0, limit);
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  logs.length = 0;
}

/**
 * Log performance metrics
 */
export function logPerformance(
  operation: string,
  durationMs: number,
  context?: Record<string, any>,
  componentName?: string
): void {
  // Define thresholds for different performance levels
  const thresholds = {
    fast: 100, // Under 100ms is fast
    acceptable: 500, // Under 500ms is acceptable
    slow: 1000, // Under 1s is slow but tolerable
    // Over 1s is very slow
  };
  
  let level = LogLevel.INFO;
  
  if (durationMs > thresholds.slow) {
    level = LogLevel.WARN;
  } else if (durationMs > thresholds.acceptable) {
    level = LogLevel.INFO;
  }
  
  const message = `${operation} took ${durationMs.toFixed(2)}ms`;
  log(message, level, LogCategory.PERFORMANCE, {
    ...context,
    durationMs,
    thresholds: {
      fast: durationMs <= thresholds.fast,
      acceptable: durationMs <= thresholds.acceptable,
      slow: durationMs <= thresholds.slow,
    },
  }, componentName);
}

/**
 * Performance measurement utility
 */
export function measure<T>(
  operation: string,
  fn: () => T,
  componentName?: string,
  context?: Record<string, any>
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;
  
  logPerformance(operation, duration, context, componentName);
  
  return result;
}

/**
 * Async performance measurement utility
 */
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  componentName?: string,
  context?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  logPerformance(operation, duration, context, componentName);
  
  return result;
}

/**
 * Log user actions
 */
export function logUserAction(
  action: string,
  userId?: number,
  details?: Record<string, any>,
  componentName?: string
): void {
  log(
    action,
    LogLevel.INFO,
    LogCategory.USER_ACTION,
    {
      ...details,
      userId,
    },
    componentName
  );
}

/**
 * Create a logger for a specific component
 */
export function createComponentLogger(componentName: string) {
  return {
    debug: (message: string, category: LogCategory = LogCategory.UI, context?: Record<string, any>) => 
      debug(message, category, context, componentName),
    
    info: (message: string, category: LogCategory = LogCategory.UI, context?: Record<string, any>) => 
      info(message, category, context, componentName),
    
    warn: (message: string, category: LogCategory = LogCategory.UI, context?: Record<string, any>) => 
      warn(message, category, context, componentName),
    
    error: (message: string, category: LogCategory = LogCategory.UI, context?: Record<string, any>) => 
      error(message, category, context, componentName),
    
    performance: (operation: string, durationMs: number, context?: Record<string, any>) => 
      logPerformance(operation, durationMs, context, componentName),
    
    measure: <T>(operation: string, fn: () => T, context?: Record<string, any>) => 
      measure(operation, fn, componentName, context),
    
    measureAsync: <T>(operation: string, fn: () => Promise<T>, context?: Record<string, any>) => 
      measureAsync(operation, fn, componentName, context),
    
    userAction: (action: string, userId?: number, details?: Record<string, any>) => 
      logUserAction(action, userId, details, componentName),
  };
}