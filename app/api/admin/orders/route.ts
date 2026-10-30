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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
