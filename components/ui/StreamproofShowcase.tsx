"use client";

import { useState, useEffect } from "react";
import {
  EyeOff,
  Eye,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Video,
  Layers,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StreamproofShowcaseProps {
  onSelectPlan?: (plan: {
    tier: string;
    price: number;
    description: string;
    isLifetime?: boolean;
  }) => void;
  onPreviewImage?: (image: { url: string; title: string }) => void;
}

export function StreamproofShowcase({
  onSelectPlan,
  onPreviewImage,
}: StreamproofShowcaseProps) {
  // Tabs: 0: Stream-Proof | 1: Wallhack ESP | 2: Bone Skeleton | 3: Peace Cleaner
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [proofPOV, setProofPOV] = useState<"screen" | "stream">("screen");

  const tabs = [
    {
      id: 0,
      label: "Stream-Proof",
      subLabel: "Stream-Proof POV",
      icon: <EyeOff className="h-4 w-4 text-[#E53935]" />,
    },
    {
      id: 1,
      label: "Wallhack ESP",
      subLabel: "Tactical ESP",
      icon: <Layers className="h-4 w-4 text-[#E53935]" />,
    },
    {
      id: 2,
      label: "Bone Skeleton",
      subLabel: "Aimbot Tracking",
      icon: <Crosshair className="h-4 w-4 text-[#E53935]" />,
    },
    {
      id: 3,
      label: "Peace Cleaner",
      subLabel: "HWID Ban Removal",
      icon: <ShieldCheck className="h-4 w-4 text-[#E53935]" />,
    },
  ];

  // Auto-slide every 5 seconds; pause when hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, tabs.length]);

  const handleBuy = () => {
    onSelectPlan?.({
      tier: "Red Line Cheats - 1 Month",
      price: 1000,
      description:
        "Full stream-proof visual overlay and aimbot suite for all Assault Fire servers.",
    });
  };

  const currentTab = tabs[activeTab];

  return (
    <div
      id="streamproof"
      className="scroll-mt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 text-black select-none"
    >
      {/* ─── SECTION HEADER (EXACT MATCH TO USER SPECIFICATION) ───── */}
      <div className="relative mb-8 sm:mb-12">
        {/* Floating Decorative Stripes (matching Skript.gg top-right) */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2 rotate-[-25deg] opacity-35 pointer-events-none z-0"
        >
          <div className="h-1.5 w-18 rounded-full bg-zinc-300" />
          <div className="h-1.5 w-10 rounded-full bg-zinc-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-bold font-sans tracking-tight leading-[1]">
              <span className="text-black">Discover your</span>{" "}
              <span className="block text-[#8E95A2]">
                secret weapon.
              </span>
            </h2>
          </div>

          <div className="shrink-0">
            <p className="text-base sm:text-lg lg:text-[1.35rem] font-semibold text-black font-sans leading-snug max-w-[280px] text-left">
              Get a glimpse of the<br className="hidden sm:inline" />{" "}
              features that give you<br className="hidden sm:inline" />{" "}
              the edge.
            </p>
          </div>
        </div>
      </div>

      {/* ─── TAB NAVIGATION BAR (CLEAN AIRY PILL ROW) ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        {/* Active Category Display on Left */}
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold font-sans text-black">
          <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200/70 shadow-xs flex items-center justify-center">
            {currentTab.icon}
          </div>
          <span className="tracking-tight">{currentTab.subLabel}</span>
        </div>

        {/* Tab Pills Switcher on Right (Scrollable on mobile) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100/80 border border-zinc-200/60 overflow-x-auto max-w-full scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${isActive
                    ? "bg-[#E53935] text-white shadow-xs"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-200/50"
                  }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── AUTO-SLIDING FEATURE PREVIEW WINDOW (AIRY CLEAN BOX) ───────── */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-zinc-200/70 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow"
      >
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            /* ── TAB 0: STREAM-PROOF PROOF (DUAL POV LIVE TOGGLE) ──── */
            <motion.div
              key="tab-streamproof"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-8 lg:p-9"
            >
              {/* Window Controls & POV Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-100/90">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    Red Line Driver Isolation Buffer
                  </span>
                </div>

                {/* Sub-toggle between Physical Monitor vs Stream POV */}
                <div className="grid grid-cols-1 sm:flex items-center gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/60 text-xs font-semibold font-sans w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setProofPOV("screen")}
                    className={`px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                      proofPOV === "screen"
                        ? "bg-black text-white shadow-xs"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Your Screen (ESP Active)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofPOV("stream")}
                    className={`px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                      proofPOV === "stream"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">OBS / Stream POV (Clean)</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Display */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[16/9] max-h-[480px] flex items-center justify-center group shadow-sm border border-zinc-200/40">
        {proofPOV === "screen" ? (
          <img
            src="/proof/your-screen.webp"
            alt="Assault Fire Live Screen View with ESP Wallhack"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        ) : (
          <img
            src="/proof/screenshot-pov.webp"
            alt="Assault Fire Clean Capture on Discord and OBS"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        )}

        {/* Status Badges Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {proofPOV === "screen" ? (
            <span className="px-3 py-1.5 rounded-xl bg-red-600/90 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Physical Screen Overlay
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-600/90 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              100% Clean Capture (OBS / Discord)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            onPreviewImage?.(
              proofPOV === "screen"
                ? {
                  url: "/proof/your-screen.webp",
                  title: "Your Screen: Live ESP & Bone Skeletons Active",
                }
                : {
                  url: "/proof/screenshot-pov.webp",
                  title: "Stream POV: 100% Clean OBS & Discord Output",
                }
            )
          }
          className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Click to Expand</span>
        </button>
      </div>
    </motion.div>
  )
}

{
  activeTab === 1 && (
    /* ── TAB 1: WALLHACK ESP ────────────────────────────────── */
    <motion.div
      key="tab-wallhack"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 sm:p-8 lg:p-9"
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100/90">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-600 uppercase">
            Tactical 2D/3D Bounding Boxes & Distance Meters
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400">FPS: 240+ STABLE</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[16/9] max-h-[480px] flex items-center justify-center shadow-sm border border-zinc-200/40">
        <img
          src="/proof/your-screen.webp"
          alt="Assault Fire Wallhack ESP"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
          <div className="space-y-1 text-white">
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Adaptive Bounding Boxes Active
            </p>
            <p className="text-sm font-sans text-zinc-200">
              Renders enemy distance, weapon tags, and health status through walls and obstacles with zero framerate lag.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

{
  activeTab === 2 && (
    /* ── TAB 2: BONE SKELETON & AIMBOT ─────────────────────── */
    <motion.div
      key="tab-aimbot"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 sm:p-8 lg:p-9"
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100/90">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-[#E53935]" />
          <span className="text-xs font-mono font-bold text-zinc-600 uppercase">
            Bone Skeleton Joint Tracking & Smoothing
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">TARGET LOCKED</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 min-h-[380px] sm:min-h-0 sm:aspect-[16/9] sm:max-h-[480px] flex items-center justify-center p-6 border border-zinc-200/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-4xl">
          <div className="flex justify-center">
            <img
              src="/img-1.png"
              alt="Aimbot Interface 3D Claymorphic Element"
              className="w-72 drop-shadow-2xl select-none"
            />
          </div>
          <div className="space-y-4 text-white font-sans">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[#E53935] text-xs font-bold uppercase font-mono">
              Precision Smoothing Engine
            </div>
            <h4 className="text-2xl font-bold tracking-tight">
              Bone Skeleton Tracking Through Smoke & Walls
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Highlights head hitboxes, spine joints, and leg positions even through smoke grenades. Adjust FOV radius, smooth sensitivity, and aim keys on the fly.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

{
  activeTab === 3 && (
    /* ── TAB 3: PEACE CLEANER HWID BAN REMOVAL ─────────────── */
    <motion.div
      key="tab-cleaner"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 sm:p-8 lg:p-9"
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100/90">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold text-zinc-600 uppercase">
            Peace Cleaner: Hardware Identifier Flusher
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">HWID CLEAN</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black min-h-[380px] sm:min-h-0 sm:aspect-[16/9] sm:max-h-[480px] flex items-center justify-center p-6 sm:p-8 text-white border border-zinc-200/40">
        <div className="max-w-xl text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            Instant Device Ban Removal
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Peace Cleaner removes device bans so you can play Assault Fire immediately. Flushes residual anti-cheat tokens, clears hardware identifiers, and purges standby memory caches.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300">
              NIC MAC Address: Spoofed
            </span>
            <span className="px-3 py-1 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300">
              Registry Trace: Purged
            </span>
            <span className="px-3 py-1 rounded-xl bg-zinc-800 text-xs font-mono text-emerald-400">
              Status: 100% Undetected
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
        </AnimatePresence >
      </div >

  {/* ─── INFO SECTION BELOW (MATCHING 2ND SCREENSHOT) ───────────── */ }
  < div className = "mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start" >
    {/* Left Column: Heading & Another Buy Button */ }
    < div className = "lg:col-span-5 space-y-5" >
          <h3 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold font-sans text-black tracking-tight leading-[1.12]">
            Every feature above is included. No tiers, no unlocks.
          </h3>

          <div>
            <button
              type="button"
              onClick={handleBuy}
              className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-2xl bg-[#E53935] hover:bg-[#c62828] active:scale-95 text-white font-bold font-sans text-sm sm:text-base tracking-wide flex items-center gap-2.5 transition-all shadow-md hover:shadow-xl shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer"
            >
              <span>Buy Now! Starts at ₱500</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div >

  {/* Right Column: 3 Bullet Items with Custom Checked Icons */ }
  < div className = "lg:col-span-7 space-y-4 pt-1" >
          <div className="flex items-start gap-3.5">
            <div className="h-6 w-6 rounded-full bg-red-50 border border-red-200/80 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
              <strong className="text-black font-semibold">100% Stream-Proof isolated buffer,</strong> invisible on OBS Studio, Discord screen share, and TikTok Live.
            </p>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-6 w-6 rounded-full bg-red-50 border border-red-200/80 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
              <strong className="text-black font-semibold">Adaptive bone skeleton tracking,</strong> bounding boxes, and real-time player distance meters through walls & smoke.
            </p>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-6 w-6 rounded-full bg-red-50 border border-red-200/80 text-[#E53935] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
              <strong className="text-black font-semibold">Peace Cleaner device ban removal,</strong> standby cache optimizer, and registry token purge included with zero extra fees.
            </p>
          </div>
        </div >
      </div >
    </div >
  );
}
