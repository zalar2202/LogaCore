import { QueryClient } from '@tanstack/react-query';

/**
 * Factory for creating a QueryClient with LogaCore defaults.
 * Stale time set to 30s to avoid aggressive refetching during navigation.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
}
