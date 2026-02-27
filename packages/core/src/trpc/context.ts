import type { User } from '../types/user';

/**
 * The tRPC context shape shared across all procedures.
 *
 * Core defines the shape; the app creates the actual context
 * in its API route handler (injecting db, session, etc.).
 *
 * `db` is typed as `unknown` to avoid core depending on
 * `@logacore/db`. Plugins access it through typed services.
 */
export interface TRPCContext {
  /** Authenticated user, or null for dev/unauthenticated access */
  user: User | null;
  /** Database client instance (Drizzle). Typed as unknown in core. */
  db: unknown;
}
