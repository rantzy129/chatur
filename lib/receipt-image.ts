import "server-only";
import { MAX_RECEIPT_BYTES } from "@/lib/receipt-constants";

const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export function parseReceiptDataUrl(dataUrl: string) {
  const match =
    /^data:(image\/(?:png|jpeg|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/i.exec(
      dataUrl
    );
  if (!match) {
    throw new Error("Receipt must be a PNG, JPEG, GIF, or WebP image.");
  }

  const contentType = match[1].toLowerCase();
  const base64 = match[2];
  const bytes = Buffer.from(base64, "base64");
  if (
    bytes.length === 0 ||
    bytes.length > MAX_RECEIPT_BYTES ||
    bytes.toString("base64").replace(/=+$/, "") !== base64.replace(/=+$/, "")
  ) {
    throw new Error("Receipt image is invalid or exceeds the 3MB limit.");
  }

  return {
    contentType,
    fileName: `receipt.${imageExtensions[contentType]}`,
    bytes: Uint8Array.from(bytes).buffer,
  };
}
