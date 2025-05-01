import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BugOff, BadgeAlert, Clock, RefreshCw, Ban, AlertTriangle, XCircle } from 'lucide-react';
import { ErrorBoundary, withErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorAlert, ErrorAlertList } from '@/components/common/ErrorAlert';
import { handleError, ErrorCategory, ErrorSeverity } from '@/lib/error-handling';
import { toast } from '@/hooks/use-toast';
import { clearErrorLogs, getErrorLogs } from '@/lib/error-handling';
import { apiRequest } from '@/lib/queryClient';

// Component that will throw an error when the button is clicked
const ErrorThrower: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error('This is a demonstration error thrown from a component');
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <Button 
        variant="outline" 
        onClick={() => setShouldThrow(true)}
        className="gap-2"
      >
        <BugOff className="h-4 w-4" />
        Throw Component Error
      </Button>
    </div>
  );
};

// Wrap the error thrower with our error boundary
const ErrorThrowerWithBoundary = withErrorBoundary(ErrorThrower, {
  componentName: 'ErrorThrowerDemo'
});

// Error category selector
function getErrorTitle(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.API: return 'API Error';
    case ErrorCategory.VALIDATION: return 'Validation Error';
    case ErrorCategory.AUTHENTICATION: return 'Authentication Error';
    case ErrorCategory.AUTHORIZATION: return 'Authorization Error';
    case ErrorCategory.DATA: return 'Data Error';
    case ErrorCategory.UI: return 'UI Error';
    case ErrorCategory.NETWORK: return 'Network Error';
    default: return 'Error';
  }
}

const ErrorDemoPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('Sample error message');
  const [errorSeverity, setErrorSeverity] = useState<ErrorSeverity>(ErrorSeverity.ERROR);
  const [errorCategory, setErrorCategory] = useState<ErrorCategory>(ErrorCategory.API);
  
  const [errorList, setErrorList] = useState<Array<{title: string; message: string; severity?: ErrorSeverity}>>([
    { 
      title: 'Could not connect to server', 
      message: 'Please check your network connection and try again.', 
      severity: ErrorSeverity.ERROR
    },
    { 
      title: 'Form validation failed', 
      message: 'Please correct the highlighted fields and submit again.', 
      severity: ErrorSeverity.WARNING
    }
  ]);
  
  const handleCreateError = () => {
    // Create and handle an error with our error handling system
    const error = new Error(errorMessage);
    
    handleError(
      error,
      true, // Show toast notification
      {
        severity: errorSeverity,
        category: errorCategory,
        componentName: 'ErrorDemoPage',
        context: {
          demo: true,
          createdAt: new Date().toISOString(),
        },
      }
    );
  };
  
  const handleAddToErrorList = () => {
    setErrorList([
      ...errorList,
      {
        title: getErrorTitle(errorCategory),
        message: errorMessage,
        severity: errorSeverity
      }
    ]);
  };
  
  const handleClearErrorList = () => {
    setErrorList([]);
  };
  
  const handleRemoveError = (index: number) => {
    const newList = [...errorList];
    newList.splice(index, 1);
    setErrorList(newList);
  };
  
  const handleApiError = async () => {
    try {
      // Attempt to access a non-existent endpoint
      await apiRequest('GET', '/api/non-existent-endpoint', undefined, 'ErrorDemoPage');
    } catch (error) {
      // Error is already handled by apiRequest
      console.log('API error caught in component');
    }
  };
  
  const handleShowToast = () => {
    // Map severity to toast variant
    const variant = 
      errorSeverity === ErrorSeverity.INFO ? undefined :
      errorSeverity === ErrorSeverity.WARNING ? "default" : // Use default since warning isn't available
      errorSeverity === ErrorSeverity.ERROR ? "destructive" :
      errorSeverity === ErrorSeverity.CRITICAL ? "destructive" :
      undefined;
    
    toast({
      title: getErrorTitle(errorCategory),
      description: errorMessage,
      variant,
    });
  };
  
  const handleClearErrorLogs = () => {
    clearErrorLogs();
    toast({
      title: "Error logs cleared",
      description: "All error logs have been cleared from memory",
    });
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Error Handling Demo</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        This page demonstrates the various error handling capabilities of the application.
        Try out different error types, severities, and view how they are displayed to users.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Error Configuration</CardTitle>
            <CardDescription>Create custom errors with different severities and categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="error-message">Error Message</Label>
              <Input 
                id="error-message" 
                value={errorMessage} 
                onChange={(e) => setErrorMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="error-severity">Error Severity</Label>
              <Select 
                value={errorSeverity} 
                onValueChange={(value) => setErrorSeverity(value as ErrorSeverity)}
              >
                <SelectTrigger id="error-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ErrorSeverity.INFO}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span>Information</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ErrorSeverity.WARNING}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Warning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ErrorSeverity.ERROR}>
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-500" />
                      <span>Error</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ErrorSeverity.CRITICAL}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-700" />
                      <span>Critical</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="error-category">Error Category</Label>
              <Select 
                value={errorCategory} 
                onValueChange={(value) => setErrorCategory(value as ErrorCategory)}
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
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={handleCreateError} className="gap-2">
              <BadgeAlert className="h-4 w-4" />
              Create & Log Error
            </Button>
            <Button onClick={handleShowToast} variant="outline" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Show Toast
            </Button>
            <Button onClick={handleApiError} variant="secondary" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Trigger API Error
            </Button>
            <Button onClick={handleClearErrorLogs} variant="ghost" className="gap-2">
              <Clock className="h-4 w-4" />
              Clear Error Logs
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Boundary Demo</CardTitle>
              <CardDescription>
                See how components are isolated with error boundaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary componentName="ErrorBoundaryDemo">
                <ErrorThrowerWithBoundary />
              </ErrorBoundary>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Error Alert Demo</CardTitle>
              <CardDescription>
                Display multiple errors with different severities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorAlertList 
                errors={errorList} 
                onClose={handleRemoveError} 
              />
              
              {errorList.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No errors to display
                </p>
              )}
            </CardContent>
            <CardFooter className="gap-2">
              <Button onClick={handleAddToErrorList} variant="outline" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Add to List
              </Button>
              <Button onClick={handleClearErrorList} variant="ghost" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Clear List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
          <CardDescription>View the last 5 errors that have been logged</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prettified">
            <TabsList className="mb-4">
              <TabsTrigger value="prettified">Prettified</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prettified">
              <div className="space-y-4">
                {getErrorLogs(5).map((log, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {log.severity === ErrorSeverity.INFO && <AlertCircle className="h-4 w-4 text-blue-500" />}
                      {log.severity === ErrorSeverity.WARNING && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {log.severity === ErrorSeverity.ERROR && <Ban className="h-4 w-4 text-red-500" />}
                      {log.severity === ErrorSeverity.CRITICAL && <XCircle className="h-4 w-4 text-red-700" />}
                      <h3 className="font-semibold">{getErrorTitle(log.category)}</h3>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    {log.componentName && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Component: {log.componentName}
                      </p>
                    )}
                  </div>
                ))}
                
                {getErrorLogs(5).length === 0 && (
                  <p className="text-muted-foreground text-center py-10">
                    No error logs available. Try creating some errors!
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="raw">
              <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(getErrorLogs(5), null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDemoPage;