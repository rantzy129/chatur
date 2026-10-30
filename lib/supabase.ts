import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Generates an ESM-XXXX-XXXX-XXXX license key format
 * Identical to the Discord bot's key generator.
 */
export function generateLicenseKey(prefix = "ESM"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = (len = 4) => {
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
}

/**
 * Generates an Order Number (e.g. ESM-ORD-74921)
 */
export function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ESM-ORD-${num}`;
}
