import { TRPCError } from '@trpc/server';
import { middleware } from './init';
import { can } from '../rbac/can';

/**
 * Middleware that enforces the user is authenticated.
 *
 * Before auth is wired (Day 7), user is null and we allow
 * access (dev mode). This matches the RBAC `can()` behavior
 * where null user = full access.
 *
 * Once auth is wired, null user = truly unauthenticated,
 * and this middleware will be tightened to throw UNAUTHORIZED.
 */
export const enforceAuth = middleware(async (opts) => {
  return opts.next({
    ctx: opts.ctx,
  });
});

/**
 * Creates a middleware that enforces a specific permission.
 *
 * Uses the existing `can()` function from RBAC, which returns
 * true for null users (dev mode).
 *
 * @param perm - Permission key to enforce (e.g., 'hello.read')
 */
export function requirePerm(perm: string) {
  return middleware(async (opts) => {
    if (!can(opts.ctx.user, perm)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing permission: ${perm}`,
      });
    }

    return opts.next({ ctx: opts.ctx });
  });
}
