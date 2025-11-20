import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { handleApiError } from './api-error-handler.js';
import { logger, LogCategory } from './logging.js';
import { ErrorCategory } from './error-handling.js';

async function throwIfResNotOk(res: Response, componentName?: string) {
  if (!res.ok) {
    // handleApiError will handle logging and presenting the error
    // but we still need to throw to stop the Promise chain
    await handleApiError(res, componentName || 'API');
    
    // This throw will rarely be reached as handleApiError throws itself,
    // but we include it for safety
    throw new Error(`Request failed with status ${res.status}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  componentName?: string
): Promise<Response> {
  try {
    logger.info(`API Request: ${method} ${url}`, LogCategory.API, { method, url, data });
    
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res, componentName);
    return res;
  } catch (err) {
    // If throwIfResNotOk didn't catch it, we handle it here
    if (!(err instanceof Error && err.message.startsWith('Request failed'))) {
      handleApiError(err, componentName || 'API');
    }
    throw err;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  componentName?: string;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, componentName }) =>
  async ({ queryKey }) => {
    try {
      const endpoint = queryKey[0] as string;
      logger.info(`API Query: ${endpoint}`, LogCategory.API, { endpoint, queryKey });
      
      const res = await fetch(endpoint, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        logger.error(`Unauthorized access to ${endpoint}`, LogCategory.AUTH, { 
          endpoint, 
          status: 401,
          queryKey 
        });
        return null;
      }

      await throwIfResNotOk(res, componentName);
      const data = await res.json();
      
      return data;
    } catch (err) {
      // If the error wasn't already handled by throwIfResNotOk
      if (!(err instanceof Error && err.message.startsWith('Request failed'))) {
        handleApiError(err, componentName || 'Query', false);
      }
      throw err;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
