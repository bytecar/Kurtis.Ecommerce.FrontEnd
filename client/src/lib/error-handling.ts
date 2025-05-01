/**
 * Comprehensive error handling system for the application.
 * Provides utilities for handling, logging, and classifying errors.
 */
import { toast } from '@/hooks/use-toast';
import { logger, LogCategory, LogLevel } from './logging';

/**
 * Categories of errors for better organization
 */
export enum ErrorCategory {
  API = 'api',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA = 'data',
  UI = 'ui',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

/**
 * Severity levels for errors
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error context containing additional information about the error
 */
export interface ErrorContext {
  severity: ErrorSeverity;
  category: ErrorCategory;
  componentName?: string;
  context?: Record<string, any>;
}

// In-memory error log for development and debugging
const errorLogs: Array<{
  message: string;
  timestamp: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  componentName?: string;
  stack?: string;
  context?: Record<string, any>;
}> = [];

/**
 * Main error handling function - all errors should go through this
 */
export function handleError(
  error: Error | string,
  showToast = true,
  context?: Partial<ErrorContext>
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  // Default values
  const severity = context?.severity || ErrorSeverity.ERROR;
  const category = context?.category || ErrorCategory.UNKNOWN;
  const componentName = context?.componentName;
  const additionalContext = context?.context || {};
  
  // Log the error to the console with our logging system
  const logLevel = severity === ErrorSeverity.INFO 
    ? LogLevel.INFO 
    : severity === ErrorSeverity.WARNING 
      ? LogLevel.WARNING 
      : LogLevel.ERROR;
  
  // Map error category to log category
  const logCategory: LogCategory = mapErrorToLogCategory(category);
  
  // Add to error logs
  errorLogs.unshift({
    message: errorMessage,
    timestamp: Date.now(),
    severity,
    category,
    componentName,
    stack: errorStack,
    context: additionalContext,
  });
  
  // Trim logs to a reasonable size
  if (errorLogs.length > 100) {
    errorLogs.pop();
  }
  
  // Log to our logger
  logger.log(
    logLevel,
    errorMessage,
    logCategory,
    {
      ...additionalContext,
      componentName,
      stack: errorStack,
    }
  );
  
  // Show toast notification if requested
  if (showToast) {
    const toastVariant = severity === ErrorSeverity.ERROR || severity === ErrorSeverity.CRITICAL 
      ? 'destructive' 
      : undefined;
    
    toast({
      title: getCategoryTitle(category),
      description: errorMessage,
      variant: toastVariant,
    });
  }
}

/**
 * Map error category to log category
 */
function mapErrorToLogCategory(errorCategory: ErrorCategory): LogCategory {
  switch (errorCategory) {
    case ErrorCategory.API:
      return LogCategory.API;
    case ErrorCategory.VALIDATION:
      return LogCategory.VALIDATION;
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTHORIZATION:
      return LogCategory.AUTH;
    case ErrorCategory.DATA:
      return LogCategory.DATA;
    case ErrorCategory.UI:
      return LogCategory.UI;
    case ErrorCategory.NETWORK:
      return LogCategory.NETWORK;
    default:
      return LogCategory.APP;
  }
}

/**
 * Get a friendly title for error categories
 */
function getCategoryTitle(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.API:
      return 'API Error';
    case ErrorCategory.VALIDATION:
      return 'Validation Error';
    case ErrorCategory.AUTHENTICATION:
      return 'Authentication Error';
    case ErrorCategory.AUTHORIZATION:
      return 'Authorization Error';
    case ErrorCategory.DATA:
      return 'Data Error';
    case ErrorCategory.UI:
      return 'UI Error';
    case ErrorCategory.NETWORK:
      return 'Network Error';
    default:
      return 'Error';
  }
}

/**
 * Get error logs for display
 */
export function getErrorLogs(limit?: number): typeof errorLogs {
  if (limit && limit > 0) {
    return errorLogs.slice(0, limit);
  }
  return [...errorLogs];
}

/**
 * Clear error logs (useful for testing)
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Utility function to detect network errors
 */
export function isNetworkError(error: any): boolean {
  return (
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('Network request failed') ||
    error.message?.includes('Network error') ||
    error.message?.includes('ECONNREFUSED') ||
    error.name === 'TypeError' && error.message?.includes('network')
  );
}

/**
 * Format an error message from an unknown error
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error) {
      return String(error.message);
    }
    
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error object';
    }
  }
  
  return 'Unknown error';
}

/**
 * Create an enhanced error object
 */
export interface EnhancedError extends Error {
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: Record<string, any>;
  code?: string;
  componentName?: string;
  originalError?: Error;
}

/**
 * Create an error with additional metadata
 */
export function createError(
  message: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  metadata: {
    code?: string;
    componentName?: string;
    context?: Record<string, any>;
    originalError?: Error;
  } = {}
): EnhancedError {
  const error = new Error(message) as EnhancedError;
  error.severity = severity;
  error.category = category;
  
  if (metadata.code) {
    error.code = metadata.code;
  }
  
  if (metadata.componentName) {
    error.componentName = metadata.componentName;
  }
  
  if (metadata.context) {
    error.context = metadata.context;
  }
  
  if (metadata.originalError) {
    error.originalError = metadata.originalError;
    
    // Copy the stack trace if available
    if (metadata.originalError.stack) {
      error.stack = metadata.originalError.stack;
    }
  }
  
  return error;
}