import { z } from "zod";
import { assertCoach } from "@/lib/access";
import { requireViewer } from "@/lib/auth";
import { generateCoachDraft } from "@/lib/coach-ai";
import { checkOrigin, jsonBody, response } from "@/lib/http";
import { normalizeLocale } from "@/lib/i18n";

const schema = z.object({
  target: z.enum(["focus", "assessmentNotes", "practicePlan"]),
  language: z.string().max(12),
  context: z.record(z.string(), z.string().max(600)),
});

export async function POST(request: Request) {
  return response(async () => {
    checkOrigin(request);
    const viewer = await requireViewer();
    assertCoach(viewer);
    const body = schema.parse(await jsonBody(request));
    const draft = await generateCoachDraft({ target: body.target, language: normalizeLocale(body.language), context: body.context });
    return { draft };
  });
}
