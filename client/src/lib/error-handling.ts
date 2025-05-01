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

/**
 * Custom error boundary component for React
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    handleError(
      createError(
        error.message,
        ErrorSeverity.ERROR,
        ErrorCategory.UI,
        {
          originalError: error,
          componentName: this.props.componentName || 'ErrorBoundary',
          context: { componentStack: errorInfo.componentStack }
        }
      ),
      false // Don't show toast here as we're showing fallback UI
    );
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Error fallback component to display when errors occur
export const ErrorFallback: React.FC<{ message?: string, retry?: () => void }> = ({ 
  message = "Something went wrong", 
  retry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30 text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-red-500 mb-4 h-8 w-8"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
        {message}
      </h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
        We're sorry, but an error occurred while trying to display this content.
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Create a higher-order component for error handling
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary 
      fallback={<ErrorFallback />} 
      componentName={componentName}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
}