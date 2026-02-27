import { baseProcedure } from './init';
import { enforceAuth } from './middleware';

/**
 * Public procedure — no authentication required.
 *
 * Use for endpoints accessible without login
 * (e.g., health checks, public data).
 */
export const publicProcedure = baseProcedure;

/**
 * Protected procedure — authentication enforced.
 *
 * Stacks the auth middleware so all procedures built from
 * this base require an authenticated user.
 *
 * Before auth is wired (Day 7), null user = dev mode (allowed).
 */
export const protectedProcedure = baseProcedure.use(enforceAuth);
