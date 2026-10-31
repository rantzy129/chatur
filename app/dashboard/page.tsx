"use client";

import { useEffect, useState } from "react";
import { useDiscordAuth } from "@/context/DiscordAuthContext";
import {
  Key,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Clock,
  Laptop,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import Link from "next/link";
import DiscordIcon from "@/components/DiscordIcon";
import { getSupabaseClient } from "@/lib/supabase";

interface License {
  id: string;
  license_key: string;
  tier: string;
  hwid: string | null;
  expires_at: string | null;
  is_banned: boolean;
  created_at: string;
  notes: string | null;
}

interface Order {
  id: string;
  order_number: string;
  tier: string;
  amount: number;
  reference_number: string;
  status: "pending" | "approved" | "rejected";
  license_key: string | null;
  admin_notes: string | null;
  created_at: string;
}

function isLicenseActive(license: License) {
  if (license.is_banned) return false;
  if (!license.expires_at) return true;
  const expiresAt = Date.parse(license.expires_at);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export default function DashboardPage() {
  const { user, loginWithDiscord, isLoading: authLoading } = useDiscordAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const hasActiveLicense = licenses.some(isLicenseActive);

  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data: { session }, error: sessionError } =
        await getSupabaseClient().auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Your Discord session expired. Please sign in again.");
      }

      const headers = { Authorization: `Bearer ${session.access_token}` };
      const [licRes, ordRes] = await Promise.all([
        fetch("/api/licenses/user", { headers }),
        fetch("/api/orders/user", { headers }),
      ]);
      const [licData, ordData] = await Promise.all([
        licRes.json(),
        ordRes.json(),
      ]);
      if (!licRes.ok) throw new Error(licData.error || "Failed to load licenses.");
      if (!ordRes.ok) throw new Error(ordData.error || "Failed to load order history.");

      setLicenses(licData.licenses || []);
      setOrders(ordData.orders || []);
    } catch (err) {
      console.error("Failed to load user portal data", err);
      setLicenses([]);
      setOrders([]);
      setLoadError(
        err instanceof Error ? err.message : "Failed to load your account history."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleClientDownload = async () => {
    if (!user || isDownloading) return;

    setIsDownloading(true);
    setDownloadError(null);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await getSupabaseClient().auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Your Discord session expired. Please sign in again.");
      }

      const response = await fetch("/api/downloads/client", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to download the client.");
      }
      if (typeof result.url !== "string") {
        throw new Error("The download link was missing. Please try again.");
      }

      window.location.assign(result.url);
    } catch (error) {
      console.error("Client download failed:", error);
      setDownloadError(
        error instanceof Error ? error.message : "Unable to download the client."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleReveal = (keyId: string) => {
    setRevealedKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const formatExpiry = (isoString: string | null) => {
    if (!isoString) return "Permanent Lifetime VIP";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // If not authenticated via Discord
  if (!user && !authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] shadow-xl">
          <DiscordIcon className="h-8 w-8 fill-current" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-white font-mono">
            DISCORD AUTHENTICATION REQUIRED
          </h2>
          <p className="text-sm text-zinc-400">
            Please connect your Discord account to view your active VIP licenses, manage PC hardware bindings, and track GCash order approvals.
          </p>
        </div>
        <button
          onClick={() => loginWithDiscord()}
          className="py-3 px-8 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold font-mono text-sm tracking-wider shadow-lg hover:shadow-[#5865F2]/25 transition-all flex items-center gap-2"
        >
          <DiscordIcon className="h-4 w-4 fill-current" />
          <span>Connect Discord Profile</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* ─── USER PROFILE HEADER ──────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-cyber-card border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatarUrl}
            alt={user?.username}
            className="h-16 w-16 rounded-2xl border-2 border-cyber-neon/60 shadow-glow object-cover"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {user?.username}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30">
                VIP Portal
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Discord ID: <span className="text-zinc-300">{user?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
            title="Refresh Status"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-cyber-neon" : ""}`}
            />
          </button>

          {hasActiveLicense ? (
            <button
              type="button"
              onClick={handleClientDownload}
              disabled={isDownloading}
              className="py-2.5 px-4 rounded-xl bg-cyber-neon hover:bg-emerald-400 text-black font-bold font-mono text-xs transition-all shadow-glow flex items-center gap-2"
            >
              <Download className={`h-4 w-4 ${isDownloading ? "animate-pulse" : ""}`} />
              <span>{isDownloading ? "Preparing download…" : "Download Client (.zip)"}</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="py-2.5 px-4 rounded-xl bg-white/[0.04] text-zinc-500 border border-white/[0.08] font-mono text-xs flex items-center gap-2 cursor-not-allowed opacity-75"
                title="Download requires an active license"
              >
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                <span>Download Locked</span>
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-2.5 rounded-xl bg-cyber-card border border-white/[0.1] text-[11px] text-zinc-400 font-mono shadow-2xl z-30 pointer-events-none">
                An active license is required. Downloads unlock after staff approves your order.
              </div>
            </div>
          )}
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="text-sm text-red-300">
          {downloadError}
        </p>
      )}

      {/* ─── ACTIVE VIP LICENSES ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Key className="h-5 w-5 text-cyber-neon" />
            <span>MY VIP LICENSES</span>
            <span className="text-xs font-normal text-zinc-500 font-mono">
              ({licenses.length})
            </span>
          </h2>
          <Link
            href="/#pricing"
            className="text-xs text-cyber-neon hover:underline font-mono"
          >
            + Buy Another Plan
          </Link>
        </div>

        {licenses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-black/40 border border-dashed border-white/[0.1] text-center space-y-3">
            <p className="text-sm text-zinc-400 font-mono">
              No active licenses detected for this Discord account yet.
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              If you recently submitted a GCash payment, please wait for staff verification below. Your key will automatically appear here once approved!
            </p>
            <div className="pt-2">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs transition-colors"
              >
                <span>Purchase VIP Access (from ₱500)</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {licenses.map((lic) => {
              const isRevealed = revealedKeys[lic.id];
              const isPermanent = !lic.expires_at;

              return (
                <div
                  key={lic.id}
                  className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all ${lic.is_banned
                      ? "bg-red-950/20 border-red-500/40"
                      : isPermanent
                        ? "bg-gradient-to-b from-[#141209] to-cyber-card border-cyber-gold/40 shadow-glow-gold"
                        : "bg-cyber-card border-white/[0.1] hover:border-cyber-neon/40 shadow-xl"
                    }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${lic.is_banned
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : isPermanent
                            ? "bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/40"
                            : "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40"
                        }`}
                    >
                      {lic.is_banned ? "BANNED" : lic.tier}
                    </span>

                    <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{formatExpiry(lic.expires_at)}</span>
                    </span>
                  </div>

                  {/* License Key Display */}
                  <div className="my-5">
                    <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest mb-1.5">
                      VIP Authorization Key
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/[0.1]">
                      <code className="text-xs sm:text-base font-mono font-bold tracking-wider text-white flex-1 select-all break-all">
                        {isRevealed
                          ? lic.license_key
                          : lic.license_key.slice(0, 8) + "••••-••••"}
                      </code>

                      <button
                        onClick={() => toggleReveal(lic.id)}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                        title={isRevealed ? "Hide Key" : "Reveal Key"}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(lic.license_key)}
                        className="p-1.5 rounded-lg bg-cyber-neon/10 hover:bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 transition-colors"
                        title="Copy Key to Clipboard"
                      >
                        {copiedKey === lic.license_key ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 1 Key = 1 PC Binding Status */}
                  <div className="pt-3 border-t border-white/[0.06] text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Laptop className="h-3.5 w-3.5 text-zinc-400" />
                        <span>PC Hardware Lock:</span>
                      </span>
                      {lic.hwid ? (
                        <span className="text-cyber-neon font-semibold truncate max-w-[190px]">
                          Bound ({lic.hwid.slice(0, 16)}...)
                        </span>
                      ) : (
                        <span className="text-cyber-cyan font-semibold">
                          Unbound (Ready for first PC)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {lic.hwid
                        ? "Permanently locked to your registered PC. To switch PCs, request a reset from staff in Discord."
                        : "Launch the client application on your gaming PC and paste this key. It will bind permanently to your device."}
                    </p>

                    {isLicenseActive(lic) && (
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={handleClientDownload}
                          disabled={isDownloading}
                          className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-cyber-neon/10 text-zinc-300 hover:text-cyber-neon border border-white/[0.08] hover:border-cyber-neon/30 text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all disabled:cursor-wait disabled:opacity-60"
                        >
                          <Download className={`h-3.5 w-3.5 text-cyber-neon ${isDownloading ? "animate-pulse" : ""}`} />
                          <span>{isDownloading ? "Preparing download…" : "Download Client Package (.zip)"}</span>
                        </button>
                        <p className="text-[11px] text-zinc-400 text-center">
                          File password: <span className="font-semibold text-cyber-neon">RL2026</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── PENDING & RECENT ORDERS ──────────────────────────────── */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyber-cyan" />
          <span>ORDER STATUS & GCASH VERIFICATION</span>
          <span className="text-xs font-normal text-zinc-500 font-mono">
            ({orders.length})
          </span>
        </h2>

        {loadError && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {loadError}
          </div>
        )}

        {isLoading ? (
          <p className="text-xs text-zinc-400 font-mono">Loading your order history…</p>
        ) : loadError ? null : orders.length === 0 ? (
          <p className="text-xs text-zinc-500 font-mono">
            No pending or past orders recorded for this account.
          </p>
        ) : (
          <>
            {/* Mobile View: Order Cards */}
            <div className="sm:hidden space-y-3 font-mono">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-cyber-card border border-white/[0.08] space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{ord.order_number}</span>
                    {ord.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                        Pending Review
                      </span>
                    )}
                    {ord.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {ord.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px]">
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-zinc-300">
                    <span>{ord.tier}</span>
                    <span className="text-red-400 font-bold">
                      ₱{ord.amount.toLocaleString()} PHP
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-400 text-[11px] pt-1 border-t border-white/[0.04]">
                    <span>GCash Ref: {ord.reference_number}</span>
                    <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                  </div>

                  {ord.license_key && (
                    <div className="p-2 rounded-lg bg-black/50 border border-white/[0.08] flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 uppercase">Key:</span>
                      <code className="text-red-400 font-bold select-all text-xs break-all">
                        {ord.license_key}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/[0.08] bg-cyber-card/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/50 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">GCash Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Key</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{ord.tier}</td>
                      <td className="py-3.5 px-4 text-cyber-neon font-bold">
                        ₱{ord.amount.toLocaleString()} PHP
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {ord.reference_number}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                            Pending Review
                          </span>
                        )}
                        {ord.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                            <Check className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {ord.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px]">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.license_key ? (
                          <code className="text-cyber-neon font-bold">
                            {ord.license_key}
                          </code>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* ─── QUICK ACTIVATION GUIDE ───────────────────────────────── */}
      <section className="p-6 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3 font-mono text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-cyber-neon" />
          <span>HOW TO LAUNCH & ACTIVATE RED LINE VIP</span>
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 leading-relaxed">
          <li>
            Download the client bundle using the green button above (unlocked once your VIP order is approved) and extract it to a clean folder.
          </li>
          <li>
            Launch the client executable as Administrator.
          </li>
          <li>
            When prompted, paste your VIP license key.
          </li>
          <li>
            The system authenticates your key and locks it securely to your device.
          </li>
          <li>
            Launch your game. The tactical overlay attaches automatically!
          </li>
          <li>
            Press <code className="text-white font-bold bg-white/[0.1] px-1.5 py-0.5 rounded">[INSERT]</code> to toggle the overlay on/off, and <code className="text-white font-bold bg-white/[0.1] px-1.5 py-0.5 rounded">[END]</code> to close safely.
          </li>
        </ol>
      </section>
    </div>
  );
}
