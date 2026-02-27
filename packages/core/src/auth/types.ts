import type { User } from '../types/user';

/**
 * Configuration for the core auth wrapper.
 * Apps pass this to `createAuth()` to configure providers.
 */
export interface LogaCoreAuthConfig {
  providers: any[];
  db: unknown;
  schema: {
    users: any;
    accounts: any;
    verificationTokens: any;
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
  };
}

/**
 * Shape of user data from Auth.js session.
 */
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  permissions?: string[];
}

/**
 * Maps an Auth.js session user to the LogaCore User type.
 * Returns null if no session user (unauthenticated).
 */
export function toLogaCoreUser(
  sessionUser: SessionUser | undefined
): User | null {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    name: sessionUser.name ?? undefined,
    email: sessionUser.email ?? undefined,
    permissions: sessionUser.permissions ?? [],
  };
}
