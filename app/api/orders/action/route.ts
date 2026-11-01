import { NextResponse } from "next/server";
import { getAdminAuthResponse } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateLicenseKey } from "@/lib/supabase";
import { sendDiscordOrderApproved } from "@/lib/discord";

export async function POST(req: Request) {
  try {
    const authResponse = getAdminAuthResponse(req);
    if (authResponse) return authResponse;

    const body = await req.json();
    const { order_id, action, admin_notes, reviewer } = body; // action: 'approve' | 'reject'

    if (!order_id || !action) {
      return NextResponse.json({ error: "Missing order_id or action" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch the order
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from("esm_orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ error: `Order is already ${order.status}` }, { status: 400 });
    }

    if (action === "approve") {
      // 1. Generate unique license key
      const isPeaceCleaner =
        order.tier.toLowerCase().includes("peace") ||
        order.tier.toLowerCase().includes("cleaner") ||
        order.tier.startsWith("PC");
      const prefix = isPeaceCleaner ? "PC" : "ESM";
      const key = generateLicenseKey(prefix);

      // 2. Determine expiration date
      let expiresAt: string | null = null;
      if (order.tier.toLowerCase().includes("week")) {
        const exp = new Date();
        exp.setDate(exp.getDate() + 7);
        expiresAt = exp.toISOString();
      } else if (order.tier.toLowerCase().includes("month")) {
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        expiresAt = exp.toISOString();
      } // If Lifetime VIP, expiresAt remains null (Permanent)

      // 3. Insert into esm_licenses
      const { data: lic, error: licErr } = await supabaseAdmin
        .from("esm_licenses")
        .insert({
          license_key: key,
          discord_id: order.discord_id,
          discord_username: order.discord_username,
          tier: order.tier,
          notes: `Web GCash Order #${order.order_number}`,
          expires_at: expiresAt,
          is_banned: false,
        })
        .select()
        .single();

      if (licErr) {
        return NextResponse.json(
          { error: "Failed to generate license in database: " + licErr.message },
          { status: 500 }
        );
      }

      // 4. Update the order to approved
      const { data: updatedOrder, error: updateErr } = await supabaseAdmin
        .from("esm_orders")
        .update({
          status: "approved",
          license_key: key,
          admin_notes: admin_notes || "Approved by Admin",
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewer || "Admin",
        })
        .eq("id", order_id)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      // 5. Send Discord approved log
      await sendDiscordOrderApproved({
        orderNumber: order.order_number,
        discordId: order.discord_id,
        discordUsername: order.discord_username,
        tier: order.tier,
        licenseKey: key,
      });

      return NextResponse.json({
        success: true,
        message: `Order approved! License ${key} generated and bound to customer.`,
        order: updatedOrder,
        license: lic,
      });
    } else if (action === "reject") {
      const { data: updatedOrder, error: updateErr } = await supabaseAdmin
        .from("esm_orders")
        .update({
          status: "rejected",
          admin_notes: admin_notes || "Payment proof rejected or invalid reference number.",
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewer || "Admin",
        })
        .eq("id", order_id)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Order marked as rejected.",
        order: updatedOrder,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
