"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Key,
  RotateCcw,
  Trash2,
  Ban,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  Eye,
  Check,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  Copy,
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

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "licenses">("orders");
  const [searchTerm, setSearchTerm] = useState("");

  // Manual key generation modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTier, setGenTier] = useState("Monthly VIP");
  const [genDays, setGenDays] = useState("30");
  const [genDiscordId, setGenDiscordId] = useState("");
  const [genDiscordUsername, setGenDiscordUsername] = useState("");
  const [genNotes, setGenNotes] = useState("");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Restore stored admin key
  useEffect(() => {
    const saved = sessionStorage.getItem("esm_admin_secret");
    if (saved) {
      setAdminSecret(saved);
      verifySecret(saved);
    }
  }, []);

  const verifySecret = async (secret: string) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-secret": secret },
      });
      if (res.ok) {
        sessionStorage.setItem("esm_admin_secret", secret);
        setIsAuthenticated(true);
        loadAdminData(secret);
      } else {
        setAuthError("Invalid Admin Secret Passcode.");
      }
    } catch {
      setAuthError("Failed to connect to verification backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async (secret: string = adminSecret) => {
    setIsLoading(true);
    try {
      const [ordRes, licRes] = await Promise.all([
        fetch("/api/admin/orders", { headers: { "x-admin-secret": secret } }),
        fetch("/api/admin/licenses", { headers: { "x-admin-secret": secret } }),
      ]);

      const ordData = await ordRes.json();
      const licData = await licRes.json();

      if (ordData.orders) setOrders(ordData.orders);
      if (licData.licenses) setLicenses(licData.licenses);
    } catch (err) {
      console.error("Admin data load error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    if (!confirm("Approve this order and generate VIP license key?")) return;

    try {
      const res = await fetch("/api/orders/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          order_id: orderId,
          action: "approve",
          reviewer: "Web Admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Order Approved! Generated Key: ${data.license.license_key}`);
      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    const reason = prompt("Enter reason for rejection (optional):", "Invalid reference number or receipt");
    if (reason === null) return;

    try {
      const res = await fetch("/api/orders/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          order_id: orderId,
          action: "reject",
          admin_notes: reason,
          reviewer: "Web Admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleResetHwid = async (key: string) => {
    if (!confirm(`Clear hardware ID lock for ${key}? The user will be able to bind to a new PC.`)) return;

    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          action: "reset_hwid",
          license_key: key,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(data.message);
      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleToggleBan = async (key: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;
    if (!confirm(`${targetStatus ? "Ban" : "Unban"} license ${key}?`)) return;

    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          action: "toggle_ban",
          license_key: key,
          is_banned: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteLicense = async (key: string) => {
    if (!confirm(`Permanently delete license ${key}? This cannot be undone.`)) return;

    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          action: "delete",
          license_key: key,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleGenerateManualKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          action: "generate",
          tier: genTier,
          duration_days: genDays,
          discord_id: genDiscordId.trim() || null,
          discord_username: genDiscordUsername.trim() || null,
          notes: genNotes.trim() || "Manual Admin Generation",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Key Generated: ${data.license.license_key}`);
      setShowGenModal(false);
      loadAdminData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Metrics
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const approvedOrders = orders.filter((o) => o.status === "approved");
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const activeLicenses = licenses.filter((l) => !l.is_banned);

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-cyber-card border border-white/[0.1] shadow-2xl text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-cyber-gold/10 border border-cyber-gold/30 flex items-center justify-center text-cyber-gold shadow-glow-gold">
            <Shield className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-mono">
              STAFF COMMAND CONSOLE
            </h1>
            <p className="text-xs text-zinc-400">
              Enter the authorized Admin Secret Key to review orders and manage VIP hardware licenses.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifySecret(adminSecret);
            }}
            className="space-y-4 text-left"
          >
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter ADMIN_SECRET_KEY"
                className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-cyber-gold font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-cyber-gold hover:bg-amber-400 text-black font-bold font-mono text-sm tracking-wider shadow-glow-gold transition-all"
            >
              {isLoading ? "Authenticating..." : "Unlock Admin Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.discord_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.reference_number.includes(searchTerm)
  );

  const filteredLicenses = licenses.filter(
    (l) =>
      l.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.discord_username &&
        l.discord_username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.hwid && l.hwid.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* ─── ADMIN HEADER & REVENUE STATS ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-cyber-gold" />
            <span>VIP MANAGEMENT CONSOLE</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Real-time GCash payment verifications & 1-Key 1-PC hardware bindings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAdminData()}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
            title="Refresh Records"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-cyber-gold" : ""}`}
            />
          </button>
          <button
            onClick={() => setShowGenModal(true)}
            className="py-2.5 px-4 rounded-xl bg-cyber-gold hover:bg-amber-400 text-black font-bold font-mono text-xs transition-all shadow-glow-gold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Manual Key</span>
          </button>
        </div>
      </div>

      {/* ─── STATS COUNTERS ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cyber-card border border-white/[0.08] space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-cyber-neon" />
            Total Revenue
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-cyber-neon font-mono">
            ₱{totalRevenue.toLocaleString()} PHP
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            {approvedOrders.length} verified orders
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-card border border-white/[0.08] space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-yellow-400" />
            Pending Review
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-yellow-400 font-mono">
            {pendingOrders.length}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Requires verification</p>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-card border border-white/[0.08] space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-cyber-cyan" />
            Active VIP Licenses
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-cyber-cyan font-mono">
            {activeLicenses.length}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Bound to PCs</p>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-card border border-white/[0.08] space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-cyber-gold" />
            Lifetime Passes
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-cyber-gold font-mono">
            {licenses.filter((l) => !l.expires_at).length}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Permanent subscribers</p>
        </div>
      </div>

      {/* ─── TABS & SEARCH ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/[0.08] w-full sm:w-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-cyber-neon text-black shadow-glow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Orders Queue</span>
            {pendingOrders.length > 0 && (
              <span className="h-5 w-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("licenses")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === "licenses"
                ? "bg-cyber-neon text-black shadow-glow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>All VIP Licenses</span>
            <span className="text-xs opacity-75">({licenses.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-cyber-card border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyber-neon font-mono"
          />
        </div>
      </div>

      {/* ─── TAB 1: ORDERS REVIEW QUEUE ───────────────────────────── */}
      {activeTab === "orders" && (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-cyber-card/60 backdrop-blur-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/50 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan & Price</th>
                <th className="py-3 px-4">GCash Reference</th>
                <th className="py-3 px-4">Receipt</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      ord.status === "pending" ? "bg-yellow-500/[0.02]" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      {ord.order_number}
                      <span className="block text-[10px] text-zinc-500 font-normal">
                        {new Date(ord.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">
                        {ord.discord_username}
                      </span>
                      <span className="block text-[10px] text-zinc-400 select-all">
                        {ord.discord_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-zinc-200">{ord.tier}</span>
                      <span className="block text-cyber-neon font-bold">
                        ₱{ord.amount.toLocaleString()} PHP
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <code className="text-xs bg-black/40 px-2 py-0.5 rounded border border-white/[0.08] text-white">
                        {ord.reference_number}
                      </code>
                      {ord.sender_name && (
                        <span className="block text-[10px] text-zinc-500 mt-0.5">
                          From: {ord.sender_name}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.receipt_url ? (
                        <button
                          onClick={() => setSelectedReceipt(ord.receipt_url)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-cyber-cyan border border-cyber-cyan/30 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-zinc-600">No Image</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                          Pending
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
                    <td className="py-3.5 px-4 text-right">
                      {ord.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveOrder(ord.id)}
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors"
                            title="Approve Order & Generate Key"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectOrder(ord.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors"
                            title="Reject Order"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500">
                          {ord.license_key || "Resolved"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── TAB 2: ALL LICENSES MANAGER ──────────────────────────── */}
      {activeTab === "licenses" && (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-cyber-card/60 backdrop-blur-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/50 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">License Key</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Bound Discord User</th>
                <th className="py-3 px-4">Hardware Lock (HWID)</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500">
                    No licenses found.
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => (
                  <tr
                    key={lic.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      lic.is_banned ? "bg-red-950/20 text-red-300" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <code className="text-cyber-neon font-bold">
                          {lic.license_key}
                        </code>
                        <button
                          onClick={() => copyToClipboard(lic.license_key)}
                          className="text-zinc-500 hover:text-white"
                        >
                          {copiedKey === lic.license_key ? (
                            <Check className="h-3 w-3 text-cyber-neon" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">{lic.tier}</td>
                    <td className="py-3.5 px-4">
                      {lic.discord_username ? (
                        <>
                          <span className="text-white font-medium">
                            {lic.discord_username}
                          </span>
                          <span className="block text-[10px] text-zinc-500">
                            {lic.discord_id}
                          </span>
                        </>
                      ) : (
                        <span className="text-zinc-600">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {lic.hwid ? (
                        <span
                          className="text-cyber-cyan truncate max-w-[140px] block"
                          title={lic.hwid}
                        >
                          {lic.hwid.slice(0, 16)}...
                        </span>
                      ) : (
                        <span className="text-emerald-400">Unbound (0 PCs)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {lic.expires_at
                        ? new Date(lic.expires_at).toLocaleDateString()
                        : "Permanent Lifetime"}
                    </td>
                    <td className="py-3.5 px-4">
                      {lic.is_banned ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px]">
                          BANNED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResetHwid(lic.license_key)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyber-cyan/20 text-zinc-400 hover:text-cyber-cyan transition-colors"
                          title="Reset Hardware Lock (Allow new PC)"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleBan(lic.license_key, lic.is_banned)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-yellow-500/20 text-zinc-400 hover:text-yellow-400 transition-colors"
                          title={lic.is_banned ? "Unban Key" : "Ban Key"}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLicense(lic.license_key)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Key"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── RECEIPT PROOF MODAL ──────────────────────────────────── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-2xl w-full p-4 rounded-2xl bg-cyber-card border border-white/[0.1] shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              GCash Receipt Screenshot Proof
            </p>
            <img
              src={selectedReceipt}
              alt="Payment receipt proof"
              className="max-h-[75vh] w-auto rounded-xl object-contain border border-white/[0.08]"
            />
          </div>
        </div>
      )}

      {/* ─── MANUAL KEY GENERATOR MODAL ──────────────────────────── */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-md w-full p-6 rounded-2xl bg-cyber-card border border-white/[0.1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Key className="h-5 w-5 text-cyber-gold" />
                <span>Issue Custom License</span>
              </h3>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateManualKey} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1">
                  Plan Tier
                </label>
                <select
                  value={genTier}
                  onChange={(e) => {
                    setGenTier(e.target.value);
                    if (e.target.value === "Lifetime VIP") setGenDays("0");
                    else if (e.target.value === "Monthly VIP") setGenDays("30");
                    else if (e.target.value === "Weekly VIP") setGenDays("7");
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-cyber-gold"
                >
                  <option value="Monthly VIP">Monthly VIP (30 Days)</option>
                  <option value="Lifetime VIP">Lifetime VIP (Permanent)</option>
                  <option value="Weekly VIP">Weekly VIP (7 Days)</option>
                  <option value="1 Day Trial">1 Day Trial (24 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1">
                  Duration (Days, 0 = Lifetime)
                </label>
                <input
                  type="number"
                  value={genDays}
                  onChange={(e) => setGenDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-cyber-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1">
                  Recipient Discord ID (Optional)
                </label>
                <input
                  type="text"
                  value={genDiscordId}
                  onChange={(e) => setGenDiscordId(e.target.value)}
                  placeholder="e.g. 1561411157095620758"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-cyber-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1">
                  Recipient Username (Optional)
                </label>
                <input
                  type="text"
                  value={genDiscordUsername}
                  onChange={(e) => setGenDiscordUsername(e.target.value)}
                  placeholder="e.g. shadow_sniper"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-cyber-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-400 mb-1">
                  Admin Notes
                </label>
                <input
                  type="text"
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  placeholder="e.g. Giveaway Winner / Manual GCash"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/[0.1] text-white focus:outline-none focus:border-cyber-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyber-gold hover:bg-amber-400 text-black font-bold font-mono tracking-wider shadow-glow-gold transition-all mt-4"
              >
                Generate & Save to Supabase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

