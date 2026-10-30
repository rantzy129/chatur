import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedDiscordUser } from "@/lib/discord-auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedDiscordUser(req);
    if (!user) {
      return NextResponse.json({ error: "Discord sign-in is required." }, { status: 401 });
    }

    // Query licenses linked to this user's discord_id in esm_licenses
    const { data: licenses, error } = await getSupabaseAdmin()
      .from("esm_licenses")
      .select("*")
      .eq("discord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ licenses: licenses || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
