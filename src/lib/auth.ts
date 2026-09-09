import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { db } from "./db";
import { AppError, type Viewer } from "./access";
import { digest, sessionToken, verifyPassword } from "./security";
const cookieName = "khlim_lab_session";
const duration = 8 * 60 * 60;
export const authProvider = () => process.env.AUTH_PROVIDER ?? "lab";
async function supabase() {
  const jar = await cookies();
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY)
    throw new AppError(503, "Sign-in provider is not configured.");
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {
            /* Server Components cannot write refreshed cookies; route handlers can. */
          }
        },
      },
    },
  );
}
export async function getViewer(): Promise<Viewer | null> {
  let user;
  if (authProvider() === "supabase") {
    const client = await supabase();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    user = await db.user.findUnique({
      where: { externalAuthId: data.user.id },
      include: { athlete: true },
    });
  } else if (authProvider() === "lab") {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const session = await db.session.findUnique({
      where: { id: digest(token) },
      include: { user: { include: { athlete: true } } },
    });
    if (!session || session.expiresAt <= new Date()) return null;
    user = session.user;
  } else throw new AppError(503, "Unknown sign-in provider.");
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    athleteId: user.athlete?.id ?? null,
  };
}
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) throw new AppError(401, "Please sign in to continue.");
  return viewer;
}
export async function pageViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}
export async function signIn(email: string, password: string) {
  const key = digest(email);
  // Atomically count attempts. The same generic response is used for unknown accounts.
  await db.loginThrottle.deleteMany({
    where: { key, resetAt: { lte: new Date() } },
  });
  const throttle = await db.loginThrottle.upsert({
    where: { key },
    create: { key, resetAt: new Date(Date.now() + 15 * 60_000) },
    update: { attempts: { increment: 1 } },
  });
  if (throttle.attempts > 10)
    throw new AppError(
      429,
      "Too many attempts. Please try again in 15 minutes.",
    );
  if (authProvider() === "supabase") {
    const client = await supabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user)
      throw new AppError(401, "Email or password is incorrect.");
    const mapped = await db.user.findUnique({
      where: { externalAuthId: data.user.id },
    });
    if (!mapped) {
      await client.auth.signOut();
      throw new AppError(403, "This account has no lab access.");
    }
  } else if (authProvider() === "lab") {
    const user = await db.user.findUnique({ where: { email } });
    const dummy = `${"0".repeat(32)}:${"0".repeat(128)}`;
    const valid = await verifyPassword(password, user?.passwordHash ?? dummy);
    if (!user || !valid)
      throw new AppError(401, "Email or password is incorrect.");
    const token = sessionToken();
    const jar = await cookies();
    const oldToken = jar.get(cookieName)?.value;
    if (oldToken)
      await db.session.deleteMany({ where: { id: digest(oldToken) } });
    await db.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    await db.session.create({
      data: {
        id: digest(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + duration * 1000),
      },
    });
    jar.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: (process.env.APP_URL ?? "").startsWith("https://"),
      path: "/",
      maxAge: duration,
    });
  } else throw new AppError(503, "Unknown sign-in provider.");
  await db.loginThrottle.deleteMany({ where: { key } });
}
export async function signOut() {
  if (authProvider() === "supabase") {
    const client = await supabase();
    await client.auth.signOut();
  }
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await db.session.deleteMany({ where: { id: digest(token) } });
  jar.delete(cookieName);
}
