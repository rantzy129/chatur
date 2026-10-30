import { NextResponse } from "next/server";

export function getAdminAuthResponse(req: Request): NextResponse | null {
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Admin authentication is not configured" },
      { status: 500 }
    );
  }

  if (req.headers.get("x-admin-secret") !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  return null;
}
