import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { LogaCoreAuthConfig } from './types';

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
      jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.permissions = (user as any).permissions ?? [];
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
