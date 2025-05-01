/**
 * Comprehensive error handling and logging system for the application
 * This module provides utilities for consistent error handling, logging,
 * and user feedback across the application.
 */

import { toast } from '@/hooks/use-toast';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error categories for better organization and filtering
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

// Structured error type for better tracking and handling
export interface AppError {
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  code?: string;
  userId?: number;
  componentName?: string;
  context?: Record<string, any>;
  originalError?: Error;
}

// Global error log storage for debugging
const errorLogs: AppError[] = [];

// Maximum number of errors to keep in memory
const MAX_ERROR_LOGS = 100;

/**
 * Creates a structured error object
 */
export function createError(
  message: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  options: Partial<AppError> = {}
): AppError {
  const error: AppError = {
    message,
    severity,
    category,
    timestamp: new Date(),
    ...options,
  };
  
  return error;
}

/**
 * Logs an error to the console and error log storage
 */
export function logError(error: AppError): void {
  // Add to in-memory logs
  errorLogs.unshift(error);
  
  // Trim log to maximum size
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.splice(MAX_ERROR_LOGS);
  }
  
  // Log to console based on severity
  const consoleStyles = {
    [ErrorSeverity.INFO]: 'color: #3b82f6; font-weight: bold;',
    [ErrorSeverity.WARNING]: 'color: #f59e0b; font-weight: bold;',
    [ErrorSeverity.ERROR]: 'color: #ef4444; font-weight: bold;',
    [ErrorSeverity.CRITICAL]: 'color: #7f1d1d; background: #fecaca; font-weight: bold; padding: 2px 5px;',
  };
  
  // Create a formatted log message
  const logPrefix = `[${error.severity.toUpperCase()}][${error.category}]`;
  
  // Log to console with appropriate styling
  console.group(`${logPrefix} ${error.message}`);
  console.log('%cTimestamp:', 'font-weight: bold;', error.timestamp.toISOString());
  
  if (error.code) {
    console.log('%cCode:', 'font-weight: bold;', error.code);
  }
  
  if (error.userId) {
    console.log('%cUser ID:', 'font-weight: bold;', error.userId);
  }
  
  if (error.componentName) {
    console.log('%cComponent:', 'font-weight: bold;', error.componentName);
  }
  
  if (error.context) {
    console.log('%cContext:', 'font-weight: bold;', error.context);
  }
  
  if (error.originalError) {
    console.log('%cOriginal Error:', 'font-weight: bold;', error.originalError);
    console.error(error.originalError);
  }
  
  console.groupEnd();
  
  // For critical errors, you might want to send to a server
  if (error.severity === ErrorSeverity.CRITICAL) {
    // In a production app, you would send this to your error tracking service
    // Example: sendToErrorTrackingService(error);
  }
}

/**
 * Handles an error by logging it and optionally displaying a toast notification
 */
export function handleError(
  error: AppError | Error,
  showToast: boolean = true,
  options: Partial<AppError> = {}
): void {
  // Convert standard Error to AppError if needed
  const appError: AppError = 
    error instanceof Error && !(error as any).severity ? 
    createError(
      error.message, 
      ErrorSeverity.ERROR, 
      ErrorCategory.UNKNOWN, 
      { originalError: error, ...options }
    ) : error as AppError;
  
  // Log the error
  logError(appError);
  
  // Show toast notification if requested
  if (showToast) {
    const toastVariant = 
      appError.severity === ErrorSeverity.INFO ? undefined :
      appError.severity === ErrorSeverity.WARNING ? 'warning' : 
      'destructive';
    
    toast({
      title: getErrorTitle(appError),
      description: appError.message,
      variant: toastVariant,
    });
  }
}

/**
 * Retrieves the recent error logs
 */
export function getErrorLogs(limit: number = MAX_ERROR_LOGS): AppError[] {
  return errorLogs.slice(0, limit);
}

/**
 * Clears all error logs
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Handles an API error response
 */
export async function handleApiError(
  response: Response, 
  componentName?: string,
  context?: Record<string, any>
): Promise<AppError> {
  let errorMessage = 'An unexpected error occurred';
  let errorCategory = ErrorCategory.API;
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } else {
      errorMessage = await response.text() || errorMessage;
    }
    
    if (response.status === 401 || response.status === 403) {
      errorCategory = ErrorCategory.AUTHENTICATION;
    } else if (response.status === 400 || response.status === 422) {
      errorCategory = ErrorCategory.VALIDATION;
    } else if (response.status >= 500) {
      errorCategory = ErrorCategory.NETWORK;
    }
  } catch (e) {
    // If parsing fails, use the status text
    errorMessage = response.statusText || errorMessage;
  }
  
  const error = createError(
    errorMessage,
    response.status >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING,
    errorCategory,
    {
      code: `HTTP_${response.status}`,
      componentName,
      context: {
        ...context,
        url: response.url,
        method: context?.method || 'GET',
        status: response.status,
      },
    }
  );
  
  handleError(error, true);
  return error;
}

/**
 * Returns a user-friendly error title based on the error category
 */
function getErrorTitle(error: AppError): string {
  switch (error.category) {
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

// Note: React components related to error handling 
// have been moved to components/common/ErrorBoundary.tsx