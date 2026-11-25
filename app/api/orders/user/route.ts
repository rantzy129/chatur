import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedDiscordUser } from "@/lib/discord-auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedDiscordUser(req);
    if (!user) {
      return NextResponse.json({ error: "Discord sign-in is required." }, { status: 401 });
    }

    const { data: orders, error } = await getSupabaseAdmin()
      .from("esm_orders")
      .select("id, order_number, tier, amount, reference_number, status, license_key, created_at")
      .eq("discord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    console.error("Orders request error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
