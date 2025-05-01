import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleError, createError, ErrorSeverity, ErrorCategory } from '@/lib/error-handling';
import { info, error } from '@/lib/logging';

// Default fallback component for error boundaries
export const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30">
      <CardHeader>
        <CardTitle className="flex items-center text-red-800 dark:text-red-300">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-red-600 dark:text-red-400">
          <p className="font-medium mb-2">Error details:</p>
          <p className="font-mono text-xs p-2 bg-red-100 dark:bg-red-900/30 rounded whitespace-pre-wrap">
            {error.message}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline"
          className="w-full bg-white dark:bg-gray-900 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300"
          onClick={resetErrorBoundary}
        >
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

// Simplified error boundary component that logs errors using our error handling system
export const ErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactElement;
  componentName?: string;
  onReset?: () => void;
}> = ({ 
  children, 
  fallback,
  componentName = 'UnknownComponent',
  onReset
}) => {
  const handleErrorEvent = React.useCallback((error: Error, info: { componentStack: string }) => {
    // Log error using our error handling system
    handleError(
      createError(
        error.message,
        ErrorSeverity.ERROR,
        ErrorCategory.UI,
        {
          originalError: error,
          componentName,
          context: { 
            componentStack: info.componentStack
          }
        }
      ),
      false // Don't show toast since we're displaying a fallback UI
    );

    // Also log to our structured logging system
    error('Component error occurred', 'ui', {
      error: error.message,
      stack: error.stack,
      componentName,
      componentStack: info.componentStack
    });
  }, [componentName]);

  const handleReset = React.useCallback(() => {
    info('Error boundary reset', 'ui', { componentName });
    onReset?.();
  }, [componentName, onReset]);

  return (
    <ReactErrorBoundary
      fallbackRender={props => fallback ? React.cloneElement(fallback, props) : <ErrorFallback {...props} />}
      onError={handleErrorEvent}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Higher order component to add error boundary to any component
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    componentName?: string;
    fallback?: React.ReactElement;
    onReset?: () => void;
  } = {}
): React.FC<P> {
  const { componentName = Component.displayName || Component.name, fallback, onReset } = options;
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary componentName={componentName} fallback={fallback} onReset={onReset}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;
  
  return WrappedComponent;
}