import { z } from "zod";

export const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(320);

export const passwordSchema = z
  .string()
  .min(
    12,
    "Password must contain at least 12 characters.",
  )
  .max(
    128,
    "Password must not exceed 128 characters.",
  )
  .refine(
    (value) => /[a-z]/.test(value),
    "Password must contain a lowercase letter.",
  )
  .refine(
    (value) => /[A-Z]/.test(value),
    "Password must contain an uppercase letter.",
  )
  .refine(
    (value) => /\d/.test(value),
    "Password must contain a number.",
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(150),

    email: normalizedEmailSchema,

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(
    (value) =>
      value.password ===
      value.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    },
  );

export const loginSchema = z.object({
  email: normalizedEmailSchema,

  password: z
    .string()
    .min(1)
    .max(128),
});

export const forgotPasswordSchema =
  z.object({
    email: normalizedEmailSchema,
  });

export const resetPasswordSchema =
  z
    .object({
      token: z.string().min(32),
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine(
      (value) =>
        value.password ===
        value.confirmPassword,
      {
        path: ["confirmPassword"],
        message:
          "Passwords do not match.",
      },
    );

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;