import { createAuth } from '@logacore/core/auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db, schema } from '@logacore/db';
import bcrypt from 'bcryptjs';

const providers: any[] = [
    Credentials({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            const email = credentials?.email as string | undefined;
            const password = credentials?.password as string | undefined;
            if (!email || !password) return null;

            const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, email),
            });

            if (!user?.passwordHash) return null;

            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) return null;

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                permissions: user.permissions ?? [],
            };
        },
    }),
];

// Optional Google provider — only active when env vars are set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const { handlers, auth, signIn, signOut } = createAuth({
    providers,
    db,
    pages: {
        signIn: '/auth/signin',
    },
    schema: {
        users: schema.users,
        accounts: schema.accounts,
        verificationTokens: schema.verificationTokens,
    },
});
