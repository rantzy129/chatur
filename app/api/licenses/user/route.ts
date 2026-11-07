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
      .select("id, license_key, tier, hwid, expires_at, is_banned, created_at")
      .eq("discord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Licenses fetch error:", error);
      return NextResponse.json({ error: "Failed to load licenses." }, { status: 500 });
    }

    return NextResponse.json({ licenses: licenses || [] });
  } catch (err: any) {
    console.error("Licenses request error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
