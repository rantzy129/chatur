import { NextResponse } from "next/server";
import { getAdminAuthResponse } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateLicenseKey } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const { data: licenses, error } = await getSupabaseAdmin()
      .from("esm_licenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ licenses: licenses || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const body = await req.json();
    const { action, license_key, id, duration_days, tier, notes, discord_id, discord_username } = body;
    const supabaseAdmin = getSupabaseAdmin();

    // Reset HWID (1 Key = 1 PC reset)
    if (action === "reset_hwid") {
      if (!license_key && !id) {
        return NextResponse.json({ error: "Missing license identifier" }, { status: 400 });
      }

      const query = supabaseAdmin.from("esm_licenses").update({ hwid: null });
      const { data, error } = id ? await query.eq("id", id).select().single() : await query.eq("license_key", license_key).select().single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        message: `Hardware lock cleared! Customer can now activate on their new PC.`,
        license: data,
      });
    }

    // Toggle Ban
    if (action === "toggle_ban") {
      const { is_banned } = body;
      const query = supabaseAdmin.from("esm_licenses").update({ is_banned: Boolean(is_banned) });
      const { data, error } = id ? await query.eq("id", id).select().single() : await query.eq("license_key", license_key).select().single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        message: `License ${is_banned ? "banned" : "unbanned"} successfully.`,
        license: data,
      });
    }

    // Delete Key
    if (action === "delete") {
      const query = supabaseAdmin.from("esm_licenses").delete();
      const { error } = id ? await query.eq("id", id) : await query.eq("license_key", license_key);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true, message: "License key deleted." });
    }

    // Manual Gen Key
    if (action === "generate") {
      const key = generateLicenseKey("ESM");
      let expiresAt: string | null = null;
      if (duration_days && Number(duration_days) > 0) {
        const exp = new Date();
        exp.setDate(exp.getDate() + Number(duration_days));
        expiresAt = exp.toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from("esm_licenses")
        .insert({
          license_key: key,
          tier: tier || (expiresAt ? "Monthly VIP" : "Lifetime VIP"),
          notes: notes || "Generated via Admin Dashboard",
          expires_at: expiresAt,
          discord_id: discord_id || null,
          discord_username: discord_username || null,
          is_banned: false,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true, license: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
