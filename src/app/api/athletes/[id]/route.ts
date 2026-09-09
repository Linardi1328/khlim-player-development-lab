import { requireViewer } from "@/lib/auth";
import { getAthlete, saveProfile } from "@/lib/service";
import { checkOrigin, jsonBody, response } from "@/lib/http";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  return response(async () =>
    getAthlete(await requireViewer(), (await context.params).id),
  );
}
export async function PATCH(request: Request, context: Context) {
  return response(async () => {
    checkOrigin(request);
    return saveProfile(
      await requireViewer(),
      await jsonBody(request),
      (await context.params).id,
    );
  });
}
