import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { NextResponse, type NextRequest } from "next/server";

// Blocked country codes (ISO 3166-1 alpha-2)
const BLOCKED_COUNTRIES = new Set(["TH"]); // Thailand

type Policy = {
  name: string;
  limit: number;
  window: `${number} ${"s" | "m" | "h"}`;
};

const policies = new Map<string, Ratelimit>();
let redis: Redis | undefined;

// In-memory sliding-window fallback when Upstash Redis is not yet provisioned
type MemoryBucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, MemoryBucket>();

function parseWindowToMs(window: Policy["window"]): number {
  const [numStr, unit] = window.split(" ") as [string, "s" | "m" | "h"];
  const num = parseInt(numStr, 10);
  if (unit === "h") return num * 3_600_000;
  if (unit === "m") return num * 60_000;
  return num * 1_000;
}

function checkMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();

  // Periodic pruning of stale memory keys
  if (memoryBuckets.size > 1500) {
    for (const [key, bucket] of memoryBuckets.entries()) {
      if (bucket.resetAt <= now) {
        memoryBuckets.delete(key);
      }
    }
  }

  const existing = memoryBuckets.get(identifier);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryBuckets.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, reset: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, reset: existing.resetAt };
}

function getClientCountry(request: NextRequest): string {
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const cfCountry = request.headers.get("cf-ipcountry");
  return (vercelCountry || cfCountry || "").trim().toUpperCase();
}

function isThaiLanguage(request: NextRequest): boolean {
  const acceptLanguage = (request.headers.get("accept-language") || "").toLowerCase();
  if (!acceptLanguage) return false;
  return /(?:^|[,;\s])th(?:-[a-z]{2,4})?(?:[,;=\s]|$)/i.test(acceptLanguage);
}

function getPolicy(request: NextRequest): Policy {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/api/admin/");
  const isAdminAction = pathname === "/api/orders/action";
  const hasValidAdminSecret =
    !!process.env.ADMIN_SECRET_KEY &&
    request.headers.get("x-admin-secret") === process.env.ADMIN_SECRET_KEY;

  if (pathname === "/redgate" || pathname === "/staff-vault") {
    return { name: "admin-probe", limit: 10, window: "1 m" };
  }

  if ((isAdminRoute || isAdminAction) && !hasValidAdminSecret) {
    return { name: "admin-auth", limit: 5, window: "15 m" };
  }

  if (pathname === "/api/orders/create" && request.method === "POST") {
    return { name: "order-create", limit: 5, window: "10 m" };
  }

  if ((isAdminAction || pathname === "/api/admin/licenses") && request.method === "POST") {
    return { name: "admin-write", limit: 30, window: "1 m" };
  }

  if (isAdminRoute) {
    return { name: "admin-read", limit: 120, window: "1 m" };
  }

  if (pathname.startsWith("/api/")) {
    return { name: "api-read", limit: 60, window: "1 m" };
  }

  return { name: "page-view", limit: 120, window: "1 m" };
}

function getClientIp(request: NextRequest): string | null {
  // Check authoritative reverse-proxy headers from Vercel & Cloudflare before unverified headers
  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwarded = forwardedFor?.split(",")[0]?.trim();

  const candidate = vercelIp || realIp || cfIp || firstForwarded;

  if (!candidate || candidate.length > 64 || !/^[\da-fA-F:.]+$/.test(candidate)) {
    return null;
  }

  return candidate;
}

async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getRateLimiter(policy: Policy): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  redis ??= new Redis({ url, token });

  const existing = policies.get(policy.name);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
    prefix: "redline:rate-limit:v1",
  });

  policies.set(policy.name, limiter);
  return limiter;
}

export async function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // 1. Regional Geo-Block & Anti-VPN Traps (Country TH, Thai Language, or Blocked Timezone)
  const country = getClientCountry(request);
    const isThai = BLOCKED_COUNTRIES.has(country);
    const hasThaiLang = isThaiLanguage(request);
    const hasBlockedTzCookie = request.cookies.get("rl_block_tz")?.value === "1";

    if (isThai || hasThaiLang || hasBlockedTzCookie) {
      return new NextResponse(
        "Access Restricted: Service is not available in your region.",
        {
          status: 403,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store, private",
          },
        }
      );
    }

    // 2. Rate Limiting & Throttling
    const policy = getPolicy(request);
    const ip = getClientIp(request) || "127.0.0.1";
    const identifier = `${policy.name}:${await hashIp(ip)}`;
    const limiter = getRateLimiter(policy);

    let success = true;
    let limit = policy.limit;
    let remaining = policy.limit;
    let resetTimeMs = Date.now() + 60_000;

    if (limiter) {
      try {
        const result = await limiter.limit(identifier);
        success = result.success;
        limit = result.limit;
        remaining = result.remaining;
        resetTimeMs = result.reset;
      } catch (error) {
        console.warn("Distributed rate limiter error, falling back to local window:", error);
        const memResult = checkMemoryRateLimit(identifier, policy.limit, parseWindowToMs(policy.window));
        success = memResult.success;
        remaining = memResult.remaining;
        resetTimeMs = memResult.reset;
      }
    } else {
      // In-memory sliding-window fallback
      const memResult = checkMemoryRateLimit(identifier, policy.limit, parseWindowToMs(policy.window));
      success = memResult.success;
      remaining = memResult.remaining;
      resetTimeMs = memResult.reset;
    }

    const resetSeconds = Math.max(1, Math.ceil((resetTimeMs - Date.now()) / 1000));
    const headers = new Headers({
      "Cache-Control": "no-store",
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(Math.ceil(resetTimeMs / 1000)),
    });

    if (!success) {
      headers.set("Retry-After", String(resetSeconds));
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429, headers }
      );
    }

    return NextResponse.next({ headers });
  }

  export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - static media files (png, jpg, webp, svg, pdf)
       */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
    ],
  };
