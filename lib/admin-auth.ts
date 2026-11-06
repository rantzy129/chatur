import "server-only";
import crypto from "crypto";
import { NextResponse } from "next/server";

/**
 * Constant-time string comparison to defend against timing attacks on authentication secrets.
 */
function timingSafeEqual(a: string | null | undefined, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function getAdminAuthResponse(req: Request): NextResponse | null {
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Admin authentication is not configured" },
      { status: 500 }
    );
  }

  const providedSecret = req.headers.get("x-admin-secret");
  if (!providedSecret || !timingSafeEqual(providedSecret, adminSecret)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  return null;
}
