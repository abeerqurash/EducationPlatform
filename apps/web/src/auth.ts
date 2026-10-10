import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
  loginSchema,
  verifyPassword,
} from "@education/auth";

import {
  db,
  users,
} from "@education/database";

import { and, eq } from "drizzle-orm";
import { validateAccountSession } from '@education/database/account-security';
import { takeRateLimit } from '../../../packages/database/src/account-security/rate-limit';
import { mailSettings } from '../../../packages/database/src/account-security/mail/config';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt",

    maxAge: 30 * 24 * 60 * 60,

    updateAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed =
          loginSchema.safeParse(
            credentials,
          );

        if (!parsed.success) {
          return null;
        }
        try { await takeRateLimit('login', parsed.data.email, mailSettings().secret, 10, 15); } catch { return null; }

        const [user] = await db
          .select()
          .from(users)
          .where(
            eq(
              users.email,
              parsed.data.email,
            ),
          )
          .limit(1);

        if (
          !user ||
          !user.isActive ||
          !user.passwordHash
        ) {
          return null;
        }

        const valid =
          await verifyPassword(
            user.passwordHash,
            parsed.data.password,
          );

        if (!valid) {
          return null;
        }

        const [signedIn] = await db
          .update(users)
          .set({
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(and(eq(users.id, user.id), eq(users.passwordHash, user.passwordHash), eq(users.authVersion, user.authVersion), eq(users.isActive, true)))
          .returning({ authVersion: users.authVersion });
        if (!signedIn) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          authVersion: signedIn.authVersion,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user?.id) {
        token.userId = user.id;
        token.authVersion = user.authVersion;
      }
      try { if (!await validateAccountSession(token.userId, token.authVersion)) return null; } catch { return null; }
      return token;
    },

    async session({
      session,
      token,
    }) {
      if (
        session.user &&
        typeof token.userId ===
          "string"
      ) {
        session.user.id =
          token.userId;
        session.user.authVersion = typeof token.authVersion === 'number' ? token.authVersion : -1;
      }

      return session;
    },
  },
});
