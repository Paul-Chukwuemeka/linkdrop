import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { fetchOgMetadata } from "@/lib/og";
import { ogFetchSchema } from "@/lib/validations/links";
import {
  UnauthorizedError,
  errorResponse,
  readJsonBody,
} from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    await requireAuth();

    const body = await readJsonBody(request);
    if (body === null) return errorResponse("Invalid JSON body", 400);

    const parsed = ogFetchSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const metadata = await fetchOgMetadata(parsed.data.url);
    return NextResponse.json(metadata);
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return errorResponse("Not authenticated", 401);
    }
    // Metadata fetching is best-effort: report the failure as a non-fatal
    // 422 so the client can silently skip showing a suggestion.
    const message =
      e instanceof Error && e.message ? e.message : "Could not fetch link metadata";
    return errorResponse(message, 422);
  }
}