import { AppError } from "./access";
import type { Locale } from "./i18n";

export type CoachDraftTarget = "focus" | "assessmentNotes" | "practicePlan";

const languageName: Record<Locale, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  "zh-CN": "Simplified Chinese",
};

const allowedKeys: Record<CoachDraftTarget, string[]> = {
  focus: ["name", "group", "position", "focus"],
  assessmentNotes: [
    "assessedAt",
    "shooting",
    "finishing",
    "ballHandling",
    "passing",
    "defense",
    "rebounding",
    "athleticism",
    "notes",
  ],
  practicePlan: ["title", "dueDate", "target", "status", "description"],
};

const targetInstructions: Record<CoachDraftTarget, string> = {
  focus:
    "Write one or two short sentences describing a clear, encouraging current development focus. Keep it under 220 characters.",
  assessmentNotes:
    "Write 2–4 concise coaching sentences. Summarize the strongest observed areas, identify no more than two next practice priorities, and keep the tone developmental rather than judgmental.",
  practicePlan:
    "Write a short, practical practice plan in 3–5 concise lines. Make the actions observable and directly connected to the stated goal and success target.",
};

function sanitizeContext(
  target: CoachDraftTarget,
  context: Record<string, string>,
) {
  return Object.fromEntries(
    allowedKeys[target]
      .filter((key) => typeof context[key] === "string")
      .map((key) => [key, context[key].slice(0, 600)]),
  );
}

export function buildCoachDraftPrompt({
  target,
  language,
  context,
}: {
  target: CoachDraftTarget;
  language: Locale;
  context: Record<string, string>;
}) {
  const safeContext = sanitizeContext(target, context);
  return {
    instructions: [
      "You are a basketball coach documentation assistant inside an experimental youth player-development lab.",
      "Use only the supplied form context. Never invent observations, measurements, diagnoses, injuries, medical facts, personality traits, or private information.",
      "Do not rank the athlete against other athletes. Avoid scouting, recruitment, selection, or talent-prediction language.",
      "Use supportive, age-appropriate coaching language.",
      `Write in ${languageName[language]}.`,
      targetInstructions[target],
      "Return only the draft text that should be placed in the form field. Do not add a heading, explanation, quotation marks, or markdown.",
    ].join(" "),
    input: JSON.stringify(safeContext),
  };
}

type ResponsesPayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

type OpenAIErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    param?: string | null;
    code?: string | null;
  };
};

function responseText(payload: ResponsesPayload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && item.text)
      .map((item) => item.text)
      .join("\n") ?? ""
  );
}

export function coachAIErrorMessage(
  status: number,
  payload: OpenAIErrorPayload = {},
) {
  const detail = payload.error?.message?.toLowerCase() ?? "";
  const param = payload.error?.param?.toLowerCase() ?? "";

  if (status === 401)
    return "OpenAI rejected the API key. Check OPENAI_API_KEY in the local .env file and restart the app.";
  if (status === 403)
    return "This OpenAI API project is not allowed to use the configured AI model.";
  if (status === 429)
    return "OpenAI API quota or rate limit was reached. Check API billing and usage, then try again.";
  if (
    status === 404 ||
    detail.includes("model") ||
    param === "model" ||
    payload.error?.code === "model_not_found"
  )
    return "The configured OpenAI model is not available to this API project. Check OPENAI_MODEL and model access.";
  if (status === 400)
    return "OpenAI rejected the AI request configuration. Check the Terminal log for the safe API error details.";

  return "AI drafting could not complete. Please try again.";
}

export async function generateCoachDraft(args: {
  target: CoachDraftTarget;
  language: Locale;
  context: Record<string, string>;
}) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey)
    throw new AppError(
      503,
      "AI drafting is not configured. Add OPENAI_API_KEY to the local .env file.",
    );

  const model = (process.env.OPENAI_MODEL ?? "gpt-5.6-luna").trim();
  const prompt = buildCoachDraftPrompt(args);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        instructions: prompt.instructions,
        input: prompt.input,
        reasoning: { effort: "low" },
        max_output_tokens: 1200,
        store: false,
      }),
    });
    if (!openAIResponse.ok) {
      let payload: OpenAIErrorPayload = {};
      try {
        payload = (await openAIResponse.json()) as OpenAIErrorPayload;
      } catch {
        payload = {};
      }
      console.error("OpenAI draft request failed", {
        status: openAIResponse.status,
        model,
        type: payload.error?.type ?? null,
        code: payload.error?.code ?? null,
        param: payload.error?.param ?? null,
        message: payload.error?.message ?? null,
      });
      throw new AppError(
        502,
        coachAIErrorMessage(openAIResponse.status, payload),
      );
    }
    const payload = (await openAIResponse.json()) as ResponsesPayload;
    const draft = responseText(payload).trim();
    if (!draft)
      throw new AppError(
        502,
        "AI drafting returned an empty suggestion. Please try again.",
      );
    return draft.slice(0, args.target === "focus" ? 240 : 2000);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.name === "AbortError")
      throw new AppError(504, "AI drafting took too long. Please try again.");
    throw new AppError(
      502,
      "AI drafting could not complete. Please try again.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
