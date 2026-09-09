import { requireViewer } from "@/lib/auth";
import { getRoster, saveProfile } from "@/lib/service";
import { checkOrigin, jsonBody, response } from "@/lib/http";
export async function GET(request: Request) {
  return response(async () => {
    const params = new URL(request.url).searchParams;
    return getRoster(
      await requireViewer(),
      params.get("search") ?? "",
      params.get("group") ?? "",
    );
  });
}
export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    return saveProfile(await requireViewer(), await jsonBody(request));
  }, 201);
}
