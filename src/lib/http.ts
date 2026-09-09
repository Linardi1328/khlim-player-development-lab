import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./access";
export function checkOrigin(request: Request) {
  const expected = new URL(process.env.APP_URL ?? "http://127.0.0.1:3000")
    .origin;
  if (request.headers.get("origin") !== expected)
    throw new AppError(
      403,
      "This request could not be verified. Refresh the page and try again.",
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new AppError(415, "Expected JSON.");
}
export async function jsonBody(request: Request) {
  const text = await request.text();
  if (text.length > 32_000) throw new AppError(413, "This entry is too large.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AppError(400, "Invalid JSON.");
  }
}
export async function response(work: () => Promise<unknown>, status = 200) {
  try {
    return NextResponse.json(await work(), {
      status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          error: "Check the highlighted fields.",
          fields: Object.fromEntries(
            error.issues.map((i) => [i.path[0], i.message]),
          ),
        },
        { status: 422 },
      );
    if (error instanceof AppError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    console.error(
      "Lab request failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      { error: "We couldn’t save or load this information. Please try again." },
      { status: 500 },
    );
  }
}
