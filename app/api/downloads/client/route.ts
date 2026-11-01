import { NextResponse } from "next/server";
import { getAuthenticatedDiscordUser } from "@/lib/discord-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SIGNED_URL_TTL_SECONDS = 60;

interface LicenseRow {
  license_key: string;
  tier: string;
  expires_at: string | null;
  is_banned: boolean;
}

function isLicenseActive(license: LicenseRow) {
  if (license.is_banned) return false;
  if (!license.expires_at) return true;
  const expiresAt = Date.parse(license.expires_at);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function isPeaceCleanerLicense(license: LicenseRow) {
  const key = (license.license_key || "").toUpperCase();
  const tier = (license.tier || "").toLowerCase();
  return key.startsWith("PC-") || tier.includes("peace") || tier.includes("cleaner");
}

function isEsmiringhoyLicense(license: LicenseRow) {
  const key = (license.license_key || "").toUpperCase();
  const tier = (license.tier || "").toLowerCase();
  return key.startsWith("ESM-") || (!key.startsWith("PC-") && !tier.includes("peace") && !tier.includes("cleaner"));
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedDiscordUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Sign in with Discord to download the client." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedProduct = (searchParams.get("product") || "").toUpperCase(); // "PC" | "ESM" | ""

    const supabaseAdmin = getSupabaseAdmin();
    const { data: licenses, error: licenseError } = await supabaseAdmin
      .from("esm_licenses")
      .select("license_key, tier, expires_at, is_banned")
      .eq("discord_id", user.id)
      .eq("is_banned", false);

    if (licenseError) {
      console.error("Failed to verify client download entitlement:", licenseError);
      return NextResponse.json(
        { error: "Unable to verify your license right now. Please try again." },
        { status: 500 }
      );
    }

    const activeLicenses = (licenses || []).filter(isLicenseActive);
    if (activeLicenses.length === 0) {
      return NextResponse.json(
        { error: "An active, approved license is required to download software." },
        { status: 403 }
      );
    }

    // Determine target product based on query or owned active licenses
    let targetProduct: "PC" | "ESM" = "ESM";
    if (requestedProduct === "PC") {
      targetProduct = "PC";
    } else if (requestedProduct === "ESM") {
      targetProduct = "ESM";
    } else {
      // Default: if user has active PC license and no ESM, choose PC
      const hasPc = activeLicenses.some(isPeaceCleanerLicense);
      const hasEsm = activeLicenses.some(isEsmiringhoyLicense);
      if (hasPc && !hasEsm) targetProduct = "PC";
      else targetProduct = "ESM";
    }

    // Entitlement verification for requested product
    if (targetProduct === "PC") {
      const hasActivePc = activeLicenses.some(isPeaceCleanerLicense);
      if (!hasActivePc) {
        return NextResponse.json(
          { error: "An active Peace Cleaner license is required to download this package." },
          { status: 403 }
        );
      }
    } else {
      const hasActiveEsm = activeLicenses.some(isEsmiringhoyLicense);
      if (!hasActiveEsm) {
        return NextResponse.json(
          { error: "An active Esmiringhoy license is required to download this package." },
          { status: 403 }
        );
      }
    }

    // Resolve Supabase Storage bucket & candidate file paths
    const bucket = process.env.CLIENT_DOWNLOAD_BUCKET || "subscriber-downloads";
    const candidatePaths =
      targetProduct === "PC"
        ? [
            process.env.PEACE_CLEANER_STORAGE_PATH,
            "peacecleaner.rar",
            "PeaceCleaner.rar",
            "peacecleaner.zip",
            "PeaceCleaner.zip",
          ].filter(Boolean) as string[]
        : [
            process.env.CLIENT_DOWNLOAD_STORAGE_PATH,
            "RedLine.rar",
            "esmiringhoy.rar",
            "esmiringhoy.zip",
            "Esmiringhoy.rar",
            "Esmiringhoy.zip",
          ].filter(Boolean) as string[];

    if (bucket) {
      for (const storagePath of candidatePaths) {
        const isRar = storagePath.toLowerCase().endsWith(".rar");
        const downloadFileName =
          targetProduct === "PC"
            ? (isRar ? "PeaceCleaner.rar" : "PeaceCleaner.zip")
            : (isRar ? "Esmiringhoy.rar" : "Esmiringhoy.zip");

        const { data, error: signedUrlError } = await supabaseAdmin.storage
          .from(bucket)
          .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS, {
            download: downloadFileName,
          });

        if (!signedUrlError && data?.signedUrl) {
          return NextResponse.json(
            { url: data.signedUrl, product: targetProduct },
            { headers: { "Cache-Control": "no-store, private" } }
          );
        }
      }
    }

    // Direct / Discord download URL fallback if bucket file is not yet uploaded
    const fallbackUrl =
      targetProduct === "PC"
        ? (process.env.PEACE_CLEANER_DOWNLOAD_URL ||
           process.env.NEXT_PUBLIC_PEACE_CLEANER_DOWNLOAD_URL ||
           process.env.CLIENT_DOWNLOAD_URL ||
           process.env.NEXT_PUBLIC_CLIENT_DOWNLOAD_URL)
        : (process.env.CLIENT_DOWNLOAD_URL ||
           process.env.NEXT_PUBLIC_CLIENT_DOWNLOAD_URL);

    if (fallbackUrl) {
      return NextResponse.json(
        { url: fallbackUrl, product: targetProduct },
        { headers: { "Cache-Control": "no-store, private" } }
      );
    }

    return NextResponse.json(
      {
        error: `The ${targetProduct === "PC" ? "Peace Cleaner" : "Esmiringhoy"} package is being prepared. Please contact staff or check Discord.`,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Client download request failed:", error);
    return NextResponse.json(
      { error: "Unable to start the download. Please try again later." },
      { status: 500 }
    );
  }
}