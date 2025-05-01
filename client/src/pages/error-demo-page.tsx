import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  ErrorSeverity, 
  ErrorCategory, 
  createError, 
  handleError,
  getErrorLogs,
  clearErrorLogs
} from '@/lib/error-handling';
import { handleApiError } from '@/lib/api-error-handler';
import { ErrorAlert, ErrorAlertList } from '@/components/common/ErrorAlert';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';

// Component that intentionally throws an error for demo purposes
const BuggyComponent: React.FC = () => {
  React.useEffect(() => {
    throw new Error('This is an intentional error from BuggyComponent');
  }, []);
  
  return <div>This component has a bug that causes it to crash</div>;
};

// Main demo page
const ErrorDemoPage: React.FC = () => {
  const { toast } = useToast();
  const [severity, setSeverity] = useState<ErrorSeverity>(ErrorSeverity.ERROR);
  const [category, setCategory] = useState<ErrorCategory>(ErrorCategory.UNKNOWN);
  const [message, setMessage] = useState('This is a test error message');
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ReturnType<typeof getErrorLogs>>([]);
  const [errorList, setErrorList] = useState<Array<{title: string; message: string; severity?: ErrorSeverity}>>([
    {
      title: 'Form Validation Error',
      message: 'Please complete all required fields marked with an asterisk (*)',
      severity: ErrorSeverity.WARNING
    }
  ]);

  // Demonstrate creating and handling an error
  const handleCreateError = () => {
    const error = createError(
      message,
      severity,
      category,
      {
        code: 'DEMO_ERROR',
        componentName: 'ErrorDemoPage',
        context: {
          demoData: 'This is some additional context about the error',
          timestamp: new Date().toISOString()
        }
      }
    );
    
    handleError(error, true);
    refreshErrorLogs();
  };

  // Demonstrate API error handling
  const simulateApiError = () => {
    // Create a fake Response object to simulate an API error
    const fakeResponse = new Response(
      JSON.stringify({
        message: 'Resource not found',
        code: 'NOT_FOUND',
        details: {
          resourceId: '123',
          resourceType: 'product'
        }
      }),
      { 
        status: 404, 
        statusText: 'Not Found',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
    
    handleApiError(fakeResponse, 'ErrorDemoPage');
    refreshErrorLogs();
  };

  // Simulate different toast notifications
  const showToastNotification = (type: 'default' | 'success' | 'warning' | 'destructive') => {
    const titles = {
      default: 'Information',
      success: 'Success',
      warning: 'Warning',
      destructive: 'Error'
    };
    
    const messages = {
      default: 'This is an informational message.',
      success: 'Operation completed successfully!',
      warning: 'Please review the information before proceeding.',
      destructive: 'An error occurred while processing your request.'
    };
    
    toast({
      title: titles[type],
      description: messages[type],
      variant: type === 'default' ? undefined : type
    });
  };

  // Add error to the error list
  const addErrorToList = () => {
    setErrorList(prev => [
      ...prev,
      {
        title: `${category} Error`,
        message,
        severity
      }
    ]);
  };

  // Remove error from the error list
  const removeErrorFromList = (index: number) => {
    setErrorList(prev => prev.filter((_, i) => i !== index));
  };

  // Refresh error logs
  const refreshErrorLogs = () => {
    setErrorLogs(getErrorLogs());
  };

  // Clear error logs
  const handleClearErrorLogs = () => {
    clearErrorLogs();
    refreshErrorLogs();
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Error Handling Demonstration</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => showToastNotification('success')}
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Success Toast
          </Button>
          <Button
            onClick={() => showToastNotification('warning')}
            variant="outline"
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Warning Toast
          </Button>
          <Button
            onClick={() => showToastNotification('destructive')}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Error Toast
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Generation</CardTitle>
          <CardDescription>
            Create different types of errors to see how they are handled by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Error</TabsTrigger>
              <TabsTrigger value="api">API Error</TabsTrigger>
              <TabsTrigger value="component">Component Error</TabsTrigger>
              <TabsTrigger value="alerts">Error Alerts</TabsTrigger>
              <TabsTrigger value="logs">Error Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="error-message">Error Message</Label>
                  <Input
                    id="error-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="error-severity">Error Severity</Label>
                    <Select
                      value={severity}
                      onValueChange={(value) => setSeverity(value as ErrorSeverity)}
                    >
                      <SelectTrigger id="error-severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ErrorSeverity.INFO}>Info</SelectItem>
                        <SelectItem value={ErrorSeverity.WARNING}>Warning</SelectItem>
                        <SelectItem value={ErrorSeverity.ERROR}>Error</SelectItem>
                        <SelectItem value={ErrorSeverity.CRITICAL}>Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-category">Error Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value as ErrorCategory)}
                    >
                      <SelectTrigger id="error-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ErrorCategory.API}>API</SelectItem>
                        <SelectItem value={ErrorCategory.VALIDATION}>Validation</SelectItem>
                        <SelectItem value={ErrorCategory.AUTHENTICATION}>Authentication</SelectItem>
                        <SelectItem value={ErrorCategory.AUTHORIZATION}>Authorization</SelectItem>
                        <SelectItem value={ErrorCategory.DATA}>Data</SelectItem>
                        <SelectItem value={ErrorCategory.UI}>UI</SelectItem>
                        <SelectItem value={ErrorCategory.NETWORK}>Network</SelectItem>
                        <SelectItem value={ErrorCategory.UNKNOWN}>Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateError}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Generate Error
              </Button>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <p className="text-sm text-gray-500">
                This tab demonstrates how API errors are handled in the application.
                Click the button below to simulate a 404 API error.
              </p>
              <Button onClick={simulateApiError}>
                <Info className="mr-2 h-4 w-4" />
                Simulate API Error
              </Button>
            </TabsContent>
            
            <TabsContent value="component" className="space-y-4">
              <p className="text-sm text-gray-500">
                This tab demonstrates how component errors are caught by ErrorBoundary.
                The buggy component below will crash, but the error will be contained.
              </p>
              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => setShowBuggyComponent(prev => !prev)}
                  variant={showBuggyComponent ? "destructive" : "default"}
                >
                  {showBuggyComponent ? "Hide" : "Show"} Buggy Component
                </Button>
              </div>
              {showBuggyComponent && (
                <div className="mt-4 border rounded-md p-4">
                  <ErrorBoundary>
                    <BuggyComponent />
                  </ErrorBoundary>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-4">
              <div className="mb-4">
                <Button onClick={addErrorToList}>
                  Add Error to List
                </Button>
              </div>
              <ErrorAlertList 
                errors={errorList} 
                onClose={removeErrorFromList}
              />
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-4">
              <div className="flex justify-between mb-4">
                <Button onClick={refreshErrorLogs} variant="outline">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Refresh Logs
                </Button>
                <Button onClick={handleClearErrorLogs} variant="destructive">
                  Clear Logs
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                {errorLogs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No error logs found</p>
                ) : (
                  <ul className="space-y-4">
                    {errorLogs.map((log, index) => (
                      <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="font-medium">{getErrorTitle(log.category)}</span>
                          <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-red-600 dark:text-red-400">{log.message}</p>
                        <div className="mt-2 text-xs">
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full mr-2">
                            {log.severity}
                          </span>
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {log.category}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get error title
function getErrorTitle(category: ErrorCategory): string {
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

export default ErrorDemoPage;