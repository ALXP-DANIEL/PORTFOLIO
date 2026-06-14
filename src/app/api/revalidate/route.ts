import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { GITHUB_SYNC_TAG } from "@/lib/github";

/**
 * Manual refresh — GET /api/revalidate (the "press R on /work" path).
 * Public: busts the github-sync cache so the next render re-fetches from GitHub.
 */
export async function GET() {
  revalidateTag(GITHUB_SYNC_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: GITHUB_SYNC_TAG });
}
