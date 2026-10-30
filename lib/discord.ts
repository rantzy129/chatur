import "server-only";
import { parseReceiptDataUrl } from "@/lib/receipt-image";

/**
 * Discord Webhook Notification Dispatcher
 * Sends rich tactical embeds to staff logs channel.
 */
export async function sendDiscordOrderNotification(order: {
  orderNumber: string;
  discordId: string;
  discordUsername: string;
  tier: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  receiptUrl?: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not configured.");
  }

  const receiptImage = order.receiptUrl?.startsWith("data:")
    ? parseReceiptDataUrl(order.receiptUrl)
    : null;
  const embed = {
    title: "⚡ NEW VIP ORDER SUBMITTED (PENDING APPROVAL)",
    color: 0x00ff88, // Cyber Neon Emerald
    description: `A new customer submitted payment for **${order.tier}** via **${order.paymentMethod}**. Please verify the reference number and approve the order in the Admin Dashboard.`,
    fields: [
      {
        name: "Order Number",
        value: `\`${order.orderNumber}\``,
        inline: true,
      },
      {
        name: "Customer",
        value: `<@${order.discordId}> (\`${order.discordUsername}\`)`,
        inline: true,
      },
      {
        name: "Plan Tier",
        value: `**${order.tier}**`,
        inline: true,
      },
      {
        name: "Amount Due",
        value: `**₱${order.amount.toLocaleString()} PHP**`,
        inline: true,
      },
      {
        name: "Reference Number",
        value: `\`${order.referenceNumber}\``,
        inline: true,
      },
      {
        name: "Discord ID",
        value: `\`${order.discordId}\``,
        inline: true,
      },
    ],
    image: receiptImage
      ? { url: `attachment://${receiptImage.fileName}` }
      : order.receiptUrl?.startsWith("https://")
        ? { url: order.receiptUrl }
        : undefined,
    footer: {
      text: "Red Line VIP Store Engine • Pending Manual Verification",
    },
    timestamp: new Date().toISOString(),
  };

  const payload = {
    content: `🚨 **New Payment Verification Request!** <@${order.discordId}>`,
    embeds: [embed],
  };
  let response: Response;

  if (receiptImage) {
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(payload));
    formData.append(
      "files[0]",
      new Blob([receiptImage.bytes], { type: receiptImage.contentType }),
      receiptImage.fileName
    );
    response = await fetch(webhookUrl, { method: "POST", body: formData });
  } else {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    throw new Error(`Discord webhook returned HTTP ${response.status}.`);
  }
}

export async function sendDiscordOrderApproved(order: {
  orderNumber: string;
  discordId: string;
  discordUsername: string;
  tier: string;
  licenseKey: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    title: "✅ VIP ORDER APPROVED & LICENSE ISSUED",
    color: 0x10b981,
    description: `Order **${order.orderNumber}** has been verified and approved by admin. VIP License key generated.`,
    fields: [
      {
        name: "Customer",
        value: `<@${order.discordId}> (\`${order.discordUsername}\`)`,
        inline: true,
      },
      {
        name: "Tier Plan",
        value: `**${order.tier}**`,
        inline: true,
      },
      {
        name: "Generated Key",
        value: `\`${order.licenseKey}\``,
        inline: false,
      },
    ],
    footer: {
      text: "Red Line VIP System • 1 Key = 1 PC Binding Activated",
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (err) {
    console.error("Failed to transmit Discord webhook:", err);
  }
}
