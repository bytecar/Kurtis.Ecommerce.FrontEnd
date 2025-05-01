import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { handleError } from '@/lib/error-handling';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="text-sm mb-4">
          {error.message || 'An unknown error occurred'}
        </div>
        <Button 
          variant="outline" 
          onClick={resetErrorBoundary}
          size="sm"
          className="mt-2"
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// ErrorBoundary component wrapper around ReactErrorBoundary
export const ErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void; 
}> = ({ children, fallback, onError }) => {
  // Default error handler logs the error
  const handleErrorWithLogging = React.useCallback(
    (error: Error, info: { componentStack: string }) => {
      // Use our centralized error handling
      handleError(error, true);
      
      // Call the provided onError handler if it exists
      if (onError) {
        onError(error, info);
      }
    },
    [onError]
  );

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleErrorWithLogging}
    >
      {children}
    </ReactErrorBoundary>
  );
};