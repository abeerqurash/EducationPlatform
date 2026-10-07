import {
  hash,
  verify,
  argon2id,
} from "argon2";

const PASSWORD_HASH_OPTIONS = {
  type: argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export async function hashPassword(
  password: string,
): Promise<string> {
  return hash(
    password,
    PASSWORD_HASH_OPTIONS,
  );
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await verify(
      passwordHash,
      password,
    );
  } catch {
    return false;
  }
}