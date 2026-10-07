import {
  createExpiringToken,
  hashPassword,
  registerSchema,
} from "@education/auth";

import {
  db,
  emailVerificationTokens,
  users,
} from "@education/database";

import { eq } from "drizzle-orm";

export async function registerUser(
  input: unknown,
) {
  const parsed =
    registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: "INVALID_INPUT",
      issues:
        parsed.error.flatten(),
    };
  }

  const {
    name,
    email,
    password,
  } = parsed.data;

  const [existing] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return {
      success: false as const,
      error: "ACCOUNT_EXISTS",
    };
  }

  const passwordHash =
    await hashPassword(password);

  const verification =
    createExpiringToken(
      24 * 60,
    );

  const result =
    await db.transaction(
      async (transaction) => {
        const [user] =
          await transaction
            .insert(users)
            .values({
              name,
              email,
              passwordHash,
              role: "student",
              isActive: true,
            })
            .returning({
              id: users.id,
              email: users.email,
            });

        if (!user) {
          throw new Error(
            "User creation failed.",
          );
        }

        await transaction
          .insert(
            emailVerificationTokens,
          )
          .values({
            userId: user.id,
            tokenHash:
              verification.tokenHash,
            expiresAt:
              verification.expiresAt,
          });

        return user;
      },
    );

  return {
    success: true as const,

    user: result,

    // Development only.
    // Remove once the email provider is connected.
    verificationToken:
      process.env.NODE_ENV ===
      "development"
        ? verification.token
        : undefined,
  };
}