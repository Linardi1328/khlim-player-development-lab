import { signOut } from "@/lib/auth";
import { checkOrigin, response } from "@/lib/http";
export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    await signOut();
    return { ok: true };
  });
}
