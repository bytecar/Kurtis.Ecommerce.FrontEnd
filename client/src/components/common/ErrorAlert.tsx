import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorSeverity } from '@/lib/error-handling';

interface ErrorAlertProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  severity = 'error',
  onClose,
}) => {
  // Configure alert based on severity
  const config = {
    variant: 
      severity === 'info' ? 'default' :
      severity === 'warning' ? undefined :
      severity === 'error' || severity === 'critical' ? 'destructive' : 
      'destructive',
    icon: 
      severity === 'info' ? <Info className="h-4 w-4" /> :
      severity === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
      severity === 'error' ? <AlertCircle className="h-4 w-4" /> :
      severity === 'critical' ? <XCircle className="h-4 w-4" /> :
      <AlertCircle className="h-4 w-4" />,
    className:
      severity === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
      severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
      severity === 'error' ? '' :
      severity === 'critical' ? 'animate-pulse' : '',
  };

  return (
    <Alert variant={config.variant as any} className={config.className}>
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          {config.icon}
          <div>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </div>
        </div>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </Alert>
  );
};

interface ErrorAlertListProps {
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
  if (!errors || errors.length === 0) return null;

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