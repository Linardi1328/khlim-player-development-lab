import { requireViewer } from "@/lib/auth";
import { updateGoal } from "@/lib/service";
import { checkOrigin, jsonBody, response } from "@/lib/http";
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return response(async () => {
    checkOrigin(request);
    return updateGoal(
      await requireViewer(),
      (await context.params).id,
      await jsonBody(request),
    );
  });
}
