import { NextResponse } from "next/server";
import { getAuthenticatedDiscordUser } from "@/lib/discord-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SIGNED_URL_TTL_SECONDS = 60;

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedDiscordUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Sign in with Discord to download the client." },
        { status: 401 }
      );
    }

    const bucket = process.env.CLIENT_DOWNLOAD_BUCKET;
    const filePath = process.env.CLIENT_DOWNLOAD_STORAGE_PATH;
    if (!bucket || !filePath) {
      console.error("Client download bucket or storage path is not configured.");
      return NextResponse.json(
        { error: "The client download is not configured. Please contact staff." },
        { status: 503 }
      );
    }
    const downloadFileName = filePath.split("/").filter(Boolean).at(-1);
    if (!downloadFileName) {
      console.error("Client download storage path does not include a file name.");
      return NextResponse.json(
        { error: "The client download is not configured. Please contact staff." },
        { status: 503 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: licenses, error: licenseError } = await supabaseAdmin
      .from("esm_licenses")
      .select("expires_at, is_banned")
      .eq("discord_id", user.id)
      .eq("is_banned", false);

    if (licenseError) {
      console.error("Failed to verify client download entitlement:", licenseError);
      return NextResponse.json(
        { error: "Unable to verify your license right now. Please try again." },
        { status: 500 }
      );
    }

    const now = Date.now();
    const hasActiveLicense = (licenses || []).some((license) => {
      if (license.is_banned) return false;
      if (!license.expires_at) return true;
      const expiresAt = Date.parse(license.expires_at);
      return Number.isFinite(expiresAt) && expiresAt > now;
    });

    if (!hasActiveLicense) {
      return NextResponse.json(
        { error: "An active, approved license is required to download the client." },
        { status: 403 }
      );
    }

    const { data, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS, {
        download: downloadFileName,
      });

    if (signedUrlError || !data?.signedUrl) {
      console.error("Failed to create private client download URL:", signedUrlError);
      return NextResponse.json(
        { error: "The client package is unavailable right now. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { url: data.signedUrl },
      { headers: { "Cache-Control": "no-store, private" } }
    );
  } catch (error) {
    console.error("Client download request failed:", error);
    return NextResponse.json(
      { error: "Unable to start the download. Please try again later." },
      { status: 500 }
    );
  }
}
