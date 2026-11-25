"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Ban,
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Cpu,
  DollarSign,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  UsersRound,
  Volume2,
  VolumeX,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  discord_id: string;
  discord_username: string;
  tier: string;
  amount: number;
  reference_number: string;
  sender_name: string | null;
  receipt_url: string | null;
  status: "pending" | "approved" | "rejected";
  license_key: string | null;
  created_at: string;
}

interface License {
  id: string;
  license_key: string;
  hwid: string | null;
  discord_id: string | null;
  discord_username: string | null;
  tier: string;
  notes: string | null;
  expires_at: string | null;
  is_banned: boolean;
  created_at: string;
}

interface SystemSettings {
  id: string;
  min_client_version: string;
  latest_client_version: string;
  download_url: string;
  peace_cleaner_min_version?: string;
  peace_cleaner_latest_version?: string;
  peace_cleaner_download_url?: string;
  enforce_version_check: boolean;
  table_exists?: boolean;
}

type AdminView = "overview" | "orders" | "licenses" | "settings";
type Notice = { tone: "success" | "error" | "info"; message: string } | null;

const navigation: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Wallet },
  { id: "licenses", label: "Licenses", icon: KeyRound },
  { id: "settings", label: "Version & Updates", icon: Activity },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

function formatTimeRemaining(value: string) {
  const exp = new Date(value).getTime();
  const diff = exp - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m left`;
}

function Sidebar({
  view,
  onNavigate,
  pendingCount,
  onLogout,
}: {
  view: AdminView;
  onNavigate: (view: AdminView) => void;
  pendingCount: number;
  onLogout: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-zinc-200 bg-white lg:flex">
      <a href="/staff-vault" className="flex h-[76px] items-center gap-3 border-b border-zinc-200 px-6">
        <div className="flex h-8 items-center justify-center">
          <img src="/logo.png" alt="Assault Fire" className="h-6 w-auto max-w-[85px] object-contain drop-shadow-sm" />
        </div>
        <span>
          <span className="block text-sm font-black tracking-tight text-black font-sans">ASSAULT FIRE</span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Admin workspace
          </span>
        </span>
      </a>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
          Workspace
        </p>
        <nav aria-label="Admin navigation" className="space-y-1">
          {navigation.map(({ id, label, icon: Icon }) => {
            const selected = view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={selected ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] ${selected
                    ? "bg-red-50 text-[#E53935] border border-red-200 shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                  }`}
              >
                <Icon className={`h-[17px] w-[17px] ${selected ? "text-[#E53935]" : "text-zinc-500"}`} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {id === "orders" && pendingCount > 0 && (
                  <span className="min-w-5 rounded-full bg-[#E53935] px-1.5 py-0.5 text-center text-[10px] font-bold tabular-nums text-white font-mono">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-zinc-200 p-4">
        <a
          href="/"
          className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black"
        >
          <ArrowUpRight className="h-4 w-4 text-zinc-500" />
          View storefront
        </a>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold text-black">Admin session</span>
            <span className="mt-0.5 block text-[10px] font-medium text-emerald-600 font-mono">Authenticated</span>
          </span>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  accent = "zinc",
  onClick,
  isActive,
}: {
  label: string;
  value: string;
  detail: string;
  icon: any;
  accent?: "red" | "amber" | "green" | "blue" | "purple" | "zinc";
  onClick?: () => void;
  isActive?: boolean;
}) {
  const accentClasses = {
    red: "text-[#E53935] bg-red-50 border border-red-200",
    amber: "text-amber-700 bg-amber-50 border border-amber-200",
    green: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    blue: "text-sky-700 bg-sky-50 border border-sky-200",
    purple: "text-purple-700 bg-purple-50 border border-purple-200",
    zinc: "text-zinc-700 bg-zinc-100 border border-zinc-200",
  }[accent || "zinc"];

  const Component = onClick ? "button" : "article";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`min-w-0 w-full rounded-2xl border bg-white p-4 sm:p-5 shadow-sm text-left transition-all ${
        onClick
          ? "cursor-pointer hover:border-zinc-300 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          : ""
      } ${
        isActive
          ? "border-black ring-2 ring-black bg-zinc-50/70 shadow-md"
          : "border-zinc-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold text-zinc-600 truncate">{label}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${accentClasses}`}>
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 truncate text-[24px] font-black leading-none tracking-tight text-black tabular-nums font-mono sm:text-[28px]">
        {value}
      </p>
      <div className="mt-2 flex items-center justify-between gap-1">
        <p className="truncate text-[11px] font-medium text-zinc-500">{detail}</p>
        {onClick && isActive && (
          <span className="shrink-0 rounded-md bg-black px-1.5 py-0.5 text-[9px] font-bold font-mono text-white">
            Filtered
          </span>
        )}
      </div>
    </Component>
  );
}

function RevenueChart({ points }: { points: { label: string; value: number }[] }) {
  const width = 720;
  const height = 244;
  const left = 64;
  const right = 704;
  const top = 18;
  const bottom = 194;
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const coordinates = points.map((point, index) => ({
    ...point,
    x: left + (index * (right - left)) / Math.max(1, points.length - 1),
    y: bottom - (point.value / maxValue) * (bottom - top),
  }));
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${bottom} ${line} ${right},${bottom}`;
  const ticks = [0, 1, 2, 3].map((step) => (maxValue * step) / 3);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-bold text-black font-sans">Approved revenue</h2>
          <p className="mt-1 text-[11px] text-zinc-500">Daily totals · last 7 days</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 font-mono">
          <span className="h-2 w-2 rounded-full bg-[#E53935]" />
          PHP
        </span>
      </div>
      <div className="mt-5 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Approved revenue by day over the last seven days"
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E53935" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#E53935" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((tick, index) => {
            const y = bottom - (index / 3) * (bottom - top);
            return (
              <g key={index}>
                <line x1={left} x2={right} y1={y} y2={y} stroke="#e4e4e7" strokeDasharray="3 3" />
                <text x={left - 10} y={y + 4} textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">
                  {Math.round(tick).toLocaleString()}
                </text>
              </g>
            );
          })}
          {coordinates.length > 1 && (
            <polygon points={area} fill="url(#revenue-fill)" />
          )}
          <polyline
            points={line}
            fill="none"
            stroke="#E53935"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {coordinates.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4" fill="#ffffff" stroke="#E53935" strokeWidth="2.5" />
              <title>{`${point.label}: ${formatCurrency(point.value)}`}</title>
              <text x={point.x} y={bottom + 24} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {points.every((point) => point.value === 0) && (
        <p className="mt-2 text-center text-[11px] text-zinc-500 font-mono">
          No approved revenue recorded in this period.
        </p>
      )}
    </div>
  );
}

function PlanBreakdown({ licenses }: { licenses: License[] }) {
  const plans = licenses.reduce<Record<string, number>>((counts, license) => {
    counts[license.tier] = (counts[license.tier] || 0) + 1;
    return counts;
  }, {});
  const entries = Object.entries(plans).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maximum = Math.max(1, ...entries.map(([, count]) => count));

  return (
    <div>
      <div>
        <h2 className="text-[14px] font-bold text-black font-sans">License mix</h2>
        <p className="mt-1 text-[11px] text-zinc-500">Issued licenses by plan</p>
      </div>
      {entries.length === 0 ? (
        <p className="py-12 text-center text-[12px] text-zinc-500">No licenses to report yet.</p>
      ) : (
        <div className="mt-7 space-y-5">
          {entries.map(([tier, count]) => (
            <div key={tier}>
              <div className="mb-2 flex items-center justify-between gap-3 text-[12px]">
                <span className="truncate font-medium text-zinc-700">{tier}</span>
                <span className="shrink-0 font-bold tabular-nums text-black font-mono">{count}</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-zinc-100"
                role="meter"
                aria-label={`${tier} licenses`}
                aria-valuemin={0}
                aria-valuemax={maximum}
                aria-valuenow={count}
              >
                <div
                  className="h-full rounded-full bg-[#E53935] transition-[width] duration-300"
                  style={{ width: `${(count / maximum) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-7 flex items-center justify-between border-t border-zinc-200 pt-4 text-[11px]">
        <span className="text-zinc-500">Total issued</span>
        <span className="font-bold tabular-nums text-black font-mono">{licenses.length}</span>
      </div>
    </div>
  );
}

