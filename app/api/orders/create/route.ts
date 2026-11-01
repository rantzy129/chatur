import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateOrderNumber } from "@/lib/supabase";
import { sendDiscordOrderNotification } from "@/lib/discord";
import { getAuthenticatedDiscordUser } from "@/lib/discord-auth";
import { parseReceiptDataUrl } from "@/lib/receipt-image";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedDiscordUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in with Discord before placing an order." },
        { status: 401 }
      );
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "Payment notifications are not configured. Please contact staff." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const {
      tier,
      amount,
      reference_number,
      sender_name,
      receipt_url,
    } = body;

    if (!tier || !amount || !reference_number) {
      return NextResponse.json(
        { error: "Tier, amount, and GCash reference number are required." },
        { status: 400 }
      );
    }

    const tierPrices: Record<string, number> = {
      // Esmiringhoy VIP
      "Weekly VIP": 500,
      "Monthly VIP": 1000,
      "Lifetime VIP Pass": 3000,
      // Peace Cleaner VIP
      "Peace Cleaner - 1 Month": 1000,
      "Peace Cleaner - Lifetime": 3000,
    };
    if (tierPrices[String(tier)] !== Number(amount)) {
      return NextResponse.json(
        { error: "The selected plan or amount is invalid." },
        { status: 400 }
      );
    }

    if (receipt_url != null && typeof receipt_url !== "string") {
      return NextResponse.json(
        { error: "Receipt image data is invalid." },
        { status: 400 }
      );
    }

    const receiptUrl = typeof receipt_url === "string" ? receipt_url : null;
    try {
      if (receiptUrl?.startsWith("data:")) {
        parseReceiptDataUrl(receiptUrl);
      } else if (receiptUrl && new URL(receiptUrl).protocol !== "https:") {
        throw new Error("Receipt URL must use HTTPS.");
      }
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Receipt image is invalid." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const orderNumber = generateOrderNumber();

    // Check if table exists or insert
    const { data: order, error: insertError } = await supabaseAdmin
      .from("esm_orders")
      .insert({
        order_number: orderNumber,
        discord_id: user.id,
        discord_username: user.username,
        discord_avatar: user.avatarUrl,
        tier: String(tier),
        amount: Number(amount),
        payment_method: "GCash QR",
        reference_number: String(reference_number).trim(),
        sender_name: sender_name ? String(sender_name).trim() : null,
        receipt_url: receiptUrl,
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
    try {
      await sendDiscordOrderNotification({
        orderNumber,
        discordId: user.id,
        discordUsername: user.username,
        tier: String(tier),
        amount: Number(amount),
        paymentMethod: "GCash QR",
        referenceNumber: String(reference_number).trim(),
        receiptUrl: receiptUrl ?? undefined,
      });
    } catch (notificationError) {
      console.error("Order was saved but the Discord notification failed:", notificationError);
      return NextResponse.json(
        {
          error: `Order ${orderNumber} was saved, but the staff Discord notification failed. Please do not resubmit; contact staff.`,
          orderNumber,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully! Awaiting admin verification.",
      orderNumber,
    });
  } catch (err: any) {
    console.error("Order creation unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
