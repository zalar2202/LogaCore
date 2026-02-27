import type { TRPCContext } from '@logacore/core/trpc';
import { auth } from '@/lib/auth';
import { toLogaCoreUser } from '@logacore/core/auth';
import type { SessionUser } from '@logacore/core/auth';
import { db } from '@logacore/db';

/**
 * Creates the tRPC context for each request.
 *
 * Resolves the authenticated user from the Auth.js session
 * and injects the database client.
 */
export async function createContext(): Promise<TRPCContext> {
  const session = await auth();
  const user = toLogaCoreUser(session?.user as SessionUser | undefined);

  return {
    user,
    db,
  };
}
