import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { GITHUB_SYNC_TAG } from "@/lib/github";

/**
 * GitHub push webhook → on-demand cache invalidation.
 *
 * Point a repo (or org) webhook at POST /api/revalidate with content type
 * application/json and the secret set to GITHUB_WEBHOOK_SECRET. Any push then
 * busts every GitHub-sourced fetch via the shared `github-sync` tag.
 */
export async function POST(request: NextRequest) {
  const secret = env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-hub-signature-256");
  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "Missing signature" },
      { status: 401 },
    );
  }

  const body = await request.text();
  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")}`;

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 },
    );
  }

  // Webhook from an external system → expire immediately (per Next docs).
  revalidateTag(GITHUB_SYNC_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: GITHUB_SYNC_TAG });
}
