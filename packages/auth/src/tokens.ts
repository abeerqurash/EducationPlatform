import {
  createHash,
  randomBytes,
} from "node:crypto";

export function createSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function createExpiringToken(
  lifetimeMinutes: number,
) {
  const token = createSecureToken();

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() +
      lifetimeMinutes * 60 * 1000,
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
}