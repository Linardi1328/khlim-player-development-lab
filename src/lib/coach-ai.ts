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

export async function generateCoachDraft(args: {
  target: CoachDraftTarget;
  language: Locale;
  context: Record<string, string>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    throw new AppError(
      503,
      "AI drafting is not configured. Add OPENAI_API_KEY to the local .env file.",
    );

  const prompt = buildCoachDraftPrompt(args);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
        instructions: prompt.instructions,
        input: prompt.input,
        max_output_tokens: 300,
        store: false,
      }),
    });
    if (!response.ok) {
      console.error("OpenAI draft request failed", response.status);
      throw new AppError(
        502,
        "AI drafting could not complete. Please try again.",
      );
    }
    const payload = (await response.json()) as ResponsesPayload;
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
