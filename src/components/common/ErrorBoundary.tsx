import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/error-handling';
import { ErrorCategory, ErrorSeverity } from '@/lib/error-handling';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-8 border rounded-lg bg-destructive/5 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold tracking-tight mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again or contact support.'}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={resetErrorBoundary}
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  componentName?: string;
}> = ({
  children,
  fallback,
  onError,
  componentName = 'Unknown Component'
}) => {
    // Handle error with our custom error system
    const handleErrorWithContext = React.useCallback(
      (error: Error, info: React.ErrorInfo) => {
        // Log error to our system
        handleError(
          error,
          true, // Show toast notification
          {
            severity: ErrorSeverity.ERROR,
            category: ErrorCategory.UI,
            componentName,
            context: {
              componentStack: info.componentStack || undefined,
            },
          }
        );

        // Call additional error handler if provided
        if (onError) {
          onError(error, info);
        }
      },
      [onError, componentName]
    );

    return (
      <ReactErrorBoundary
        FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
        onError={handleErrorWithContext}
      >
        {children}
      </ReactErrorBoundary>
    );
  };

// Wrap a component with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
    componentName?: string;
  } = {}
): React.FC<P> {
  const { fallback, onError, componentName } = options;

  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary
        fallback={fallback}
        onError={onError}
        componentName={componentName || Component.displayName || Component.name}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set displayName for debugging
  const displayName = Component.displayName || Component.name;
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;

  return WrappedComponent;
}