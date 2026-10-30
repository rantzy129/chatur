import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateOrderNumber } from "@/lib/supabase";
import { sendDiscordOrderNotification } from "@/lib/discord";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      discord_id,
      discord_username,
      discord_avatar,
      tier,
      amount,
      reference_number,
      sender_name,
      receipt_url,
    } = body;

    if (!discord_id || !discord_username) {
      return NextResponse.json(
        { error: "Discord authentication is required to make a purchase." },
        { status: 401 }
      );
    }

    if (!tier || !amount || !reference_number) {
      return NextResponse.json(
        { error: "Tier, amount, and GCash reference number are required." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // Check if table exists or insert
    const { data: order, error: insertError } = await supabaseAdmin
      .from("esm_orders")
      .insert({
        order_number: orderNumber,
        discord_id: String(discord_id),
        discord_username: String(discord_username),
        discord_avatar: discord_avatar || null,
        tier: String(tier),
        amount: Number(amount),
        payment_method: "GCash QR",
        reference_number: String(reference_number).trim(),
        sender_name: sender_name ? String(sender_name).trim() : null,
        receipt_url: receipt_url || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase order insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to record order: " + insertError.message },
        { status: 500 }
      );
    }

    // Fire Discord Webhook alert for staff
    await sendDiscordOrderNotification({
      orderNumber,
      discordId: String(discord_id),
      discordUsername: String(discord_username),
      tier: String(tier),
      amount: Number(amount),
      paymentMethod: "GCash QR",
      referenceNumber: String(reference_number),
      receiptUrl: receipt_url,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully! Awaiting admin verification.",
      order,
    });
  } catch (err: any) {
    console.error("Order creation unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
