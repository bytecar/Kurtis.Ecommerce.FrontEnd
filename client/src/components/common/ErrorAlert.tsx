import React from 'react';
import { AlertTriangle, XCircle, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorSeverity } from '@/lib/error-handling';

type ErrorAlertProps = {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  onClose?: () => void;
  className?: string;
};

/**
 * A consistent error alert component that can be used throughout the application
 * to display error messages to users.
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  severity = ErrorSeverity.ERROR,
  onClose,
  className = '',
}) => {
  // Define styles based on severity
  const severityStyles = {
    [ErrorSeverity.INFO]: {
      icon: <Info className="h-4 w-4" />,
      classes: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800/30',
    },
    [ErrorSeverity.WARNING]: {
      icon: <AlertCircle className="h-4 w-4" />,
      classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800/30',
    },
    [ErrorSeverity.ERROR]: {
      icon: <AlertTriangle className="h-4 w-4" />,
      classes: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800/30',
    },
    [ErrorSeverity.CRITICAL]: {
      icon: <XCircle className="h-4 w-4" />,
      classes: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700',
    },
  };

  const { icon, classes } = severityStyles[severity];

  return (
    <Alert className={`${classes} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="ml-3 w-full">
          <AlertTitle className="text-sm font-medium">{title}</AlertTitle>
          <AlertDescription className="mt-1 text-sm">
            {message}
          </AlertDescription>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
};

/**
 * A component that can be used to display a list of errors
 */
export const ErrorAlertList: React.FC<{
  errors: Array<{ title: string; message: string; severity?: ErrorSeverity }>;
  onClose?: (index: number) => void;
  className?: string;
}> = ({ errors, onClose, className = '' }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {errors.map((error, index) => (
        <ErrorAlert
          key={`error-${index}`}
          title={error.title}
          message={error.message}
          severity={error.severity}
          onClose={onClose ? () => onClose(index) : undefined}
        />
      ))}
    </div>
  );
};