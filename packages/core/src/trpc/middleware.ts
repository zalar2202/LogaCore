import { TRPCError } from '@trpc/server';
import { middleware } from './init';
import { can } from '../rbac/can';

/**
 * Middleware that enforces the user is authenticated.
 *
 * Rejects unauthenticated requests (user === null) with
 * an UNAUTHORIZED error. All protected procedures should
 * use this middleware.
 */
export const enforceAuth = middleware(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to access this resource.',
    });
  }

  return opts.next({
    ctx: { ...opts.ctx, user: opts.ctx.user },
  });
});

/**
 * Creates a middleware that enforces a specific permission.
 *
 * Should be chained after `enforceAuth` so the user is
 * guaranteed to be non-null.
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
