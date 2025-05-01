import { toast } from '@/hooks/use-toast';
import { createError, handleError, ErrorCategory, ErrorSeverity } from './error-handling';
import { error as logError } from './logging';

/**
 * Standard error responses from the API
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
  validationErrors?: Record<string, string[]>;
}

/**
 * Handles API errors in a consistent way across the application
 * @param err The error object, typically from a catch block
 * @param componentName Optional component name for better error context
 * @param showToast Whether to show a toast notification (default: true)
 * @returns The processed error object for further handling if needed
 */
export function handleApiError(
  err: any, 
  componentName: string = 'API',
  showToast: boolean = true
): Error {
  // Default error message if we can't extract anything useful
  let errorMessage = 'An unexpected error occurred';
  let errorCategory = ErrorCategory.API;
  let errorCode = 'UNKNOWN_ERROR';
  let errorDetails: Record<string, any> = {};
  let errorSeverity = ErrorSeverity.ERROR;
  
  try {
    // If it's a Response object (fetch API)
    if (err instanceof Response) {
      return handleFetchResponseError(err, componentName, showToast);
    }
    
    // If it's already an Error object
    if (err instanceof Error) {
      errorMessage = err.message;
      
      // Try to extract more details if it's an Axios error or similar
      if (err.name === 'AxiosError' && (err as any).response) {
        const axiosErr = err as any;
        const status = axiosErr.response?.status;
        
        errorMessage = axiosErr.response?.data?.message || errorMessage;
        errorCode = axiosErr.response?.data?.code || `HTTP_${status}`;
        errorDetails = axiosErr.response?.data?.details || {};
        
        if (status === 401 || status === 403) {
          errorCategory = ErrorCategory.AUTHENTICATION;
          errorSeverity = ErrorSeverity.WARNING;
        } else if (status === 400 || status === 422) {
          errorCategory = ErrorCategory.VALIDATION;
          errorSeverity = ErrorSeverity.WARNING;
        } else if (status >= 500) {
          errorCategory = ErrorCategory.NETWORK;
          errorSeverity = ErrorSeverity.ERROR;
        }
      }
    }
    // If it's a string
    else if (typeof err === 'string') {
      errorMessage = err;
    }
    // If it's an object with a message
    else if (err && typeof err === 'object' && 'message' in err) {
      errorMessage = err.message as string;
      
      if ('code' in err) {
        errorCode = err.code as string;
      }
      
      if ('details' in err) {
        errorDetails = err.details as Record<string, any>;
      }
    }
  } catch (parsingError) {
    // If error handling itself throws an error, log it
    logError('Error while handling API error', 'api', {
      originalError: err,
      parsingError
    });
  }
  
  // Create a structured error
  const appError = createError(
    errorMessage,
    errorSeverity,
    errorCategory,
    {
      code: errorCode,
      componentName,
      context: errorDetails,
      originalError: err instanceof Error ? err : undefined
    }
  );
  
  // Handle the error (logs it and optionally shows toast)
  handleError(appError, showToast);
  
  // Return as a regular Error for easier integration with existing code
  return new Error(errorMessage);
}

/**
 * Handles errors from fetch API responses
 */
async function handleFetchResponseError(
  response: Response,
  componentName: string = 'API',
  showToast: boolean = true
): Promise<Error> {
  let errorMessage = 'An unexpected server error occurred';
  let errorCategory = ErrorCategory.API;
  let errorCode = `HTTP_${response.status}`;
  let errorDetails: Record<string, any> = {
    url: response.url,
    status: response.status,
    statusText: response.statusText
  };
  let errorSeverity = ErrorSeverity.ERROR;
  let errorResponse: ApiErrorResponse | undefined;
  
  try {
    // Try to parse the response as JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorResponse = await response.clone().json();
      errorMessage = errorResponse.message || errorMessage;
      errorCode = errorResponse.code || errorCode;
      
      if (errorResponse.details) {
        errorDetails = { ...errorDetails, ...errorResponse.details };
      }
      
      if (errorResponse.validationErrors) {
        errorDetails.validationErrors = errorResponse.validationErrors;
      }
    } else {
      // If not JSON, try to get the text
      errorMessage = await response.clone().text() || errorMessage;
    }
    
    // Set the error category based on the HTTP status code
    if (response.status === 401 || response.status === 403) {
      errorCategory = ErrorCategory.AUTHENTICATION;
      errorSeverity = ErrorSeverity.WARNING;
    } else if (response.status === 400 || response.status === 422) {
      errorCategory = ErrorCategory.VALIDATION;
      errorSeverity = ErrorSeverity.WARNING;
    } else if (response.status >= 500) {
      errorCategory = ErrorCategory.NETWORK;
      errorSeverity = ErrorSeverity.ERROR;
    }
  } catch (parsingError) {
    // If parsing fails, use the status text
    errorMessage = response.statusText || errorMessage;
    logError('Error parsing API error response', 'api', {
      url: response.url,
      status: response.status,
      parsingError
    });
  }
  
  // Create a structured error
  const appError = createError(
    errorMessage,
    errorSeverity,
    errorCategory,
    {
      code: errorCode,
      componentName,
      context: errorDetails
    }
  );
  
  // Handle the error (logs it and optionally shows toast)
  handleError(appError, showToast);
  
  // Return as a regular Error
  return new Error(errorMessage);
}

/**
 * Shows validation errors from the API as toast notifications
 * or you can provide a callback to handle them differently
 */
export function handleValidationErrors(
  validationErrors: Record<string, string[]>,
  onFieldError?: (field: string, errors: string[]) => void
): void {
  if (!validationErrors) return;
  
  // If no callback is provided, show toast notifications
  if (!onFieldError) {
    // Get the first error to show as a toast
    const fields = Object.keys(validationErrors);
    if (fields.length > 0) {
      const firstField = fields[0];
      const firstError = validationErrors[firstField][0];
      
      toast({
        title: 'Validation Error',
        description: firstError,
        variant: 'destructive',
      });
      
      // Log all validation errors
      logError(
        'Validation errors', 
        'validation', 
        { validationErrors }
      );
      
      return;
    }
  }
  
  // Call the callback for each field error
  Object.entries(validationErrors).forEach(([field, errors]) => {
    onFieldError?.(field, errors);
  });
}