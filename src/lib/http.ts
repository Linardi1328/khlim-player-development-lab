import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./access";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = firstHeaderValue(request.headers.get("host"));
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const forwardedProto = firstHeaderValue(
    request.headers.get("x-forwarded-proto"),
  );

  let originUrl: URL | null = null;
  try {
    originUrl = origin ? new URL(origin) : null;
  } catch {
    originUrl = null;
  }

  const allowedHosts = [forwardedHost, host].filter(
    (value): value is string => Boolean(value),
  );
  const protocolMatches =
    originUrl !== null &&
    (forwardedProto
      ? originUrl.protocol === `${forwardedProto}:`
      : originUrl.protocol === new URL(request.url).protocol);
  const hostMatches =
    originUrl !== null && allowedHosts.includes(originUrl.host);

  if (!originUrl || !protocolMatches || !hostMatches)
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
