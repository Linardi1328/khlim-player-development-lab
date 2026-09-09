import { signIn, requireViewer } from "@/lib/auth";
import { loginSchema } from "@/lib/domain";
import { checkOrigin, jsonBody, response } from "@/lib/http";
export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    const { email, password } = loginSchema.parse(await jsonBody(request));
    await signIn(email, password);
    const viewer = await requireViewer();
    return {
      redirect:
        viewer.role === "COACH"
          ? "/dashboard"
          : `/athletes/${viewer.athleteId}`,
    };
  });
}
