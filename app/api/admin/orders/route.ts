import { NextResponse } from "next/server";
import { getAdminAuthResponse } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const { data: orders, error } = await getSupabaseAdmin()
      .from("esm_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin orders fetch error:", error);
      return NextResponse.json({ error: "Failed to retrieve orders." }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    console.error("Admin orders error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
