import { NextResponse } from "next/server";
import { getAdminAuthResponse } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const { data: settings, error } = await getSupabaseAdmin()
      .from("esm_settings")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (error) {
      return NextResponse.json({
        settings: {
          id: "global",
          min_client_version: "1.0.0",
          latest_client_version: "1.0.0",
          download_url: "https://discord.gg/Whwxq9QAEN",
          peace_cleaner_min_version: "1.0.1",
          peace_cleaner_latest_version: "1.0.1",
          peace_cleaner_download_url: "https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe",
          enforce_version_check: true,
          table_exists: false,
          error: error.message,
        },
      });
    }

    return NextResponse.json({
      settings: settings || {
        id: "global",
        min_client_version: "1.0.0",
        latest_client_version: "1.0.0",
        download_url: "https://discord.gg/Whwxq9QAEN",
        peace_cleaner_min_version: "1.0.1",
        peace_cleaner_latest_version: "1.0.1",
        peace_cleaner_download_url: "https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe",
        enforce_version_check: true,
        table_exists: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const body = await req.json();
    const {
      min_client_version,
      latest_client_version,
      download_url,
      peace_cleaner_min_version,
      peace_cleaner_latest_version,
      peace_cleaner_download_url,
      enforce_version_check
    } = body;

    const payload = {
      id: "global",
      min_client_version: String(min_client_version || "1.0.0").trim(),
      latest_client_version: String(latest_client_version || "1.0.0").trim(),
      download_url: String(download_url || "").trim(),
      peace_cleaner_min_version: String(peace_cleaner_min_version || "1.0.1").trim(),
      peace_cleaner_latest_version: String(peace_cleaner_latest_version || "1.0.1").trim(),
      peace_cleaner_download_url: String(peace_cleaner_download_url || "https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe").trim(),
      enforce_version_check: Boolean(enforce_version_check),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabaseAdmin()
      .from("esm_settings")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: "Please run schema_settings.sql in your Supabase SQL editor to enable the esm_settings table.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

