import React from 'react';
import { AlertCircle, Ban, XCircle, AlertTriangle, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorSeverity } from '@/lib/error-handling';

// Error severity controls the styling
export interface ErrorAlertProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  severity = ErrorSeverity.ERROR,
  onClose,
}) => {
  // Define classes based on severity
  const getAlertClasses = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case ErrorSeverity.WARNING:
        return 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case ErrorSeverity.ERROR:
        return 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300';
      case ErrorSeverity.CRITICAL:
        return 'border-red-500 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-300';
      default:
        return 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300';
    }
  };

  // Get the appropriate icon
  const getIcon = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case ErrorSeverity.WARNING:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case ErrorSeverity.ERROR:
        return <Ban className="h-4 w-4 text-red-500" />;
      case ErrorSeverity.CRITICAL:
        return <XCircle className="h-4 w-4 text-red-700" />;
      default:
        return <Ban className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Alert className={`mb-4 flex items-center justify-between ${getAlertClasses()}`}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </div>
      </div>
      {onClose && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </Alert>
  );
};

// Component for displaying multiple errors
export interface ErrorAlertListProps {
  errors: Array<{
    title: string;
    message: string;
    severity?: ErrorSeverity;
  }>;
  onClose?: (index: number) => void;
}

export const ErrorAlertList: React.FC<ErrorAlertListProps> = ({
  errors,
  onClose,
}) => {
  if (!errors.length) return null;

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <ErrorAlert
          key={index}
          title={error.title}
          message={error.message}
          severity={error.severity}
          onClose={onClose ? () => onClose(index) : undefined}
        />
      ))}
    </div>
  );
};