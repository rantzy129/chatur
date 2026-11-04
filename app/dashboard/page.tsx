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
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-[#E53935] animate-spin" />
        <p className="text-zinc-600 font-mono text-sm">Authenticating Discord Session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200 backdrop-blur-xl max-w-xl mx-auto text-center space-y-6 shadow-xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-inner">
          <Key className="h-8 w-8 text-[#E53935]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-black font-sans tracking-tight">
            VIP CUSTOMER PORTAL
          </h1>
          <p className="text-sm text-zinc-600 font-sans max-w-sm mx-auto leading-relaxed">
            Connect your verified Discord account to view your active Assault Fire PH licenses, hardware locks, and download client software.
          </p>
        </div>

        <button
          onClick={() => loginWithDiscord()}
          className="py-3 px-8 rounded-xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-bold font-mono text-sm tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <DiscordIcon className="h-4 w-4 fill-current text-[#5865F2]" />
          <span>Connect Discord Profile</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* ─── USER PROFILE HEADER ──────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatarUrl}
            alt={user?.username}
            className="h-16 w-16 rounded-2xl border-2 border-[#E53935]/40 shadow-sm object-cover"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-black font-sans tracking-tight">
                {user?.username}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E53935] animate-pulse" />
                <span>VIP Portal</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Discord ID: <span className="text-zinc-700">{user?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 hover:text-black border border-zinc-200 transition-all"
            title="Refresh Status"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-[#E53935]" : ""}`}
            />
          </button>
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="text-sm text-[#E53935] font-mono bg-red-50 border border-red-200 p-3 rounded-xl">
          {downloadError}
        </p>
      )}

      {/* ─── ACTIVE VIP LICENSES ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black font-mono flex items-center gap-2">
            <Key className="h-5 w-5 text-[#E53935]" />
            <span>MY VIP LICENSES</span>
            <span className="text-xs font-normal text-zinc-500 font-mono tabular-nums">
              ({licenses.length})
            </span>
          </h2>
          <Link
            href="/#pricing"
            className="text-xs text-[#E53935] hover:text-[#A71919] font-mono transition-colors"
          >
            + Buy Another Plan
          </Link>
        </div>

        {licenses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 text-center space-y-3">
            <p className="text-sm text-zinc-700 font-mono">
              No active licenses detected for this Discord account yet.
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
              If you recently submitted a GCash payment, please wait for staff verification below. Your key will automatically appear here once approved!
            </p>
            <div className="pt-2">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-bold font-mono text-xs transition-all shadow-md hover:-translate-y-0.5"
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
                  className={`relative p-6 rounded-2xl border transition-all ${
                    lic.is_banned
                      ? "bg-red-50 border-red-200 text-zinc-900"
                      : isPermanent
                      ? "bg-white border-2 border-black shadow-lg"
                      : "bg-white border border-zinc-200 hover:border-zinc-400 shadow-sm"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        lic.is_banned
                          ? "bg-red-100 text-[#E53935] border border-red-200"
                          : isPermanent
                          ? "bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30"
                          : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                      }`}
                    >
                      {lic.is_banned ? "BANNED" : lic.tier}
                    </span>

                    <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{formatExpiry(lic.expires_at)}</span>
                    </span>
                  </div>

                  {/* License Key Display */}
                  <div className="my-5">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-1.5 font-semibold">
                      VIP Authorization Key
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <code className="text-xs sm:text-base font-mono font-bold tracking-wider text-black flex-1 select-all break-all">
                        {isRevealed
                          ? lic.license_key
                          : lic.license_key.slice(0, 8) + "••••-••••"}
                      </code>

                      <button
                        onClick={() => toggleReveal(lic.id)}
                        className="p-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-700 hover:text-black transition-colors"
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
                        className="px-2.5 py-1.5 rounded-lg bg-[#E53935]/10 hover:bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/30 transition-all flex items-center gap-1.5 text-xs font-mono font-bold active:scale-95"
                        title="Copy Key to Clipboard"
                      >
                        {copiedKey === lic.license_key ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#E53935]" />
                            <span className="text-[#E53935]">COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 1 Key = 1 PC Binding Status */}
                  <div className="pt-3 border-t border-zinc-200 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 flex items-center gap-1.5 font-sans">
                        <Laptop className="h-3.5 w-3.5 text-zinc-400" />
                        <span>PC Hardware Lock:</span>
                      </span>
                      {lic.hwid ? (
                        <span className="text-emerald-700 font-semibold truncate max-w-[190px]">
                          Bound ({lic.hwid.slice(0, 16)}...)
                        </span>
                      ) : (
                        <span className="text-black font-semibold">
                          Unbound (Ready for first PC)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      {lic.hwid
                        ? "Permanently locked to your registered PC. To switch PCs, request a reset from staff in Discord."
                        : "Launch the client application on your gaming PC and paste this key. It will bind permanently to your device."}
                    </p>

                    {isLicenseActive(lic) && (
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleClientDownload(isPeaceCleanerLicense(lic) ? "PC" : "ESM")}
                          disabled={isDownloading}
                          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white border border-zinc-800 text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all disabled:cursor-wait disabled:opacity-60 hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                          <Download className={`h-3.5 w-3.5 text-[#E53935] ${isDownloading ? "animate-pulse" : ""}`} />
                          <span>
                            {isDownloading
                              ? "Preparing download…"
                              : `Download ${isPeaceCleanerLicense(lic) ? "Peace Cleaner (.rar)" : "RedLine (.rar)"}`}
                          </span>
                        </button>
                        <p className="text-[11px] text-zinc-500 text-center font-mono">
                          File password: <span className="font-semibold text-[#E53935]">RL2026</span>
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
        <h2 className="text-xl font-bold text-black font-mono flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#E53935]" />
          <span>ORDER STATUS & GCASH VERIFICATION</span>
          <span className="text-xs font-normal text-zinc-500 font-mono tabular-nums">
            ({orders.length})
          </span>
        </h2>

        {loadError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-[#E53935] font-mono"
          >
            {loadError}
          </div>
        )}

        {isLoading ? (
          <p className="text-xs text-zinc-500 font-mono">Loading your order history…</p>
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
                  className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">{ord.order_number}</span>
                    {ord.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E53935] animate-pulse" />
                        Pending Review
                      </span>
                    )}
                    {ord.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {ord.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] border border-red-200 text-[10px]">
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-zinc-800">
                    <span>{ord.tier}</span>
                    <span className="text-[#E53935] font-bold tabular-nums">
                      ₱{ord.amount.toLocaleString()} PHP
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 text-[11px] pt-1 border-t border-zinc-100">
                    <span>GCash Ref: {ord.reference_number}</span>
                    <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                  </div>

                  {ord.license_key && (
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase">Key:</span>
                      <code className="text-emerald-700 font-bold select-all text-xs break-all">
                        {ord.license_key}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 text-zinc-600 uppercase text-[10px] tracking-wider border-b border-zinc-200">
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
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-black tabular-nums">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-800">{ord.tier}</td>
                      <td className="py-3.5 px-4 text-black font-bold tabular-nums">
                        ₱{ord.amount.toLocaleString()} PHP
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 tabular-nums">
                        {ord.reference_number}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E53935] animate-pulse" />
                            Pending Review
                          </span>
                        )}
                        {ord.status === "approved" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            <Check className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {ord.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] border border-red-200 text-[10px]">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.license_key ? (
                          <code className="text-emerald-700 font-bold">
                            {ord.license_key}
                          </code>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px] tabular-nums">
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
      <section className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 font-mono text-xs shadow-sm">
        <h3 className="text-sm font-bold text-black flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#E53935]" />
          <span>HOW TO LAUNCH & ACTIVATE RED LINE VIP</span>
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-zinc-600 leading-relaxed font-sans text-xs">
          <li>
            Download the client bundle using the button above (unlocked once your VIP order is approved) and extract it to a clean folder.
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
            Launch Assault Fire PH in Windowed or Borderless mode. The tactical overlay attaches automatically upon launch!
          </li>
          <li>
            Press <code className="text-black font-bold bg-zinc-200 border border-zinc-300 px-1.5 py-0.5 rounded font-mono">[INSERT]</code> to toggle the overlay on/off, and <code className="text-black font-bold bg-zinc-200 border border-zinc-300 px-1.5 py-0.5 rounded font-mono">[END]</code> to close safely.
          </li>
        </ol>
      </section>
    </div>
  );
}
