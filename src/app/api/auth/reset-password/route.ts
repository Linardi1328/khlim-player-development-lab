import { z } from "zod";
import { AppError } from "@/lib/access";
import { authProvider } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkOrigin, jsonBody, response } from "@/lib/http";
import { readLabResetEmail, verifyLabResetToken } from "@/lib/lab-reset";
import { digest, hashPassword } from "@/lib/security";

const schema = z.object({
  token: z.string().min(20).max(2000),
  password: z.string().min(10, "Use at least 10 characters.").max(128),
});

export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    if (authProvider() !== "lab")
      throw new AppError(
        501,
        "Password recovery for the external sign-in provider is not enabled in this lab.",
      );
    const { token, password } = schema.parse(await jsonBody(request));
    const email = readLabResetEmail(token);
    const user = await db.user.findUnique({ where: { email } });
    if (!user?.passwordHash)
      throw new AppError(400, "This reset link is invalid or expired.");
    verifyLabResetToken(token, user.passwordHash);
    const passwordHash = await hashPassword(password);
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { passwordHash } }),
      db.session.deleteMany({ where: { userId: user.id } }),
      db.loginThrottle.deleteMany({ where: { key: digest(email) } }),
    ]);
    return { ok: true };
  });
}
