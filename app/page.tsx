"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crosshair,
  Shield,
  Eye,
  Lock,
  CheckCircle2,
  ChevronRight,
  QrCode,
  Terminal,
  Activity,
  Cpu,
  MonitorCheck,
  Radio,
  Sliders,
} from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import { useDiscordAuth } from "@/context/DiscordAuthContext";

export default function HomePage() {
  const { user } = useDiscordAuth();
  const [selectedPlan, setSelectedPlan] = useState<{
    tier: string;
    price: number;
    description: string;
    isLifetime?: boolean;
  } | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(
    null
  );

  const plans = [
    {
      tier: "Weekly VIP",
      price: 500,
      billing: "7-day access",
      description:
        "7 days full tactical visual engine access for tournaments & short-term play.",
      isLifetime: false,
      isWeekly: true,
      features: [
        "Full 7-day client access & updates",
        "Full joint skeleton & distance-scaled boxes",
        "Hardware-level broadcast capture exclusion",
        "Discord VIP syndicate access & support",
      ],
      badge: "WEEKLY PASS",
      cta: "Purchase Weekly — ₱500",
    },
    {
      tier: "Monthly VIP",
      price: 1000,
      billing: "30-day cycle",
      description:
        "Continuous 30-day authorization package for active competitive players.",
      isLifetime: false,
      isPopular: true,
      features: [
        "Continuous 30-day client access & updates",
        "Full joint skeleton & distance-scaled boxes",
        "Hardware-level broadcast capture exclusion",
        "Discord VIP syndicate access & announcements",
      ],
      badge: "RECOMMENDED",
      cta: "Purchase Monthly — ₱1,000",
    },
    {
      tier: "Lifetime VIP Pass",
      price: 3000,
      billing: "one-time payment",
      description:
        "Permanent syndicate seat with lifetime patch coverage and re-bind priority.",
      isLifetime: true,
      features: [
        "Permanent license — zero recurring renewal fees",
        "Coverage across all future engine iterations",
        "Staff-assisted machine re-bind on PC upgrade",
        "Direct VIP support channel in Discord",
      ],
      badge: "LIFETIME VIP",
      cta: "Claim Lifetime — ₱3,000",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-8 sm:pt-16 pb-4 flex flex-col items-center text-center">
        {/* Headline — Zero AI Slop (No eyebrow pill, no gradient text) */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-mono uppercase leading-[1.08] max-w-5xl">
          DOMINATE WITH <br className="hidden sm:inline" />
          <span className="text-red-500">SURGICAL VISION.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed font-sans">
          Private tactical visual suite engineered for competitive play. Zero stream footprint, seamless overlay sync, and dedicated single-seat access.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-sm tracking-wider transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Crosshair className="h-4 w-4" />
            <span>View Tiers & Pricing</span>
          </a>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.1] hover:border-white/20 font-medium font-mono text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Customer Portal</span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          </Link>
        </div>

        {/* ─── HUD TELEMETRY INSTRUMENT ────────────────────────────── */}
        <div className="mt-14 w-full max-w-4xl rounded-xl bg-[#0b0e14] border border-white/[0.08] p-5 sm:p-6 shadow-2xl text-left font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white tracking-wider">
                RED LINE TELEMETRY
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <span>BUILD: v1.0-STABLE</span>
              <span className="text-emerald-400 font-semibold">STATUS: NOMINAL</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
                Pipeline
              </span>
              <p className="font-semibold text-white mt-0.5">DirectDraw Overlay</p>
              <span className="text-[11px] text-zinc-400">Hardware accelerated</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
                Broadcasting
              </span>
              <p className="font-semibold text-white mt-0.5">Capture Excluded</p>
              <span className="text-[11px] text-zinc-400">OBS & Discord clean</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
                Seat Authentication
              </span>
              <p className="font-semibold text-white mt-0.5">Discord OAuth</p>
              <span className="text-[11px] text-zinc-400">Single active machine</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
                Latency Overhead
              </span>
              <p className="font-semibold text-emerald-400 mt-0.5">&lt; 0.2ms Draw Time</p>
              <span className="text-[11px] text-zinc-400">Zero frame drop</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUCCESS ORDER BANNER (IF JUST ORDERED) ──────────────── */}
      {successOrderNumber && (
        <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">
            Payment Verification Submitted
          </h3>
          <p className="text-sm text-zinc-300 max-w-lg mx-auto font-sans">
            Order Reference: <strong className="text-emerald-400 font-mono">{successOrderNumber}</strong>. An alert has been transmitted to staff on Discord. Your VIP key will unlock in your customer portal upon manual review.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold font-mono text-sm"
            >
              <span>Go to Customer Portal</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── PRICING & PLANS SECTION (NO EYEBROW PILL) ───────────── */}
      <section id="pricing" className="scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight uppercase">
            MEMBERSHIP TIERS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans">
            Every license is cryptographically bound to your verified Discord account and authenticated machine signature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.tier}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                p.isLifetime
                  ? "bg-[#111218] border-2 border-amber-500/50 shadow-2xl hover:border-amber-400"
                  : (p as any).isPopular
                  ? "bg-[#0f131d] border-2 border-red-500/60 shadow-xl hover:border-red-500"
                  : "bg-[#0d1017] border border-white/[0.1] hover:border-white/20 shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      p.isLifetime
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : (p as any).isPopular
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-white/[0.06] text-zinc-300 border border-white/[0.12]"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Single-Seat</span>
                </div>

                <h3 className="text-2xl font-bold text-white font-mono">{p.tier}</h3>
                <p className="text-xs text-zinc-400 mt-1 min-h-[36px] font-sans">{p.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                    ₱{p.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono uppercase">
                    PHP / {p.billing}
                  </span>
                </div>

                <div className="my-6 border-t border-white/[0.08]"></div>

                {/* Features List */}
                <ul className="space-y-3 font-mono text-xs sm:text-sm text-zinc-300">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          p.isLifetime ? "text-amber-400" : "text-red-500"
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Action Button */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => setSelectedPlan(p)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold font-mono text-sm tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
                    p.isLifetime
                      ? "bg-amber-500 hover:bg-amber-400 text-black"
                      : "bg-red-600 hover:bg-red-500 text-white"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>{p.cta}</span>
                </button>
                <p className="text-[11px] text-center text-zinc-500 mt-2 font-mono">
                  Settled via GCash / InstaPay QR • Verified by staff
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SYSTEM ARCHITECTURE (ASYMMETRIC, ANTI-SLOP) ─────────── */}
      <section id="features" className="scroll-mt-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="pb-4 border-b border-white/[0.08]">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-mono uppercase tracking-tight">
              SYSTEM ARCHITECTURE
            </h2>
            <p className="text-sm text-zinc-400 font-sans mt-1">
              Technical design specifications and display isolation pipeline.
            </p>
          </div>

          {/* Asymmetric Technical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Pipeline (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-[#0b0e14] border border-white/[0.08] p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    Overlay Rendering Engine
                  </h3>
                  <span className="text-xs text-zinc-400 font-sans">
                    Precision hardware-accelerated direct surface drawing
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                Renders player joint lines, skeletal structures, and bounding boxes directly through a hardware swapchain overlay. All visual telemetry scales proportionally with distance, eliminating visual noise during close-quarters engagements.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                  <span className="text-zinc-500 block text-[10px] uppercase">Toggle Control</span>
                  <span className="text-white font-bold">[INSERT] Key Toggle</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                  <span className="text-zinc-500 block text-[10px] uppercase">Display Sync</span>
                  <span className="text-emerald-400 font-bold">144Hz - 360Hz Native</span>
                </div>
              </div>
            </div>

            {/* Broadcast Isolation (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0b0e14] border border-white/[0.08] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <MonitorCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">
                      Stream Isolation
                    </h3>
                    <span className="text-xs text-zinc-400 font-sans">
                      Complete capture invisibility
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  The visual assist layer is presented exclusively on the physical display surface. Screen recorders and streaming software capture pristine in-game footage with zero overlay elements visible.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>OBS Studio Capture:</span>
                  <span className="text-emerald-400 font-semibold">Clean Feed</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Discord Screenshare:</span>
                  <span className="text-emerald-400 font-semibold">Clean Feed</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Direct Monitor Output:</span>
                  <span className="text-white font-semibold">Full Tactical HUD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="rounded-2xl bg-[#0b0e14] border border-white/[0.08] overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Technical Specification Matrix
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Single-Seat Protected
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-3.5 gap-1.5 sm:gap-2">
                <span className="text-zinc-400 font-sans">Runtime Footprint</span>
                <span className="sm:col-span-2 text-white">
                  &lt; 1% CPU utilization • Zero impact on frame rendering pipeline
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-3.5 gap-1.5 sm:gap-2">
                <span className="text-zinc-400 font-sans">Display Compatibility</span>
                <span className="sm:col-span-2 text-white">
                  Fullscreen Borderless and Windowed modes across 1080p, 1440p, 4K
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-3.5 gap-1.5 sm:gap-2">
                <span className="text-zinc-400 font-sans">Identity & Hardware</span>
                <span className="sm:col-span-2 text-white">
                  Bound to authenticated Discord account and physical hardware signature
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-3.5 gap-1.5 sm:gap-2">
                <span className="text-zinc-400 font-sans">Verification Method</span>
                <span className="sm:col-span-2 text-white">
                  Manual GCash / InstaPay QR receipt review with automated Discord staff alerts
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHECKOUT MODAL ──────────────────────────────────────── */}
      <CheckoutModal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        onSuccess={(orderNum) => {
          setSelectedPlan(null);
          setSuccessOrderNumber(orderNum);
        }}
      />
    </div>
  );
}
