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

function isPeaceCleanerLicense(license: License) {
  const key = (license.license_key || "").toUpperCase();
  const tier = (license.tier || "").toLowerCase();
  return key.startsWith("PC-") || tier.includes("peace") || tier.includes("cleaner");
}

function isLicenseActive(license: License) {
  if (license.is_banned) return false;
  if (!license.expires_at) return true;
  const expiresAt = Date.parse(license.expires_at);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return "Permanent / Lifetime Pass";
  const date = new Date(expiresAt);
  if (date.getTime() < Date.now()) return "Expired";
  return `Expires: ${date.toLocaleDateString()} (${Math.ceil(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )}d remaining)`;
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

      if (!licRes.ok || !ordRes.ok) {
        throw new Error("Failed to load customer profile details from server.");
      }

      const [licData, ordData] = await Promise.all([licRes.json(), ordRes.json()]);
      setLicenses(licData.licenses || []);
      setOrders(ordData.orders || []);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setLoadError(err.message || "Could not retrieve account licenses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleClientDownload = async (product?: "ESM" | "PC") => {
    setDownloadError(null);
    setIsDownloading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await getSupabaseClient().auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Your Discord session expired. Please sign in again.");
      }

      const endpoint = product ? `/api/downloads/client?product=${product}` : "/api/downloads/client";
      const response = await fetch(endpoint, {
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
        error instanceof Error
          ? error.message
          : "Could not start client download. Please try again or ping staff."
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

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 font-sans">
        <RefreshCw className="h-8 w-8 text-[#E53935] animate-spin" />
        <p className="text-zinc-500 text-sm font-medium">Authenticating Discord Session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 sm:py-20 px-4 font-sans">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.06)] max-w-lg mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2] shadow-sm">
            <DiscordIcon className="h-8 w-8 fill-current" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              VIP Customer Portal
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Connect your Discord account to manage your Assault Fire licenses, download client tools, and track GCash order verification.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => loginWithDiscord()}
              className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md shadow-[#5865F2]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <DiscordIcon className="h-4 w-4 fill-current" />
              <span>Continue with Discord</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Single-seat HWID protection & instant activation</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in font-sans">
      {/* ─── USER PROFILE HEADER ──────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatarUrl}
            alt={user?.username}
            className="h-16 w-16 rounded-2xl border-2 border-zinc-200 shadow-sm object-cover"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                {user?.username}
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>VIP Client</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Discord ID: <span className="font-mono text-zinc-600">{user?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 hover:text-black transition-all cursor-pointer shadow-xs"
            title="Refresh Status"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-[#E53935]" : ""}`}
            />
          </button>
          <Link
            href="/#pricing"
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#E53935] hover:bg-[#c62828] active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Buy Another Plan</span>
            <ExternalLink className="h-3.5 w-3.5 text-white" />
          </Link>
        </div>
      </div>

      {downloadError && (
        <div role="alert" className="text-sm text-[#E53935] bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {/* ─── ACTIVE VIP LICENSES ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
              <Key className="h-5 w-5 text-[#E53935]" />
              <span>Active VIP Licenses</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                {licenses.length}
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Hardware locked credentials for your Assault Fire client
            </p>
          </div>
          <Link
            href="/#pricing"
            className="text-xs font-bold text-[#E53935] hover:text-[#A71919] transition-colors"
          >
            + New License
          </Link>
        </div>

        {licenses.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/80 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
              <Key className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-black">
                No active licenses found
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                If you recently submitted a GCash order, our staff will approve your receipt shortly. Your VIP authorization key will automatically appear here.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
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
                  className={`relative p-6 sm:p-7 rounded-3xl bg-white border transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between ${
                    lic.is_banned
                      ? "border-red-200 bg-red-50/20"
                      : isPermanent
                      ? "border-black shadow-md"
                      : "border-zinc-200/90 hover:border-zinc-300"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        lic.is_banned
                          ? "bg-red-100 text-[#E53935]"
                          : isPermanent
                          ? "bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {lic.is_banned ? "BANNED" : lic.tier}
                    </span>

                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{formatExpiry(lic.expires_at)}</span>
                    </span>
                  </div>

                  {/* License Key Display */}
                  <div className="my-5 space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      VIP Authorization Key
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                      <code className="text-sm sm:text-base font-mono font-bold tracking-wider text-black flex-1 select-all break-all">
                        {isRevealed
                          ? lic.license_key
                          : lic.license_key.slice(0, 8) + "••••-••••"}
                      </code>

                      <button
                        onClick={() => toggleReveal(lic.id)}
                        className="p-2 rounded-xl bg-zinc-200/70 hover:bg-zinc-200 text-zinc-600 hover:text-black transition-colors cursor-pointer"
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
                        className="px-3 py-2 rounded-xl bg-[#E53935] hover:bg-[#c62828] text-white transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95 cursor-pointer shadow-xs"
                        title="Copy Key to Clipboard"
                      >
                        {copiedKey === lic.license_key ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PC Binding & Download Actions */}
                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Laptop className="h-3.5 w-3.5 text-zinc-400" />
                        <span>PC Hardware Lock:</span>
                      </span>
                      {lic.hwid ? (
                        <span className="text-emerald-700 font-bold font-mono">
                          Bound ({lic.hwid.slice(0, 14)}...)
                        </span>
                      ) : (
                        <span className="text-zinc-800 font-bold">
                          Unbound (Ready for first PC)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {lic.hwid
                        ? "Permanently locked to your registered PC. To switch PCs, request a reset from staff in Discord."
                        : "Launch the client on your PC and paste this key. It will bind permanently to your device."}
                    </p>

                    {isLicenseActive(lic) && (
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleClientDownload(isPeaceCleanerLicense(lic) ? "PC" : "ESM")}
                          disabled={isDownloading}
                          className="w-full py-3.5 px-4 rounded-2xl bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:cursor-wait disabled:opacity-60 cursor-pointer active:scale-[0.98] shadow-md"
                        >
                          <Download className={`h-4 w-4 text-[#E53935] ${isDownloading ? "animate-pulse" : ""}`} />
                          <span>
                            {isDownloading
                              ? "Preparing download…"
                              : `Download ${isPeaceCleanerLicense(lic) ? "Peace Cleaner (.rar)" : "RedLine VIP (.rar)"}`}
                          </span>
                        </button>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                          <span>Archive Password:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy("RL2026")}
                            className="font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
                            title="Copy Password"
                          >
                            <span>RL2026</span>
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
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
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-[#E53935]" />
            <span>Order History & GCash Verification</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {orders.length}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track GCash payment verification status and assigned license keys
          </p>
        </div>

        {loadError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-[#E53935] flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading your order history…</div>
        ) : loadError ? null : orders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 text-center text-xs text-zinc-400 shadow-sm">
            No pending or past orders recorded for this account.
          </div>
        ) : (
          <>
            {/* Mobile View: Order Cards */}
            <div className="sm:hidden space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black font-mono">{ord.order_number}</span>
                    {ord.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending Review
                      </span>
                    )}
                    {ord.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {ord.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-[#E53935] border border-red-200 text-[11px] font-bold">
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-zinc-800">
                    <span className="font-semibold">{ord.tier}</span>
                    <span className="text-black font-black text-sm">
                      ₱{ord.amount.toLocaleString()} PHP
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 text-[11px] pt-2 border-t border-zinc-100">
                    <span>GCash Ref: <strong className="font-mono text-zinc-700">{ord.reference_number}</strong></span>
                    <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                  </div>

                  {ord.license_key && (
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Key:</span>
                      <code className="text-emerald-700 font-bold select-all text-xs break-all font-mono">
                        {ord.license_key}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block overflow-x-auto rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-bold tracking-wider border-b border-zinc-200/80">
                  <tr>
                    <th className="py-3.5 px-5">Order #</th>
                    <th className="py-3.5 px-5">Plan</th>
                    <th className="py-3.5 px-5">Amount</th>
                    <th className="py-3.5 px-5">GCash Ref</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Assigned Key</th>
                    <th className="py-3.5 px-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-black font-mono">
                        {ord.order_number}
                      </td>
                      <td className="py-4 px-5 font-semibold text-zinc-800">{ord.tier}</td>
                      <td className="py-4 px-5 text-black font-bold">
                        ₱{ord.amount.toLocaleString()} PHP
                      </td>
                      <td className="py-4 px-5 text-zinc-600 font-mono">
                        {ord.reference_number}
                      </td>
                      <td className="py-4 px-5">
                        {ord.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending Review
                          </span>
                        )}
                        {ord.status === "approved" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <Check className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {ord.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-[#E53935] border border-red-200 text-[11px] font-bold">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {ord.license_key ? (
                          <code className="text-emerald-700 font-bold font-mono">
                            {ord.license_key}
                          </code>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-zinc-400 text-xs">
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
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-black flex items-center gap-2.5">
          <HelpCircle className="h-5 w-5 text-[#E53935]" />
          <span>How to Launch & Activate Red Line VIP</span>
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-zinc-600 leading-relaxed text-xs sm:text-sm">
          <li>
            Download the client bundle using the button above and extract the .rar file to a clean folder.
          </li>
          <li>
            Right click the client application executable and select <strong className="text-black font-semibold">"Run as Administrator"</strong>.
          </li>
          <li>
            When prompted, paste your VIP license key into the loader.
          </li>
          <li>
            The driver authenticates your single-seat license and locks securely to your gaming hardware.
          </li>
          <li>
            Launch Assault Fire PH in <strong className="text-black font-semibold">Windowed</strong> or <strong className="text-black font-semibold">Borderless</strong> mode. The tactical overlay attaches automatically!
          </li>
          <li>
            Press <code className="text-black font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-lg font-mono">[INSERT]</code> to toggle overlay on/off, and <code className="text-black font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-lg font-mono">[END]</code> to safely unhook.
          </li>
        </ol>
      </section>
    </div>
  );
}