function OrdersTable({
  orders,
  onApprove,
  onReject,
  onViewReceipt,
}: {
  orders: Order[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewReceipt: (url: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Wallet className="mx-auto h-6 w-6 text-zinc-400" />
        <p className="mt-3 text-sm font-semibold text-black">No matching orders</p>
        <p className="mt-1 text-xs text-zinc-500">Try another search or check back when a customer places an order.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-[12px]">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
          <tr>
            <th className="px-4 py-3 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Plan / amount</th>
            <th className="px-4 py-3 font-semibold">Reference</th>
            <th className="px-4 py-3 font-semibold">Proof</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-zinc-50/80">
              <td className="px-4 py-3.5">
                <span className="font-bold text-black font-mono">{order.order_number}</span>
                <span className="mt-1 block text-[10px] text-zinc-500 font-mono">{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="block max-w-[150px] truncate font-semibold text-black">{order.discord_username}</span>
                <span className="mt-1 block text-[10px] text-zinc-500 font-mono">{order.discord_id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="block font-medium text-zinc-700">{order.tier}</span>
                <span className="mt-1 block font-bold tabular-nums text-black font-mono">{formatCurrency(Number(order.amount) || 0)}</span>
              </td>
              <td className="px-4 py-3.5">
                <code className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-mono text-zinc-800">{order.reference_number}</code>
                {order.sender_name && <span className="mt-1 block text-[10px] text-zinc-500">From {order.sender_name}</span>}
              </td>
              <td className="px-4 py-3.5">
                {order.receipt_url ? (
                  <button
                    type="button"
                    onClick={() => onViewReceipt(order.receipt_url!)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm transition-colors hover:border-[#E53935] hover:text-[#E53935] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                ) : <span className="text-zinc-400 font-mono text-[11px]">No proof</span>}
              </td>
              <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
              <td className="px-4 py-3.5">
                {order.status === "pending" ? (
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onApprove(order.id)}
                      aria-label={`Approve ${order.order_number}`}
                      title="Approve and issue license"
                      className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(order.id)}
                      aria-label={`Reject ${order.order_number}`}
                      title="Reject order"
                      className="rounded-lg p-2 text-[#E53935] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="block max-w-[140px] truncate text-right text-[10px] font-mono text-zinc-500">
                    {order.license_key || "Resolved"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-[#E53935]",
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold font-mono capitalize ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function LicensesTable({
  licenses,
  copiedKey,
  onCopy,
  onResetHwid,
  onToggleBan,
  onDelete,
}: {
  licenses: License[];
  copiedKey: string | null;
  onCopy: (key: string) => void;
  onResetHwid: (key: string) => void;
  onToggleBan: (key: string, isBanned: boolean) => void;
  onDelete: (key: string) => void;
}) {
  if (licenses.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <KeyRound className="mx-auto h-6 w-6 text-zinc-400" />
        <p className="mt-3 text-sm font-semibold text-black">No matching licenses</p>
        <p className="mt-1 text-xs text-zinc-500">Try another search or issue a license to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-[12px]">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
          <tr>
            <th className="px-4 py-3 font-semibold">License key</th>
            <th className="px-4 py-3 font-semibold">Plan</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Hardware ID</th>
            <th className="px-4 py-3 font-semibold">Expires</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {licenses.map((license) => {
            const expTime = license.expires_at ? new Date(license.expires_at).getTime() : null;
            const now = Date.now();
            const isExpired = !license.is_banned && expTime !== null && expTime <= now;
            const isExpiringSoon = !license.is_banned && expTime !== null && expTime > now && (expTime - now) <= 7 * 24 * 60 * 60 * 1000;
            return (
              <tr
                key={license.id}
                className={`transition-colors hover:bg-zinc-50/80 ${license.is_banned
                    ? "bg-red-50/50"
                    : isExpired
                      ? "bg-zinc-50/60"
                      : isExpiringSoon
                        ? "bg-amber-50/40"
                        : ""
                  }`}
              >
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2">
                    <code className="font-mono font-bold text-black">{license.license_key}</code>
                    <button
                      type="button"
                      onClick={() => onCopy(license.license_key)}
                      aria-label={`Copy ${license.license_key}`}
                      className="rounded-md p-1 text-zinc-500 hover:text-black hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                    >
                      {copiedKey === license.license_key ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </span>
                </td>
                <td className="px-4 py-3.5 text-zinc-700 font-medium">{license.tier}</td>
                <td className="px-4 py-3.5">
                  <span className="block font-semibold text-black">{license.discord_username || "Unassigned"}</span>
                  <span className="mt-1 block text-[10px] text-zinc-500 font-mono">{license.discord_id || "No Discord ID"}</span>
                </td>
                <td className="px-4 py-3.5">
                  {license.hwid ? (
                    <code title={license.hwid} className="block max-w-[130px] truncate text-[11px] font-mono text-zinc-700">{license.hwid}</code>
                  ) : <span className="text-zinc-400 font-mono text-[11px]">Not bound</span>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-mono text-[11px]">
                    {license.expires_at ? (
                      <div>
                        <span className={isExpired ? "text-zinc-400 line-through" : isExpiringSoon ? "text-amber-800 font-bold" : "text-zinc-600"}>
                          {formatDate(license.expires_at)}
                        </span>
                        {isExpiringSoon && (
                          <span className="block text-[10px] font-semibold text-amber-600">
                            {formatTimeRemaining(license.expires_at)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-purple-700">
                        <Sparkles className="h-3 w-3" />
                        Lifetime
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono border ${license.is_banned
                        ? "border-red-200 bg-red-50 text-[#E53935]"
                        : isExpired
                          ? "border-zinc-200 bg-zinc-100 text-zinc-600"
                          : isExpiringSoon
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${license.is_banned
                          ? "bg-[#E53935]"
                          : isExpired
                            ? "bg-zinc-400"
                            : isExpiringSoon
                              ? "bg-amber-500 animate-pulse"
                              : "bg-emerald-500"
                        }`}
                    />
                    {license.is_banned ? "Banned" : isExpired ? "Expired" : isExpiringSoon ? "Expiring soon" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => onResetHwid(license.license_key)} aria-label={`Reset hardware lock for ${license.license_key}`} title="Reset hardware lock" className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onToggleBan(license.license_key, license.is_banned)} aria-label={`${license.is_banned ? "Unban" : "Ban"} ${license.license_key}`} title={license.is_banned ? "Unban license" : "Ban license"} className="rounded-lg p-2 text-zinc-600 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onDelete(license.license_key)} aria-label={`Delete ${license.license_key}`} title="Delete license" className="rounded-lg p-2 text-zinc-600 hover:bg-red-50 hover:text-[#E53935] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VersionSettingsView({
  settings,
  onSave,
  isSaving,
}: {
  settings: SystemSettings;
  onSave: (updated: SystemSettings) => Promise<void>;
  isSaving: boolean;
}) {
  const [minVer, setMinVer] = useState(settings.min_client_version);
  const [latestVer, setLatestVer] = useState(settings.latest_client_version);
  const [dlUrl, setDlUrl] = useState(settings.download_url);
  const [pcMinVer, setPcMinVer] = useState(settings.peace_cleaner_min_version || "1.0.1");
  const [pcLatestVer, setPcLatestVer] = useState(settings.peace_cleaner_latest_version || "1.0.1");
  const [pcDlUrl, setPcDlUrl] = useState(settings.peace_cleaner_download_url || "https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe");
  const [enforce, setEnforce] = useState(settings.enforce_version_check);

  useEffect(() => {
    setMinVer(settings.min_client_version);
    setLatestVer(settings.latest_client_version);
    setDlUrl(settings.download_url);
    setPcMinVer(settings.peace_cleaner_min_version || "1.0.1");
    setPcLatestVer(settings.peace_cleaner_latest_version || "1.0.1");
    setPcDlUrl(settings.peace_cleaner_download_url || "https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe");
    setEnforce(settings.enforce_version_check);
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSave({
      ...settings,
      min_client_version: minVer,
      latest_client_version: latestVer,
      download_url: dlUrl,
      peace_cleaner_min_version: pcMinVer,
      peace_cleaner_latest_version: pcLatestVer,
      peace_cleaner_download_url: pcDlUrl,
      enforce_version_check: enforce,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-[15px] font-bold text-black flex items-center gap-2 font-sans">
              <Activity className="h-4 w-4 text-[#E53935]" /> Client Version & Live Update Control
            </h2>
            <p className="mt-1 text-[12px] text-zinc-500">
              Manage version requirements and auto-download links independently for Assault Fire VIP and Peace Cleaner.
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono border ${enforce ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${enforce ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {enforce ? "Enforcement Active" : "Enforcement Paused"}
          </span>
        </div>

        {settings.table_exists === false && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] text-amber-800">
            <strong>Database Notice:</strong> The <code>esm_settings</code> table has not been initialized yet in Supabase. Please copy and run <code>web/schema_settings.sql</code> in your Supabase SQL Editor to save settings permanently.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* Assault Fire VIP Section */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
            <div className="border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 font-sans">
                <span className="h-2 w-2 rounded-full bg-[#E53935]" /> Assault Fire VIP Client (svchost.exe)
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Controls version gating for keys starting with <code>RL-</code> and <code>ESM-</code>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-zinc-700">
                  Minimum Required Version
                </label>
                <input
                  type="text"
                  value={minVer}
                  onChange={(e) => setMinVer(e.target.value)}
                  placeholder="e.g. 1.0.3"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Clients below this will auto-update or be blocked.
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-zinc-700">
                  Latest Build Version
                </label>
                <input
                  type="text"
                  value={latestVer}
                  onChange={(e) => setLatestVer(e.target.value)}
                  placeholder="e.g. 1.0.3"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Displayed as the latest available build in the terminal.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-zinc-700">
                Assault Fire Direct Download URL
              </label>
              <input
                type="url"
                value={dlUrl}
                onChange={(e) => setDlUrl(e.target.value)}
                placeholder="https://.../updates/svchost.exe"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
              />
              <p className="mt-1 text-[11px] text-zinc-500">
                Direct link to <code>svchost.exe</code> in Supabase storage for the silent in-app auto-updater.
              </p>
            </div>
          </div>

          {/* Peace Cleaner Section */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
            <div className="border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 font-sans">
                <span className="h-2 w-2 rounded-full bg-[#E53935]" /> Peace Cleaner (PeaceCleaner.exe)
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Controls version gating for keys starting with <code>PC-</code>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-zinc-700">
                  Minimum Required Version
                </label>
                <input
                  type="text"
                  value={pcMinVer}
                  onChange={(e) => setPcMinVer(e.target.value)}
                  placeholder="e.g. 1.0.1"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Peace Cleaner builds below this will prompt the user to download the update.
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-zinc-700">
                  Latest Build Version
                </label>
                <input
                  type="text"
                  value={pcLatestVer}
                  onChange={(e) => setPcLatestVer(e.target.value)}
                  placeholder="e.g. 1.0.1"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Latest published build version for Peace Cleaner.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-zinc-700">
                Peace Cleaner Download URL
              </label>
              <input
                type="url"
                value={pcDlUrl}
                onChange={(e) => setPcDlUrl(e.target.value)}
                placeholder="https://.../updates/PeaceCleaner.exe"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
              />
              <p className="mt-1 text-[11px] text-zinc-500">
                Direct link to <code>PeaceCleaner.exe</code> in Supabase storage (opened in browser when outdated).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="enforceCheck"
              checked={enforce}
              onChange={(e) => setEnforce(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-[#E53935] focus:ring-[#E53935]"
            />
            <label htmlFor="enforceCheck" className="text-[13px] font-semibold text-zinc-800 cursor-pointer select-none">
              Strictly enforce minimum client version on license authentication
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-[13px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50"
            >
              {isSaving ? "Saving Settings..." : "Save Version Settings"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    id: "global",
    min_client_version: "1.0.0",
    latest_client_version: "1.0.0",
    download_url: "https://discord.gg/Whwxq9QAEN",
    enforce_version_check: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (updated: SystemSettings) => {
    setIsSavingSettings(true);
    setNotice(null);
    try {
      const data = await postAdminAction("/api/admin/settings", updated as unknown as Record<string, unknown>);
      if (data.settings) setSettings(data.settings);
      setNotice({
        tone: "success",
        message: "Version enforcement settings saved successfully!",
      });
    } catch (err: any) {
      setNotice({
        tone: "error",
        message: err.message || "Failed to save version settings.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };
  const [view, setView] = useState<AdminView>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [licenseFilter, setLicenseFilter] = useState<"all" | "active" | "expiring" | "expired" | "lifetime" | "bound" | "banned">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [showGenModal, setShowGenModal] = useState(false);
  const [genProduct, setGenProduct] = useState<"ESM" | "PC">("ESM");
  const [genTier, setGenTier] = useState("Monthly VIP");
  const [genDays, setGenDays] = useState("30");
  const [genDiscordId, setGenDiscordId] = useState("");
  const [genDiscordUsername, setGenDiscordUsername] = useState("");
  const [genNotes, setGenNotes] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live order alerts & background sync
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [latestOrderAlert, setLatestOrderAlert] = useState<Order | null>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Synthesized chime using native Web Audio API (zero external asset latency)
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const now = ctx.currentTime;

      // Two-tone bright notification ping (E5 -> B5 harmonic rise)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.35);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.32, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.65);
    } catch (err) {
      console.warn("Unable to play order chime:", err);
    }
  };

  const triggerOrderNotification = (newOrder: Order) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(`⚡ New Order: ${newOrder.tier} (₱${newOrder.amount.toLocaleString()})`, {
          body: `Buyer: ${newOrder.discord_username || "Anonymous"} | Ref: ${newOrder.reference_number || "None"}. Click to review payment.`,
          icon: "/favicon.ico",
          tag: `order-${newOrder.id}`,
        });
        notif.onclick = () => {
          window.focus();
          setView("orders");
        };
      } catch (e) {
        console.warn("Failed to trigger desktop notification:", e);
      }
    }
  };

  const handleToggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission === "granted") {
      setNotice({ tone: "info", message: "Desktop notifications are already enabled." });
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        setNotice({ tone: "success", message: "Desktop notifications enabled! You will be alerted when orders arrive." });
        try {
          new Notification("Assault Fire VIP", {
            body: "Live order alerts are now enabled.",
            icon: "/favicon.ico",
          });
        } catch {
          // ignore test alert
        }
      } else {
        setNotice({ tone: "info", message: "Desktop notifications permission was dismissed or blocked." });
      }
    } catch (err) {
      console.warn("Notification request failed:", err);
    }
  };

  // Sync notification permission state on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Auto-dismiss floating order alert after 15 seconds
  useEffect(() => {
    if (!latestOrderAlert) return;
    const timer = setTimeout(() => {
      setLatestOrderAlert(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, [latestOrderAlert]);

  // Silent background polling function without loading spinners
  const pollAdminOrders = async () => {
    if (!adminSecret || !isAuthenticated) return;
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (!res.ok) return;
      const data = await res.json();
      const fetchedOrders: Order[] = data.orders || [];

      // Detect any new pending orders that arrived since last check
      const newPendingOrders: Order[] = [];
      for (const o of fetchedOrders) {
        if (!knownOrderIdsRef.current.has(o.id)) {
          knownOrderIdsRef.current.add(o.id);
          if (o.status === "pending") {
            newPendingOrders.push(o);
          }
        }
      }

      setOrders(fetchedOrders);

      if (newPendingOrders.length > 0) {
        const newest = newPendingOrders[0];
        setLatestOrderAlert(newest);
        if (soundEnabled) {
          playOrderChime();
        }
        triggerOrderNotification(newest);
      }
    } catch {
      // Silent catch on background polling
    }
  };

  // Auto-refresh interval (every 6 seconds while authenticated & enabled)
  useEffect(() => {
    if (!isAuthenticated || !autoRefreshEnabled || !adminSecret) return;
    const interval = setInterval(() => {
      void pollAdminOrders();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefreshEnabled, adminSecret, soundEnabled]);

  useEffect(() => {
    const saved = sessionStorage.getItem("esm_admin_secret");
    if (saved) {
      setAdminSecret(saved);
      void verifySecret(saved);
    }
  }, []);

  const loadAdminData = async (secret: string = adminSecret) => {
    setIsLoading(true);
    setDashboardError("");
    try {
      const [ordersResponse, licensesResponse, settingsResponse] = await Promise.all([
        fetch("/api/admin/orders", { headers: { "x-admin-secret": secret } }),
        fetch("/api/admin/licenses", { headers: { "x-admin-secret": secret } }),
        fetch("/api/admin/settings", { headers: { "x-admin-secret": secret } }),
      ]);
      const [ordersData, licensesData, settingsData] = await Promise.all([
        ordersResponse.json(),
        licensesResponse.json(),
        settingsResponse.json(),
      ]);

      if (!ordersResponse.ok) {
        throw new Error(ordersData.error || "Could not load orders.");
      }
      if (!licensesResponse.ok) {
        throw new Error(licensesData.error || "Could not load licenses.");
      }

      const loadedOrders: Order[] = ordersData.orders || [];
      setOrders(loadedOrders);
      // Seed known order IDs so initial load doesn't trigger alerts
      if (isInitialLoadRef.current) {
        knownOrderIdsRef.current = new Set(loadedOrders.map((o) => o.id));
        isInitialLoadRef.current = false;
      }
      setLicenses(licensesData.licenses || []);
      if (settingsData && settingsData.settings) {
        setSettings(settingsData.settings);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load admin data.";
      setDashboardError(message);
      console.error("Admin data load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifySecret = async (secret: string) => {
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const response = await fetch("/api/admin/orders", {
        headers: { "x-admin-secret": secret },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Admin access could not be verified.");
      }

      sessionStorage.setItem("esm_admin_secret", secret);
      setIsAuthenticated(true);
      await loadAdminData(secret);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not verify admin access.";
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const refreshData = () => {
    setNotice(null);
    void loadAdminData();
  };

  const postAdminAction = async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "The action could not be completed.");
    }
    return data;
  };

  const runAction = async (
    action: () => Promise<{ message?: string }>,
    fallbackMessage: string
  ) => {
    setNotice(null);
    try {
      const result = await action();
      setNotice({ tone: "success", message: result.message || fallbackMessage });
      await loadAdminData();
    } catch (error) {
      const message = error instanceof Error ? error.message : fallbackMessage;
      setNotice({ tone: "error", message });
    }
  };

  const handleApproveOrder = (orderId: string) => {
    if (!window.confirm("Approve this order and generate its VIP license?")) return;
    void runAction(
      () => postAdminAction("/api/orders/action", {
        order_id: orderId,
        action: "approve",
        reviewer: "Web Admin",
      }),
      "Order approved."
    );
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = window.prompt("Reason for rejection (optional):", "Invalid reference number or receipt");
    if (reason === null) return;
    void runAction(
      () => postAdminAction("/api/orders/action", {
        order_id: orderId,
        action: "reject",
        admin_notes: reason,
        reviewer: "Web Admin",
      }),
      "Order rejected."
    );
  };

  const handleResetHwid = (key: string) => {
    if (!window.confirm(`Clear the hardware lock for ${key}?`)) return;
    void runAction(
      () => postAdminAction("/api/admin/licenses", { action: "reset_hwid", license_key: key }),
      "Hardware lock reset."
    );
  };

  const handleToggleBan = (key: string, isBanned: boolean) => {
    const nextStatus = !isBanned;
    if (!window.confirm(`${nextStatus ? "Ban" : "Unban"} license ${key}?`)) return;
    void runAction(
      () => postAdminAction("/api/admin/licenses", {
        action: "toggle_ban",
        license_key: key,
        is_banned: nextStatus,
      }),
      `License ${nextStatus ? "banned" : "unbanned"}.`
    );
  };

  const handleDeleteLicense = (key: string) => {
    if (!window.confirm(`Permanently delete ${key}? This cannot be undone.`)) return;
    void runAction(
      () => postAdminAction("/api/admin/licenses", { action: "delete", license_key: key }),
      "License deleted."
    );
  };

  const handleGenerateManualKey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    try {
      const result = await postAdminAction("/api/admin/licenses", {
        action: "generate",
        prefix: genProduct,
        tier: genTier,
        duration_days: genDays,
        discord_id: genDiscordId.trim() || null,
        discord_username: genDiscordUsername.trim() || null,
        notes: genNotes.trim() || "Manual Admin Generation",
      });
      setShowGenModal(false);
      setNotice({
        tone: "success",
        message: `License ${result.license.license_key} created successfully.`,
      });
      setGenDiscordId("");
      setGenDiscordUsername("");
      setGenNotes("");
      await loadAdminData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "The license could not be created.";
      setNotice({ tone: "error", message });
    }
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch (error) {
      setNotice({ tone: "error", message: "Could not copy the license key. Check clipboard permissions." });
      console.error("License key copy failed:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("esm_admin_secret");
    setAdminSecret("");
    setIsAuthenticated(false);
    setOrders([]);
    setLicenses([]);
    setView("overview");
    setDashboardError("");
    setNotice(null);
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const approvedOrders = orders.filter((order) => order.status === "approved");
  const resolvedOrders = orders.filter((order) => order.status !== "pending");
  const totalRevenue = approvedOrders.reduce((total, order) => total + (Number(order.amount) || 0), 0);
  const isLicenseActive = (lic: License) => {
    if (lic.is_banned) return false;
    if (!lic.expires_at) return true;
    return new Date(lic.expires_at).getTime() > Date.now();
  };
  const isLicenseExpiringSoon = (lic: License) => {
    if (lic.is_banned) return false;
    if (!lic.expires_at) return false;
    const exp = new Date(lic.expires_at).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return exp > now && exp <= now + sevenDaysMs;
  };

  const activeLicenses = licenses.filter(isLicenseActive);
  const expiringLicenses = licenses.filter(isLicenseExpiringSoon);
  const expiredLicenses = licenses.filter(
    (lic) => !lic.is_banned && !!lic.expires_at && new Date(lic.expires_at).getTime() <= Date.now()
  );
  const bannedLicenses = licenses.filter((lic) => lic.is_banned);
  const lifetimeLicenses = licenses.filter((license) => !license.expires_at && !license.is_banned);
  const boundLicenses = licenses.filter((lic) => !!lic.hwid);
  const unboundLicenses = licenses.filter((lic) => !lic.hwid);
  const approvalRate = resolvedOrders.length
    ? Math.round((approvedOrders.length / resolvedOrders.length) * 100)
    : 0;

  const revenuePoints = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        date,
        label: date.toLocaleDateString("en-PH", { weekday: "short" }),
        value: 0,
      };
    });

    for (const order of approvedOrders) {
      const createdAt = new Date(order.created_at);
      if (Number.isNaN(createdAt.getTime())) continue;
      createdAt.setHours(0, 0, 0, 0);
      const day = days.find((item) => item.date.getTime() === createdAt.getTime());
      if (day) day.value += Number(order.amount) || 0;
    }

    return days.map(({ label, value }) => ({ label, value }));
  }, [orders, approvedOrders]);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      order.order_number.toLowerCase().includes(term) ||
      order.discord_username.toLowerCase().includes(term) ||
      order.reference_number.toLowerCase().includes(term)
    );
  });
  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      if (licenseFilter === "active" && !isLicenseActive(license)) return false;
      if (licenseFilter === "expiring" && !isLicenseExpiringSoon(license)) return false;
      if (licenseFilter === "expired") {
        const isExp = !license.is_banned && !!license.expires_at && new Date(license.expires_at).getTime() <= Date.now();
        if (!isExp) return false;
      }
      if (licenseFilter === "lifetime" && (!!license.expires_at || license.is_banned)) return false;
      if (licenseFilter === "bound" && !license.hwid) return false;
      if (licenseFilter === "banned" && !license.is_banned) return false;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        license.license_key.toLowerCase().includes(term) ||
        (license.discord_username || "").toLowerCase().includes(term) ||
        (license.hwid || "").toLowerCase().includes(term) ||
        (license.tier || "").toLowerCase().includes(term) ||
        (license.discord_id || "").toLowerCase().includes(term)
      );
    });
  }, [licenses, licenseFilter, searchTerm]);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (!isAuthenticated) {
    return (
      <div className="admin-console min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-[#E53935] selection:text-white">
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.85fr)]">
          <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-zinc-200 bg-white p-10 lg:flex xl:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_22%,rgba(229,57,53,0.06),transparent_50%)]" />
            <a href="/" className="relative flex w-fit items-center gap-3">
              <div className="flex h-8 items-center justify-center">
                <img src="/logo.png" alt="Assault Fire" className="h-7 w-auto max-w-[95px] object-contain drop-shadow-sm" />
              </div>
              <span>
                <span className="block text-sm font-black tracking-tight text-black font-sans">ASSAULT FIRE</span>
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">Admin workspace</span>
              </span>
            </a>
            <div className="relative max-w-xl py-16">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E53935] font-mono">
                <Shield className="h-3.5 w-3.5" />
                Restricted access
              </div>
              <h1 className="max-w-[12ch] text-5xl font-black leading-[1.06] tracking-tight text-black font-sans xl:text-6xl">
                Operations, at a glance.
              </h1>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-7 text-zinc-600 font-sans">
                Review customer orders, track license activity, and manage access from one secure workspace.
              </p>
              <div className="mt-12 flex items-center gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 font-medium">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </span>
                <span>Admin credentials are validated by the server.</span>
              </div>
            </div>
            <p className="relative text-[11px] font-mono font-medium text-zinc-400">ASSAULT FIRE VIP · ADMINISTRATOR ACCESS</p>
          </section>

          <main className="flex min-h-screen flex-col bg-[#FAFAFA]">
            <header className="flex h-[72px] items-center justify-between border-b border-zinc-200 bg-white px-5 sm:px-8">
              <a href="/" className="flex items-center gap-2.5 lg:hidden">
                <div className="flex h-7 items-center justify-center">
                  <img src="/logo.png" alt="Assault Fire" className="h-6 w-auto max-w-[80px] object-contain drop-shadow-sm" />
                </div>
                <span className="text-xs font-black tracking-tight text-black font-sans">ASSAULT FIRE ADMIN</span>
              </a>
              <span className="hidden text-[12px] font-mono text-zinc-500 lg:inline">Secure sign in</span>
              <a href="/" className="ml-auto text-[12px] font-medium text-zinc-600 transition-colors hover:text-black">
                Back to storefront
              </a>
            </header>

            <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
              <div className="w-full max-w-[400px] rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-[#E53935] shadow-sm">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="text-[26px] font-black tracking-tight text-black font-sans">Sign in to admin</h2>
                <p className="mt-1.5 text-[13px] leading-6 text-zinc-600 font-sans">
                  Enter your administrator key to open the management workspace.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void verifySecret(adminSecret);
                  }}
                  className="mt-7 space-y-5"
                >
                  <div>
                    <label htmlFor="admin-secret" className="mb-2 block text-[12px] font-bold text-zinc-700">
                      Admin secret key
                    </label>
                    <div className="relative">
                      <input
                        id="admin-secret"
                        type={showSecret ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={adminSecret}
                        onChange={(event) => setAdminSecret(event.target.value)}
                        placeholder="Enter your secret key"
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3.5 pr-12 text-[14px] text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret((visible) => !visible)}
                        aria-label={showSecret ? "Hide admin secret" : "Show admin secret"}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] leading-5 text-[#E53935]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAuthenticating || !adminSecret.trim()}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 text-[13px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                  >
                    {isAuthenticating && <RefreshCw className="h-4 w-4 animate-spin text-[#E53935]" />}
                    {isAuthenticating ? "Verifying access..." : "Continue to admin"}
                  </button>
                </form>

                <p className="mt-7 border-t border-zinc-100 pt-5 text-[11px] leading-5 text-zinc-400 font-mono">
                  This area is restricted to authorized staff. Keep your admin key private.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const heading = {
    overview: "Overview",
    orders: "Orders",
    licenses: "Licenses",
    settings: "Version & Updates",
  }[view];

  return (
    <div className="admin-console min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-[#E53935] selection:text-white">
      <Sidebar
        view={view}
        onNavigate={(nextView) => {
          setView(nextView);
          setSearchTerm("");
          setNotice(null);
        }}
        pendingCount={pendingOrders.length}
        onLogout={handleLogout}
      />

      <main className="min-h-screen min-w-0 lg:ml-[252px]">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-black text-black font-sans">{heading}</p>
            <p className="mt-0.5 hidden text-[11px] text-zinc-500 font-mono sm:block">Assault Fire / Admin workspace</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${autoRefreshEnabled ? "animate-ping" : "hidden"}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${autoRefreshEnabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
              </span>
              <button
                type="button"
                onClick={() => setAutoRefreshEnabled((prev) => !prev)}
                title={autoRefreshEnabled ? "Auto-refreshing every 6s. Click to pause." : "Auto-refresh paused. Click to resume."}
                className="hover:underline font-mono"
              >
                {autoRefreshEnabled ? "Live 6s" : "Paused"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playOrderChime();
              }}
              title={soundEnabled ? "Order chime active (click to mute)" : "Order chime muted (click to enable)"}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] font-bold shadow-sm transition-all ${
                soundEnabled
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden xl:inline">{soundEnabled ? "Chime On" : "Muted"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleNotifications}
              title={
                notificationPermission === "granted"
                  ? "Desktop notifications are enabled"
                  : "Click to enable desktop order notifications"
              }
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] font-bold shadow-sm transition-all ${
                notificationPermission === "granted"
                  ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-zinc-200 bg-white text-zinc-500 hover:text-black"
              }`}
            >
              {notificationPermission === "granted" ? (
                <BellRing className="h-4 w-4 text-blue-600 animate-pulse" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              <span className="hidden xl:inline">
                {notificationPermission === "granted" ? "Alerts On" : "Enable Alerts"}
              </span>
            </button>

            <span className="hidden text-[11px] text-zinc-500 font-mono md:block">
              {new Date().toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <button
              type="button"
              onClick={refreshData}
              disabled={isLoading}
              aria-label="Refresh admin data"
              title="Refresh data"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] disabled:cursor-wait disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-[#E53935]" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowGenModal(true)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-black px-3.5 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:px-4"
            >
              <Plus className="h-4 w-4 text-[#E53935]" />
              <span className="hidden sm:inline">Issue license</span>
              <span className="sm:hidden">Issue</span>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-9">
          <nav aria-label="Admin navigation" className="mb-6 flex gap-1 overflow-x-auto border-b border-zinc-200 lg:hidden">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setView(id);
                  setSearchTerm("");
                  setNotice(null);
                }}
                aria-current={view === id ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] ${view === id
                    ? "border-[#E53935] text-[#E53935]"
                    : "border-transparent text-zinc-500 hover:text-black"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {id === "orders" && pendingOrders.length > 0 && (
                  <span className="rounded-full bg-[#E53935] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white font-mono">{pendingOrders.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-black tracking-tight text-black font-sans sm:text-[30px]">{heading}</h1>
              <p className="mt-1.5 max-w-[62ch] text-[12px] leading-5 text-zinc-600 font-sans">
                {view === "overview" && "A clear view of orders, revenue, and issued licenses."}
                {view === "orders" && "Review payment proof and resolve customer orders."}
                {view === "licenses" && "Manage issued keys, hardware bindings, and account status."}
                {view === "settings" && "Configure minimum client version and live update enforcement."}
              </p>
            </div>
            {view !== "overview" && view !== "settings" && (
              <label className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={`Search ${view}...`}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-[12px] text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                />
              </label>
            )}
          </div>

          {notice && (
            <div
              role={notice.tone === "error" ? "alert" : "status"}
              className={`mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[12px] font-medium ${notice.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : notice.tone === "info"
                  ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-red-200 bg-red-50 text-[#E53935]"
                }`}
            >
              {notice.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : notice.tone === "info" ? (
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E53935]" />
              )}
              <span>{notice.message}</span>
            </div>
          )}

          {dashboardError && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] text-[#E53935]">
              <span className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {dashboardError}
              </span>
              <button type="button" onClick={refreshData} className="font-bold underline underline-offset-4 hover:text-[#A71919]">Retry</button>
            </div>
          )}

          {isLoading && orders.length === 0 && licenses.length === 0 ? (
            <div className="space-y-5" aria-label="Loading admin data" aria-busy="true">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-[118px] animate-pulse rounded-2xl border border-zinc-200 bg-white shadow-sm" />
                ))}
              </div>
              <div className="h-[320px] animate-pulse rounded-2xl border border-zinc-200 bg-white shadow-sm" />
            </div>
          ) : view === "overview" ? (
            <div className="space-y-5">
              <section aria-label="Business measurements" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Metric
                  label="Approved revenue"
                  value={formatCurrency(totalRevenue)}
                  detail={`${approvedOrders.length} approved ${approvedOrders.length === 1 ? "order" : "orders"}`}
                  icon={DollarSign}
                  accent="green"
                />
                <Metric
                  label="Needs review"
                  value={String(pendingOrders.length)}
                  detail={pendingOrders.length ? "Payment verification required" : "Queue is clear"}
                  icon={Clock3}
                  accent="amber"
                />
                <Metric
                  label="Active licenses"
                  value={String(activeLicenses.length)}
                  detail={`${expiredLicenses.length} expired · ${bannedLicenses.length} banned`}
                  icon={UsersRound}
                  accent="blue"
                />
                <Metric
                  label="Approval rate"
                  value={`${approvalRate}%`}
                  detail={`${resolvedOrders.length} resolved orders`}
                  icon={Activity}
                  accent="red"
                />
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
                <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
                  <RevenueChart points={revenuePoints} />
                </div>
                <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
                  <PlanBreakdown licenses={licenses} />
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
                  <div>
                    <h2 className="text-[14px] font-bold text-black font-sans">Recent orders</h2>
                    <p className="mt-1 text-[11px] text-zinc-500">Latest customer activity</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("orders")}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                  >
                    All orders <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <OrdersTable
                  orders={recentOrders}
                  onApprove={handleApproveOrder}
                  onReject={handleRejectOrder}
                  onViewReceipt={setSelectedReceipt}
                />
              </section>
            </div>
          ) : view === "orders" ? (
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-[14px] font-bold text-black font-sans">Order queue</h2>
                  <p className="mt-1 text-[11px] text-zinc-500">{pendingOrders.length} awaiting review · {orders.length} total</p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Updated {new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <OrdersTable
                orders={filteredOrders}
                onApprove={handleApproveOrder}
                onReject={handleRejectOrder}
                onViewReceipt={setSelectedReceipt}
              />
            </section>
          ) : view === "licenses" ? (
            <div className="space-y-5">
              {/* Adaptive License Metric Cards */}
              <section aria-label="License statistics" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                <Metric
                  label="Total licenses"
                  value={String(licenses.length)}
                  detail={`${lifetimeLicenses.length} lifetime · ${activeLicenses.length - lifetimeLicenses.length} recurring`}
                  icon={KeyRound}
                  accent="zinc"
                  onClick={() => setLicenseFilter("all")}
                  isActive={licenseFilter === "all"}
                />
                <Metric
                  label="Active licenses"
                  value={String(activeLicenses.length)}
                  detail={licenses.length ? `${Math.round((activeLicenses.length / licenses.length) * 100)}% authorized` : "All systems active"}
                  icon={ShieldCheck}
                  accent="green"
                  onClick={() => setLicenseFilter(licenseFilter === "active" ? "all" : "active")}
                  isActive={licenseFilter === "active"}
                />
                <Metric
                  label="Expiring soon"
                  value={String(expiringLicenses.length)}
                  detail={expiringLicenses.length ? "Within next 7 days" : "No urgent expiries"}
                  icon={Clock3}
                  accent="amber"
                  onClick={() => setLicenseFilter(licenseFilter === "expiring" ? "all" : "expiring")}
                  isActive={licenseFilter === "expiring"}
                />
                <Metric
                  label="Expired licenses"
                  value={String(expiredLicenses.length)}
                  detail={expiredLicenses.length ? "Lapsed / unpaid renewal" : "Zero lapsed keys"}
                  icon={XCircle}
                  accent="red"
                  onClick={() => setLicenseFilter(licenseFilter === "expired" ? "all" : "expired")}
                  isActive={licenseFilter === "expired"}
                />
                <Metric
                  label="Lifetime VIP"
                  value={String(lifetimeLicenses.length)}
                  detail="Permanent authorization"
                  icon={Sparkles}
                  accent="purple"
                  onClick={() => setLicenseFilter(licenseFilter === "lifetime" ? "all" : "lifetime")}
                  isActive={licenseFilter === "lifetime"}
                />
                <Metric
                  label="Hardware locked"
                  value={String(boundLicenses.length)}
                  detail={`${unboundLicenses.length} unbound / available`}
                  icon={Cpu}
                  accent="blue"
                  onClick={() => setLicenseFilter(licenseFilter === "bound" ? "all" : "bound")}
                  isActive={licenseFilter === "bound"}
                />
              </section>

              {/* License Registry Section */}
              <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[14px] font-bold text-black font-sans">License registry</h2>
                      {licenseFilter !== "all" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold font-mono text-white">
                          Filter: {licenseFilter}
                          <button
                            type="button"
                            onClick={() => setLicenseFilter("all")}
                            className="hover:text-[#E53935]"
                            aria-label="Clear filter"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Showing {filteredLicenses.length} of {licenses.length} keys · {activeLicenses.length} active · {expiringLicenses.length} expiring soon · {expiredLicenses.length} expired
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Quick filter pills */}
                    <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setLicenseFilter("all")}
                        className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                          licenseFilter === "all" ? "bg-white text-black shadow-xs font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        All ({licenses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLicenseFilter("active")}
                        className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                          licenseFilter === "active" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        Active ({activeLicenses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLicenseFilter("expiring")}
                        className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                          licenseFilter === "expiring" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        Expiring ({expiringLicenses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLicenseFilter("expired")}
                        className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                          licenseFilter === "expired" ? "bg-white text-red-600 shadow-xs font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        Expired ({expiredLicenses.length})
                      </button>
                      {bannedLicenses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setLicenseFilter("banned")}
                          className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                            licenseFilter === "banned" ? "bg-white text-red-600 shadow-xs font-bold" : "text-zinc-500 hover:text-red-600"
                          }`}
                        >
                          Banned ({bannedLicenses.length})
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGenModal(true)}
                      className="inline-flex h-9 items-center gap-2 rounded-xl bg-black px-3.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#E53935]" /> Issue license
                    </button>
                  </div>
                </div>
                <LicensesTable
                  licenses={filteredLicenses}
                  copiedKey={copiedKey}
                  onCopy={handleCopyKey}
                  onResetHwid={handleResetHwid}
                  onToggleBan={handleToggleBan}
                  onDelete={handleDeleteLicense}
                />
              </section>
            </div>
          ) : (
            <VersionSettingsView settings={settings} onSave={handleSaveSettings} isSaving={isSavingSettings} />
          )}
        </div>
      </main>

      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Payment receipt"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedReceipt(null);
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E53935]" />
            <div className="mb-4 flex items-center justify-between gap-3 pb-3 border-b border-zinc-200">
              <div>
                <h2 className="text-base font-black text-black font-sans">Payment receipt</h2>
                <p className="mt-0.5 text-[11px] text-zinc-500">Customer-submitted payment proof</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close receipt"
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-2">
              <img src={selectedReceipt} alt="Customer payment receipt" className="max-h-[72vh] max-w-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {showGenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-license-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowGenModal(false);
          }}
        >
          <div className="my-auto w-full max-w-[480px] rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E53935]" />
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <h2 id="issue-license-title" className="text-[17px] font-black text-black font-sans">Issue a license</h2>
                <p className="mt-1 text-[12px] text-zinc-500">Create a key and optionally assign it to a Discord user.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowGenModal(false)}
                aria-label="Close form"
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateManualKey} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-zinc-700">Target Product</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGenProduct("ESM")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[12px] font-bold transition ${genProduct === "ESM"
                        ? "border-red-200 bg-red-50 text-[#E53935] shadow-sm"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-black"
                      }`}
                  >
                    <span>Assault Fire</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenProduct("PC")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[12px] font-bold transition ${genProduct === "PC"
                        ? "border-red-200 bg-red-50 text-[#E53935] shadow-sm"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-black"
                      }`}
                  >
                    <span>Peace Cleaner</span>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="license-tier" className="mb-1.5 block text-[12px] font-bold text-zinc-700">Plan</label>
                <select
                  id="license-tier"
                  value={genTier}
                  onChange={(event) => {
                    setGenTier(event.target.value);
                    if (event.target.value === "Lifetime VIP") setGenDays("0");
                    else if (event.target.value === "Monthly VIP") setGenDays("30");
                    else if (event.target.value === "Weekly VIP") setGenDays("7");
                    else if (event.target.value === "1 Day Trial") setGenDays("1");
                  }}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-[12px] font-medium text-black focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm"
                >
                  <option value="Monthly VIP">Monthly VIP · 30 days</option>
                  <option value="Lifetime VIP">Lifetime VIP · permanent</option>
                  <option value="Weekly VIP">Weekly VIP · 7 days</option>
                  <option value="1 Day Trial">1 Day Trial · 1 day</option>
                </select>
              </div>
              <div>
                <label htmlFor="license-duration" className="mb-1.5 block text-[12px] font-bold text-zinc-700">Duration in days <span className="font-normal text-zinc-400">(0 for lifetime)</span></label>
                <input id="license-duration" type="number" min="0" value={genDays} onChange={(event) => setGenDays(event.target.value)} className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-[12px] font-mono text-black focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="recipient-discord-id" className="mb-1.5 block text-[12px] font-bold text-zinc-700">Discord ID <span className="font-normal text-zinc-400">(optional)</span></label>
                  <input id="recipient-discord-id" type="text" value={genDiscordId} onChange={(event) => setGenDiscordId(event.target.value)} placeholder="User ID" className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-[12px] font-mono text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm" />
                </div>
                <div>
                  <label htmlFor="recipient-discord-name" className="mb-1.5 block text-[12px] font-bold text-zinc-700">Username <span className="font-normal text-zinc-400">(optional)</span></label>
                  <input id="recipient-discord-name" type="text" value={genDiscordUsername} onChange={(event) => setGenDiscordUsername(event.target.value)} placeholder="Discord username" className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-[12px] text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="license-notes" className="mb-1.5 block text-[12px] font-bold text-zinc-700">Admin notes <span className="font-normal text-zinc-400">(optional)</span></label>
                <input id="license-notes" type="text" value={genNotes} onChange={(event) => setGenNotes(event.target.value)} placeholder="Internal note" className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-[12px] text-black placeholder:text-zinc-400 focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] shadow-sm" />
              </div>
              <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
                <button type="button" onClick={() => setShowGenModal(false)} className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">Cancel</button>
                <button type="submit" className="h-10 rounded-xl bg-black px-4 text-[12px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
                  Create license
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Order Incoming Ping Toast */}
      {latestOrderAlert && (
        <aside
          aria-label="New order notification"
          className="fixed bottom-6 right-6 z-50 flex max-w-md animate-bounce items-center gap-3.5 rounded-2xl border-2 border-emerald-500 bg-black p-4 text-white shadow-2xl transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono">⚡ New Order Received!</p>
            <p className="truncate text-[13px] font-bold text-white">
              {latestOrderAlert.tier} • ₱{latestOrderAlert.amount.toLocaleString()}
            </p>
            <p className="truncate text-[11px] text-zinc-400 font-mono">
              {latestOrderAlert.discord_username || "Buyer"} • Ref: {latestOrderAlert.reference_number || "None"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setView("orders");
                setLatestOrderAlert(null);
              }}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-black text-black hover:bg-emerald-400 font-sans shadow"
            >
              Review
            </button>
            <button
              type="button"
              onClick={() => setLatestOrderAlert(null)}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
