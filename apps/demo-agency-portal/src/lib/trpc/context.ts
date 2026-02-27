import type { TRPCContext } from '@logacore/core/trpc';

/**
 * Creates the tRPC context for each request.
 *
 * Day 7 will inject real user from NextAuth session.
 * DB wiring deferred — hello-world greet doesn't need it.
 */
export function createContext(): TRPCContext {
  return {
    user: null,
    db: null,
  };
}
