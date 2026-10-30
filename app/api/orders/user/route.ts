import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discord_id");

    if (!discordId) {
      return NextResponse.json({ error: "Missing discord_id" }, { status: 400 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from("esm_orders")
      .select("*")
      .eq("discord_id", discordId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
