import { requireViewer } from "@/lib/auth";
import { createRecord } from "@/lib/service";
import { checkOrigin, jsonBody, response } from "@/lib/http";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; kind: string }> },
) {
  return response(async () => {
    checkOrigin(request);
    const { id, kind } = await context.params;
    return createRecord(
      await requireViewer(),
      id,
      kind,
      await jsonBody(request),
    );
  }, 201);
}
