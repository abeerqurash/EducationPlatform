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

import { eq } from "drizzle-orm";

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

        await db
          .update(users)
          .set({
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
      }

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
      }

      return session;
    },
  },
});