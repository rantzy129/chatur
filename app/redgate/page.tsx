"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Ban,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
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
  Trash2,
  UsersRound,
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

type AdminView = "overview" | "orders" | "licenses";
type Notice = { tone: "success" | "error"; message: string } | null;

const navigation: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Wallet },
  { id: "licenses", label: "Licenses", icon: KeyRound },
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
    ? "—"
    : date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-white/[0.08] bg-[#0b0d11] lg:flex">
      <a href="/redgate" className="flex h-[76px] items-center gap-3 border-b border-white/[0.08] px-6">
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-red-500/30 bg-[#14171d] p-1.5">
          <img src="/logo.png" alt="" className="h-full w-full object-contain" />
        </span>
        <span>
          <span className="block text-sm font-bold tracking-[0.12em] text-white">RED LINE</span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Admin workspace
          </span>
        </span>
      </a>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                  selected
                    ? "bg-red-500/[0.11] text-red-300"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                }`}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {id === "orders" && pendingCount > 0 && (
                  <span className="min-w-5 rounded bg-red-500/15 px-1.5 py-0.5 text-center text-[10px] tabular-nums text-red-300">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/[0.08] p-4">
        <a
          href="/"
          className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
          View storefront
        </a>
        <div className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#242831] text-zinc-300">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-zinc-100">Admin session</span>
            <span className="mt-0.5 block text-[10px] text-emerald-400">Authenticated</span>
          </span>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
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
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof DollarSign;
  accent: "red" | "amber" | "green" | "blue";
}) {
  const accentClasses = {
    red: "text-red-300 bg-red-400/10",
    amber: "text-amber-300 bg-amber-400/10",
    green: "text-emerald-300 bg-emerald-400/10",
    blue: "text-sky-300 bg-sky-400/10",
  }[accent];

  return (
    <article className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101318] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-medium text-zinc-400">{label}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClasses}`}>
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 truncate text-[25px] font-semibold leading-none tracking-[-0.03em] text-white tabular-nums sm:text-[28px]">
        {value}
      </p>
      <p className="mt-2 text-[11px] text-zinc-500">{detail}</p>
    </article>
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
          <h2 className="text-[14px] font-semibold text-zinc-100">Approved revenue</h2>
          <p className="mt-1 text-[11px] text-zinc-500">Daily totals · last 7 days</p>
        </div>
        <span className="inline-flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-red-400" />
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
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((tick, index) => {
            const y = bottom - (index / 3) * (bottom - top);
            return (
              <g key={index}>
                <line x1={left} x2={right} y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.08" />
                <text x={left - 10} y={y + 4} textAnchor="end" fill="#9298a2" fontSize="10">
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
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {coordinates.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4" fill="#0f1116" stroke="#f87171" strokeWidth="2" />
              <title>{`${point.label}: ${formatCurrency(point.value)}`}</title>
              <text x={point.x} y={bottom + 24} textAnchor="middle" fill="#9298a2" fontSize="10">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {points.every((point) => point.value === 0) && (
        <p className="mt-2 text-center text-[11px] text-zinc-500">
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
        <h2 className="text-[14px] font-semibold text-zinc-100">License mix</h2>
        <p className="mt-1 text-[11px] text-zinc-500">Issued licenses by plan</p>
      </div>
      {entries.length === 0 ? (
        <p className="py-12 text-center text-[12px] text-zinc-500">No licenses to report yet.</p>
      ) : (
        <div className="mt-7 space-y-5">
          {entries.map(([tier, count]) => (
            <div key={tier}>
              <div className="mb-2 flex items-center justify-between gap-3 text-[12px]">
                <span className="truncate text-zinc-300">{tier}</span>
                <span className="shrink-0 font-medium tabular-nums text-white">{count}</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-white/[0.07]"
                role="meter"
                aria-label={`${tier} licenses`}
                aria-valuemin={0}
                aria-valuemax={maximum}
                aria-valuenow={count}
              >
                <div
                  className="h-full rounded-full bg-red-400 transition-[width] duration-300"
                  style={{ width: `${(count / maximum) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px]">
        <span className="text-zinc-500">Total issued</span>
        <span className="font-semibold tabular-nums text-zinc-200">{licenses.length}</span>
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
        <Wallet className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 text-sm font-medium text-zinc-200">No matching orders</p>
        <p className="mt-1 text-xs text-zinc-500">Try another search or check back when a customer places an order.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-[12px]">
        <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Plan / amount</th>
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Proof</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-white/[0.025]">
              <td className="px-4 py-3.5">
                <span className="font-medium text-zinc-100">{order.order_number}</span>
                <span className="mt-1 block text-[10px] text-zinc-500">{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="block max-w-[150px] truncate font-medium text-zinc-200">{order.discord_username}</span>
                <span className="mt-1 block text-[10px] text-zinc-500">{order.discord_id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="block text-zinc-300">{order.tier}</span>
                <span className="mt-1 block font-medium tabular-nums text-zinc-100">{formatCurrency(Number(order.amount) || 0)}</span>
              </td>
              <td className="px-4 py-3.5">
                <code className="rounded bg-black/30 px-2 py-1 text-[11px] text-zinc-300">{order.reference_number}</code>
                {order.sender_name && <span className="mt-1 block text-[10px] text-zinc-500">From {order.sender_name}</span>}
              </td>
              <td className="px-4 py-3.5">
                {order.receipt_url ? (
                  <button
                    type="button"
                    onClick={() => onViewReceipt(order.receipt_url!)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:border-red-400/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                ) : <span className="text-zinc-500">No proof</span>}
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
                      className="rounded-md p-2 text-emerald-300 transition-colors hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(order.id)}
                      aria-label={`Reject ${order.order_number}`}
                      title="Reject order"
                      className="rounded-md p-2 text-red-300 transition-colors hover:bg-red-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="block max-w-[140px] truncate text-right text-[10px] text-zinc-500">
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
    pending: "border-amber-400/20 bg-amber-400/[0.08] text-amber-200",
    approved: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200",
    rejected: "border-red-400/20 bg-red-400/[0.08] text-red-200",
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] capitalize ${styles}`}>
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
        <KeyRound className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 text-sm font-medium text-zinc-200">No matching licenses</p>
        <p className="mt-1 text-xs text-zinc-500">Try another search or issue a license to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-[12px]">
        <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">License key</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Hardware ID</th>
            <th className="px-4 py-3 font-medium">Expires</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {licenses.map((license) => (
            <tr key={license.id} className={`transition-colors hover:bg-white/[0.025] ${license.is_banned ? "bg-red-950/10" : ""}`}>
              <td className="px-4 py-3.5">
                <span className="flex items-center gap-2">
                  <code className="font-medium text-red-200">{license.license_key}</code>
                  <button
                    type="button"
                    onClick={() => onCopy(license.license_key)}
                    aria-label={`Copy ${license.license_key}`}
                    className="rounded p-1 text-zinc-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                  >
                    {copiedKey === license.license_key ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </span>
              </td>
              <td className="px-4 py-3.5 text-zinc-300">{license.tier}</td>
              <td className="px-4 py-3.5">
                <span className="block text-zinc-200">{license.discord_username || "Unassigned"}</span>
                <span className="mt-1 block text-[10px] text-zinc-500">{license.discord_id || "No Discord ID"}</span>
              </td>
              <td className="px-4 py-3.5">
                {license.hwid ? (
                  <code title={license.hwid} className="block max-w-[130px] truncate text-[11px] text-zinc-300">{license.hwid}</code>
                ) : <span className="text-zinc-500">Not bound</span>}
              </td>
              <td className="px-4 py-3.5 text-zinc-400">{license.expires_at ? formatDate(license.expires_at) : "Lifetime"}</td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] ${license.is_banned ? "text-red-300" : "text-emerald-300"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {license.is_banned ? "Banned" : "Active"}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => onResetHwid(license.license_key)} aria-label={`Reset hardware lock for ${license.license_key}`} title="Reset hardware lock" className="rounded-md p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => onToggleBan(license.license_key, license.is_banned)} aria-label={`${license.is_banned ? "Unban" : "Ban"} ${license.license_key}`} title={license.is_banned ? "Unban license" : "Ban license"} className="rounded-md p-2 text-zinc-400 hover:bg-amber-400/10 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
                    <Ban className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => onDelete(license.license_key)} aria-label={`Delete ${license.license_key}`} title="Delete license" className="rounded-md p-2 text-zinc-400 hover:bg-red-400/10 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [view, setView] = useState<AdminView>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTier, setGenTier] = useState("Monthly VIP");
  const [genDays, setGenDays] = useState("30");
  const [genDiscordId, setGenDiscordId] = useState("");
  const [genDiscordUsername, setGenDiscordUsername] = useState("");
  const [genNotes, setGenNotes] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
      const [ordersResponse, licensesResponse] = await Promise.all([
        fetch("/api/admin/orders", { headers: { "x-admin-secret": secret } }),
        fetch("/api/admin/licenses", { headers: { "x-admin-secret": secret } }),
      ]);
      const [ordersData, licensesData] = await Promise.all([
        ordersResponse.json(),
        licensesResponse.json(),
      ]);

      if (!ordersResponse.ok) {
        throw new Error(ordersData.error || "Could not load orders.");
      }
      if (!licensesResponse.ok) {
        throw new Error(licensesData.error || "Could not load licenses.");
      }

      setOrders(ordersData.orders || []);
      setLicenses(licensesData.licenses || []);
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
  const activeLicenses = licenses.filter((license) => !license.is_banned);
  const lifetimeLicenses = licenses.filter((license) => !license.expires_at);
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
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      order.order_number.toLowerCase().includes(term) ||
      order.discord_username.toLowerCase().includes(term) ||
      order.reference_number.toLowerCase().includes(term)
    );
  });
  const filteredLicenses = licenses.filter((license) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      license.license_key.toLowerCase().includes(term) ||
      (license.discord_username || "").toLowerCase().includes(term) ||
      (license.hwid || "").toLowerCase().includes(term)
    );
  });
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (!isAuthenticated) {
    return (
      <div className="admin-console min-h-screen bg-[#090a0d] text-zinc-100">
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
          <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-[#0d0f13] p-10 lg:flex xl:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_22%,rgba(127,29,29,0.18),transparent_44%)]" />
            <a href="/" className="relative flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-red-500/30 bg-[#14171d] p-1.5">
                <img src="/logo.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block text-sm font-bold tracking-[0.13em] text-white">RED LINE</span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-zinc-500">Admin workspace</span>
              </span>
            </a>
            <div className="relative max-w-xl py-16">
              <div className="mb-7 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-red-300">
                <Shield className="h-4 w-4" />
                Restricted access
              </div>
              <h1 className="max-w-[12ch] text-5xl font-semibold leading-[1.06] tracking-[-0.04em] text-white xl:text-6xl">
                Operations, at a glance.
              </h1>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-7 text-zinc-400">
                Review customer orders, track license activity, and manage access from one secure workspace.
              </p>
              <div className="mt-12 flex items-center gap-3 border-t border-white/[0.08] pt-6 text-xs text-zinc-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03]">
                  <ShieldCheck className="h-4 w-4 text-zinc-300" />
                </span>
                <span>Admin credentials are validated by the server.</span>
              </div>
            </div>
            <p className="relative text-[11px] text-zinc-600">RED LINE VIP · ADMINISTRATOR ACCESS</p>
          </section>

          <main className="flex min-h-screen flex-col">
            <header className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5 sm:px-8">
              <a href="/" className="flex items-center gap-2.5 lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-red-500/30 bg-[#14171d] p-1">
                  <img src="/logo.png" alt="" className="h-full w-full object-contain" />
                </span>
                <span className="text-xs font-semibold tracking-[0.12em] text-white">RED LINE ADMIN</span>
              </a>
              <span className="hidden text-[12px] text-zinc-500 lg:inline">Secure sign in</span>
              <a href="/" className="ml-auto text-[12px] text-zinc-400 transition-colors hover:text-white">
                Back to storefront
              </a>
            </header>

            <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
              <div className="w-full max-w-[390px]">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.08] text-red-300">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-white">Sign in to admin</h2>
                <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                  Enter your administrator key to open the management workspace.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void verifySecret(adminSecret);
                  }}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label htmlFor="admin-secret" className="mb-2 block text-[12px] font-medium text-zinc-300">
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
                        className="h-12 w-full rounded-lg border border-white/[0.12] bg-[#101318] px-3.5 pr-12 text-[14px] text-white placeholder:text-zinc-500 focus:border-red-400/70 focus:outline-none focus:ring-2 focus:ring-red-400/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret((visible) => !visible)}
                        aria-label={showSecret ? "Hide admin secret" : "Show admin secret"}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-[12px] leading-5 text-red-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAuthenticating || !adminSecret.trim()}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:bg-red-500/40 disabled:text-white/60"
                  >
                    {isAuthenticating && <RefreshCw className="h-4 w-4 animate-spin" />}
                    {isAuthenticating ? "Verifying access…" : "Continue to admin"}
                  </button>
                </form>

                <p className="mt-8 border-t border-white/[0.08] pt-5 text-[11px] leading-5 text-zinc-500">
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
  }[view];

  return (
    <div className="admin-console min-h-screen bg-[#090a0d] text-zinc-100 selection:bg-red-500/40 selection:text-white">
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
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-white/[0.08] bg-[#090a0d]/95 px-4 backdrop-blur-sm sm:px-7 lg:px-9">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-zinc-100">{heading}</p>
            <p className="mt-0.5 hidden text-[11px] text-zinc-500 sm:block">Red Line / Admin workspace</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-[11px] text-zinc-500 md:block">
              {new Date().toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <button
              type="button"
              onClick={refreshData}
              disabled={isLoading}
              aria-label="Refresh admin data"
              title="Refresh data"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 disabled:cursor-wait disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowGenModal(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-500 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 sm:px-3.5"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Issue license</span>
              <span className="sm:hidden">Issue</span>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-9">
          <nav aria-label="Admin navigation" className="mb-6 flex gap-1 overflow-x-auto border-b border-white/[0.08] lg:hidden">
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
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 ${
                  view === id
                    ? "border-red-400 text-red-200"
                    : "border-transparent text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {id === "orders" && pendingOrders.length > 0 && (
                  <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] tabular-nums text-red-200">{pendingOrders.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-semibold tracking-[-0.035em] text-white sm:text-[30px]">{heading}</h1>
              <p className="mt-1.5 max-w-[62ch] text-[12px] leading-5 text-zinc-400">
                {view === "overview" && "A clear view of orders, revenue, and issued licenses."}
                {view === "orders" && "Review payment proof and resolve customer orders."}
                {view === "licenses" && "Manage issued keys, hardware bindings, and account status."}
              </p>
            </div>
            {view !== "overview" && (
              <label className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={`Search ${view}…`}
                  className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#101318] pl-9 pr-3 text-[12px] text-white placeholder:text-zinc-500 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10"
                />
              </label>
            )}
          </div>

          {notice && (
            <div
              role={notice.tone === "error" ? "alert" : "status"}
              className={`mb-5 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[12px] ${
                notice.tone === "success"
                  ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
                  : "border-red-400/20 bg-red-400/[0.06] text-red-200"
              }`}
            >
              {notice.tone === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{notice.message}</span>
            </div>
          )}

          {dashboardError && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3.5 py-3 text-[12px] text-red-200">
              <span className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {dashboardError}
              </span>
              <button type="button" onClick={refreshData} className="font-semibold underline underline-offset-4 hover:text-white">Retry</button>
            </div>
          )}

          {isLoading && orders.length === 0 && licenses.length === 0 ? (
            <div className="space-y-5" aria-label="Loading admin data" aria-busy="true">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-[118px] animate-pulse rounded-xl border border-white/[0.06] bg-[#101318]" />
                ))}
              </div>
              <div className="h-[320px] animate-pulse rounded-xl border border-white/[0.06] bg-[#101318]" />
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
                  detail={`${licenses.length - activeLicenses.length} currently banned`}
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
                <div className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101318] p-4 sm:p-5">
                  <RevenueChart points={revenuePoints} />
                </div>
                <div className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101318] p-4 sm:p-5">
                  <PlanBreakdown licenses={licenses} />
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101318]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
                  <div>
                    <h2 className="text-[14px] font-semibold text-zinc-100">Recent orders</h2>
                    <p className="mt-1 text-[11px] text-zinc-500">Latest customer activity</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("orders")}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
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
            <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101318]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-100">Order queue</h2>
                  <p className="mt-1 text-[11px] text-zinc-500">{pendingOrders.length} awaiting review · {orders.length} total</p>
                </div>
                <span className="text-[11px] text-zinc-500">Updated {new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <OrdersTable
                orders={filteredOrders}
                onApprove={handleApproveOrder}
                onReject={handleRejectOrder}
                onViewReceipt={setSelectedReceipt}
              />
            </section>
          ) : (
            <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101318]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-100">License registry</h2>
                  <p className="mt-1 text-[11px] text-zinc-500">{activeLicenses.length} active · {lifetimeLicenses.length} lifetime</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGenModal(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] px-3 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                >
                  <Plus className="h-3.5 w-3.5" /> Issue license
                </button>
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
          )}
        </div>
      </main>

      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Payment receipt"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedReceipt(null);
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-xl border border-white/[0.12] bg-[#101318] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Payment receipt</h2>
                <p className="mt-1 text-[11px] text-zinc-500">Customer-submitted payment proof</p>
              </div>
              <button type="button" onClick={() => setSelectedReceipt(null)} aria-label="Close receipt" className="rounded-md p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg bg-black/30">
              <img src={selectedReceipt} alt="Customer payment receipt" className="max-h-[76vh] max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {showGenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-license-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowGenModal(false);
          }}
        >
          <div className="my-auto w-full max-w-[480px] rounded-xl border border-white/[0.1] bg-[#111419] p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="issue-license-title" className="text-[17px] font-semibold text-white">Issue a license</h2>
                <p className="mt-1 text-[12px] text-zinc-400">Create a key and optionally assign it to a Discord user.</p>
              </div>
              <button type="button" onClick={() => setShowGenModal(false)} aria-label="Close form" className="rounded-md p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateManualKey} className="space-y-4">
              <div>
                <label htmlFor="license-tier" className="mb-1.5 block text-[12px] font-medium text-zinc-300">Plan</label>
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
                  className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#090a0d] px-3 text-[12px] text-white focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10"
                >
                  <option value="Monthly VIP">Monthly VIP · 30 days</option>
                  <option value="Lifetime VIP">Lifetime VIP · permanent</option>
                  <option value="Weekly VIP">Weekly VIP · 7 days</option>
                  <option value="1 Day Trial">1 Day Trial · 1 day</option>
                </select>
              </div>
              <div>
                <label htmlFor="license-duration" className="mb-1.5 block text-[12px] font-medium text-zinc-300">Duration in days <span className="font-normal text-zinc-500">(0 for lifetime)</span></label>
                <input id="license-duration" type="number" min="0" value={genDays} onChange={(event) => setGenDays(event.target.value)} className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#090a0d] px-3 text-[12px] text-white focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="recipient-discord-id" className="mb-1.5 block text-[12px] font-medium text-zinc-300">Discord ID <span className="font-normal text-zinc-500">(optional)</span></label>
                  <input id="recipient-discord-id" type="text" value={genDiscordId} onChange={(event) => setGenDiscordId(event.target.value)} placeholder="User ID" className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#090a0d] px-3 text-[12px] text-white placeholder:text-zinc-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10" />
                </div>
                <div>
                  <label htmlFor="recipient-discord-name" className="mb-1.5 block text-[12px] font-medium text-zinc-300">Username <span className="font-normal text-zinc-500">(optional)</span></label>
                  <input id="recipient-discord-name" type="text" value={genDiscordUsername} onChange={(event) => setGenDiscordUsername(event.target.value)} placeholder="Discord username" className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#090a0d] px-3 text-[12px] text-white placeholder:text-zinc-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10" />
                </div>
              </div>
              <div>
                <label htmlFor="license-notes" className="mb-1.5 block text-[12px] font-medium text-zinc-300">Admin notes <span className="font-normal text-zinc-500">(optional)</span></label>
                <input id="license-notes" type="text" value={genNotes} onChange={(event) => setGenNotes(event.target.value)} placeholder="Internal note" className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#090a0d] px-3 text-[12px] text-white placeholder:text-zinc-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/10" />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
                <button type="button" onClick={() => setShowGenModal(false)} className="h-10 rounded-lg border border-white/[0.1] px-4 text-[12px] font-medium text-zinc-300 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">Cancel</button>
                <button type="submit" className="h-10 rounded-lg bg-red-500 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300">
                  Create license
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
