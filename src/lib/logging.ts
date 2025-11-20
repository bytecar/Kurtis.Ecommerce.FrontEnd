/**
 * A comprehensive logging system that can be used throughout the application.
 * It supports different log levels, categories, and context information.
 */

// Log levels according to severity
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

// Log categories for better organization
export enum LogCategory {
  APP = 'app',
  API = 'api',
  AUTH = 'auth',
  DATA = 'data',
  UI = 'ui',
  NETWORK = 'network',
  VALIDATION = 'validation',
}

// Interface for the logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxLogsStored: number;
}

// Interface for a log entry
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  category?: LogCategory;
  context?: Record<string, any>;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARNING : LogLevel.DEBUG,
  enableConsole: true,
  enableStorage: true,
  maxLogsStored: 1000,
};

// In-memory storage for logs
const logStorage: LogEntry[] = [];

/**
 * The main logger class that handles all logging operations
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Main logging method
   */
  log(
    level: LogLevel,
    message: string,
    category?: LogCategory,
    context?: Record<string, any>
  ): void {
    // Skip if below minimum level
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      category,
      context,
    };

    // Log to console if enabled
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Store log if enabled
    if (this.config.enableStorage) {
      this.storeLog(entry);
    }
  }

  /**
   * Debug level log
   */
  debug(message: string, category?: LogCategory, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, category, context);
  }

  /**
   * Info level log
   */
  info(message: string, category?: LogCategory, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, category, context);
  }

  /**
   * Warning level log
   */
  warn(message: string, category?: LogCategory, context?: Record<string, any>): void {
    this.log(LogLevel.WARNING, message, category, context);
  }

  /**
   * Error level log
   */
  error(message: string, category?: LogCategory, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, category, context);
  }

  /**
   * Retrieve logs
   */
  getLogs(limit?: number, level?: LogLevel, category?: LogCategory): LogEntry[] {
    let filteredLogs = [...logStorage];

    // Filter by level
    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    // Filter by category
    if (category) {
      filteredLogs = filteredLogs.filter((log) => log.category === category);
    }

    // Apply limit
    if (limit && limit > 0) {
      filteredLogs = filteredLogs.slice(0, limit);
    }

    return filteredLogs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    logStorage.length = 0;
  }

  /**
   * Check if a log level should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    const levelOrder = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARNING]: 2,
      [LogLevel.ERROR]: 3,
    };

    return levelOrder[level] >= levelOrder[this.config.minLevel];
  }

  /**
   * Log entry to console with appropriate styling
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const category = entry.category ? `[${entry.category}]` : '';
    
    // Format the log message
    const logMessage = `[${entry.level.toUpperCase()}]${category} ${entry.message}`;
    
    // Log with appropriate console method and styling
    const consoleMethod = this.getConsoleMethod(entry.level);
    const hasContext = entry.context && Object.keys(entry.context).length > 0;
    
    if (hasContext) {
      console.groupCollapsed(`${logMessage}`);
      console[consoleMethod](logMessage);
      console.log('Context:', entry.context);
      console.groupEnd();
    } else {
      console[consoleMethod](logMessage);
    }
  }

  /**
   * Store log entry in memory
   */
  private storeLog(entry: LogEntry): void {
    // Add to front for most recent first
    logStorage.unshift(entry);
    
    // Trim if exceeds max size
    if (logStorage.length > this.config.maxLogsStored) {
      logStorage.pop();
    }
  }

  /**
   * Get the appropriate console method for a log level
   */
  private getConsoleMethod(level: LogLevel): 'debug' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.DEBUG:
        return 'debug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARNING:
        return 'warn';
      case LogLevel.ERROR:
        return 'error';
      default:
        return 'info';
    }
  }
}

// Create and export a singleton logger instance
export const logger = new Logger();

// Export a function to create custom logger instances
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}