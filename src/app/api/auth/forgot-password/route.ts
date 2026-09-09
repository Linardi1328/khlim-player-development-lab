import { z } from "zod";
import { AppError } from "@/lib/access";
import { authProvider } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkOrigin, jsonBody, response } from "@/lib/http";
import { createLabResetToken } from "@/lib/lab-reset";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254) });

export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    if (authProvider() !== "lab") throw new AppError(501, "Password recovery for the external sign-in provider is not enabled in this lab.");
    const { email } = schema.parse(await jsonBody(request));
    const user = await db.user.findUnique({ where: { email } });
    if (!user?.passwordHash) return { message: "If that lab account exists, a reset option will be available." };
    const token = createLabResetToken(email, user.passwordHash);
    return {
      message: "This local lab does not send email. Use the temporary reset link below.",
      resetUrl: `/reset-password?token=${encodeURIComponent(token)}`,
    };
  });
}
