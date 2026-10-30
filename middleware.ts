import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { NextResponse, type NextRequest } from "next/server";

type Policy = {
  name: string;
  limit: number;
  window: `${number} ${"s" | "m" | "h"}`;
};

const policies = new Map<string, Ratelimit>();
let redis: Redis | undefined;

function getPolicy(request: NextRequest): Policy {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/api/admin/");
  const isAdminAction = pathname === "/api/orders/action";
  const hasValidAdminSecret =
    !!process.env.ADMIN_SECRET_KEY &&
    request.headers.get("x-admin-secret") === process.env.ADMIN_SECRET_KEY;

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

  return { name: "api-read", limit: 60, window: "1 m" };
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIps = forwardedFor?.split(",").map((value) => value.trim()).filter(Boolean);
  const candidate =
    forwardedIps?.at(-1) ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-vercel-forwarded-for")?.trim();

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

function unavailable(message: string, retryAfter = 10) {
  return NextResponse.json(
    { error: message },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const policy = getPolicy(request);
  const limiter = getRateLimiter(policy);
  if (!limiter) {
    return unavailable("API rate limiting is not configured. Add the Upstash Redis REST credentials.");
  }

  const ip = getClientIp(request);
  if (!ip) {
    return unavailable("Could not determine the request IP for rate limiting.");
  }

  try {
    const identifier = `${policy.name}:${await hashIp(ip)}`;
    const result = await limiter.limit(identifier);
    const resetSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    const headers = new Headers({
      "Cache-Control": "no-store",
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
    });

    if (!result.success) {
      headers.set("Retry-After", String(resetSeconds));
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429, headers }
      );
    }

    return NextResponse.next({ headers });
  } catch (error) {
    console.error("API rate limiter unavailable:", error);
    return unavailable("API rate limiting is temporarily unavailable.");
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
