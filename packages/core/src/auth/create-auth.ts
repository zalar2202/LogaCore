import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { LogaCoreAuthConfig } from './types';
import { resolveUserPermissions } from '../rbac/resolver';

/**
 * Creates the Auth.js instance with LogaCore defaults.
 *
 * Core wraps Auth.js so plugins/apps never import next-auth directly.
 * This enables future replacement without breaking plugins.
 */
export function createAuth(config: LogaCoreAuthConfig) {
  return NextAuth({
    adapter: DrizzleAdapter(config.db as any, {
      usersTable: config.schema.users,
      accountsTable: config.schema.accounts,
      verificationTokensTable: config.schema.verificationTokens,
    }),
    session: {
      strategy: 'jwt',
    },
    providers: config.providers,
    pages: config.pages ?? {
      signIn: '/auth/signin',
    },
    callbacks: {
      async jwt({ token, user, trigger }) {
        if (user) {
          token.id = user.id;
        }

        // Only resolve permissions on initial login or explicit session refresh.
        // On every other request, use the cached permissions already in the JWT.
        // This prevents hammering the database on every single page load.
        const shouldResolvePerms =
          user ||                    // Initial login
          trigger === 'update' ||    // Explicit session refresh (e.g., role change)
          !token.permissions;        // First time (no cached perms yet)

        if (token.id && shouldResolvePerms) {
          token.permissions = await resolveUserPermissions(config.db, token.id as string);
        }

        return token;
      },
      session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          (session.user as any).permissions =
            (token.permissions as string[]) ?? [];
        }
        return session;
      },
      authorized({ auth, request }) {
        const isAdminRoute =
          request.nextUrl.pathname.startsWith('/admin');
        if (isAdminRoute && !auth) {
          return false;
        }
        return true;
      },
    },
  });
}
