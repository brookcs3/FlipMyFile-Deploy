import { QueryClient } from "@tanstack/react-query";

/**
 * Default options for all queries
 */
const defaultQueryOptions = {
  refetchOnWindowFocus: false,
};

/**
 * QueryClient instance for the application
 * This is used to manage all the queries in the application
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueryOptions,
  },
});

/**
 * Helper function to make API requests
 * @param endpoint - The API endpoint to request
 * @param options - Fetch options
 * @returns Response data
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Handle non-2xx responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || "An error occurred");
  }

  // Return empty object for 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}