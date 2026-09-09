import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "./access";

const resetDurationMs = 15 * 60_000;
type ResetPayload = { email: string; exp: number };

function resetSecret() {
  const configured = process.env.LAB_RESET_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production")
    return "khlim-player-lab-local-reset-only";
  throw new AppError(503, "Password reset is not configured.");
}

function signature(payload: string, passwordHash: string) {
  return createHmac("sha256", `${resetSecret()}:${passwordHash}`)
    .update(payload)
    .digest("base64url");
}

function parsePayload(token: string): {
  encoded: string;
  signature: string;
  payload: ResetPayload;
} {
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature)
    throw new AppError(400, "This reset link is invalid or expired.");
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as ResetPayload;
    if (
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now()
    )
      throw new Error();
    return { encoded, signature: suppliedSignature, payload };
  } catch {
    throw new AppError(400, "This reset link is invalid or expired.");
  }
}

export function createLabResetToken(email: string, passwordHash: string) {
  const payload: ResetPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + resetDurationMs,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded, passwordHash)}`;
}

export function readLabResetEmail(token: string) {
  return parsePayload(token).payload.email;
}

export function verifyLabResetToken(token: string, passwordHash: string) {
  const parsed = parsePayload(token);
  const expected = signature(parsed.encoded, passwordHash);
  const suppliedBuffer = Buffer.from(parsed.signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  )
    throw new AppError(400, "This reset link is invalid or expired.");
  return parsed.payload.email;
}
