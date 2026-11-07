"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [proofPOV, setProofPOV] = useState<"screen" | "stream">("screen");
  const [animCycle, setAnimCycle] = useState(0);

  const isTransitioningRef = useRef(false);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

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

  const handleNext = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(1);
    setActiveTab((prev) => (prev + 1) % tabs.length);
    setAnimCycle((c) => c + 1);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  };

  const handlePrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setDirection(-1);
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
    setAnimCycle((c) => c + 1);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  };

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
    setAnimCycle((c) => c + 1);
  };

  const handleAnimationComplete = () => {
    handleNext();
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

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
              <span className="text-black">Discover Redline</span>{" "}
              <span className="block text-[#8E95A2]">
                Cheats.
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

      {/* ─── TAB NAVIGATION BAR & SHOWCASE (HOVER PAUSES PROGRESS) ─── */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5">
          {/* Active Category Display on Left */}
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold font-sans text-black">
            <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-center">
              {currentTab.icon}
            </div>
            <span className="tracking-tight">{currentTab.subLabel}</span>
          </div>

          {/* Tab Pills Switcher on Right (Active pill fills with red as progress) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full scrollbar-none py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              if (isActive) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className="relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold cursor-pointer whitespace-nowrap shrink-0 overflow-hidden bg-zinc-200/80 transition-colors"
                    title={`Active: ${tab.label}`}
                  >
                    {/* Dark text for unfilled track */}
                    <span className="relative z-0 text-zinc-900 select-none">
                      {tab.label}
                    </span>

                    {/* Expanding Red Progress Fill */}
                    <div
                      key={`fill-${tab.id}-${animCycle}`}
                      aria-hidden="true"
                      onAnimationEnd={(e) => {
                        if (e.animationName === "fill-progress") {
                          handleAnimationComplete();
                        }
                      }}
                      className="absolute inset-y-0 left-0 bg-[#E53935] overflow-hidden pointer-events-none"
                      style={{
                        animationName: "fill-progress",
                        animationDuration: `${SLIDE_DURATION}ms`,
                        animationTimingFunction: "linear",
                        animationFillMode: "forwards",
                        animationPlayState: isHovered ? "paused" : "running",
                        willChange: "width",
                      }}
                    >
                      {/* White text inside red fill with exact alignment */}
                      <span className="absolute inset-y-0 left-0 flex items-center px-4 sm:px-5 text-xs sm:text-sm font-sans font-bold text-white whitespace-nowrap select-none">
                        {tab.label}
                      </span>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold text-zinc-600 hover:text-black hover:bg-black/5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── SWIPEABLE AUTO-SLIDING FEATURE PREVIEW WINDOW ─────────────── */}
        <div
          className="group relative rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-zinc-200/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow select-none"
        >
        {/* Left Floating Arrow on Desktop */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous feature"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 hover:bg-white text-zinc-700 hover:text-black border border-zinc-200 shadow-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Floating Arrow on Desktop */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next feature"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 hover:bg-white text-zinc-700 hover:text-black border border-zinc-200 shadow-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 0 && (
            /* ── TAB 0: STREAM-PROOF PROOF (DUAL POV LIVE TOGGLE) ──── */
            <motion.div
              key="tab-streamproof"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40 || info.velocity.x < -400) {
                  handleNext();
                } else if (info.offset.x > 40 || info.velocity.x > 400) {
                  handlePrev();
                }
              }}
              className="p-5 sm:p-8 lg:p-9 cursor-grab active:cursor-grabbing touch-pan-y"
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
                    className={`px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${proofPOV === "screen"
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
                    className={`px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${proofPOV === "stream"
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
              <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[16/9] flex items-center justify-center group shadow-sm border border-zinc-200/40">
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
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -400) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 400) {
                    handlePrev();
                  }
                }}
                className="p-5 sm:p-8 lg:p-9 cursor-grab active:cursor-grabbing touch-pan-y"
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

                <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[16/9] flex items-center justify-center group shadow-sm border border-zinc-200/40">
                  <img
                    src="/proof/your-screen.webp"
                    alt="Assault Fire Wallhack ESP with 2D/3D Bounding Boxes"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />

                  {/* Clean Unobtrusive Top-Left Badge (Never blocks soldiers/crosshairs) */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-600/90 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      Adaptive Bounding Boxes Active
                    </span>
                  </div>

                  {/* Click to Expand Button */}
                  <button
                    type="button"
                    onClick={() =>
                      onPreviewImage?.({
                        url: "/proof/your-screen.webp",
                        title: "Wallhack ESP: 2D/3D Bounding Boxes & Distance Meters",
                      })
                    }
                    className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Click to Expand</span>
                  </button>
                </div>

                {/* Clean Caption Bar OUTSIDE/BELOW the Image (100% Unobscured Gameplay) */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 text-zinc-900 font-semibold font-sans">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Renders real-time enemy distance, weapon tags, and health status through walls & obstacles.</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px] shrink-0 font-medium bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                    Zero Framerate Lag
                  </span>
                </div>
              </motion.div>
            )
          }

          {
            activeTab === 2 && (
              /* ── TAB 2: BONE SKELETON & AIMBOT ─────────────────────── */
              <motion.div
                key="tab-aimbot"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -400) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 400) {
                    handlePrev();
                  }
                }}
                className="p-5 sm:p-8 lg:p-9 cursor-grab active:cursor-grabbing touch-pan-y"
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

                <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[21/9] min-h-[380px] flex items-center justify-center p-6 sm:p-10 border border-zinc-200/40">
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
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -400) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 400) {
                    handlePrev();
                  }
                }}
                className="p-5 sm:p-8 lg:p-9 cursor-grab active:cursor-grabbing touch-pan-y"
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

                <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[21/9] min-h-[380px] flex items-center justify-center p-6 sm:p-10 lg:p-12 text-white border border-zinc-200/40">
                  <div className="max-w-2xl text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight">
                      Instant Device Ban Removal
                    </h4>
                    <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-sans leading-relaxed max-w-xl mx-auto">
                      Peace Cleaner removes device bans so you can play Assault Fire immediately. Flushes residual anti-cheat tokens, clears hardware identifiers, and purges standby memory caches.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <span className="px-3.5 py-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700/60 text-xs font-mono text-zinc-200">
                        NIC MAC Address: Spoofed
                      </span>
                      <span className="px-3.5 py-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700/60 text-xs font-mono text-zinc-200">
                        Registry Trace: Purged
                      </span>
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-400 font-bold">
                        Status: 100% Undetected
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          }
        </AnimatePresence>

        {/* Mobile Swipe Hint Bar */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 pb-3 text-[11px] text-zinc-400 font-sans">
          <span>👈 Swipe image left or right 👉</span>
        </div>
      </div>
      </div>

      {/* ─── INFO SECTION BELOW (MATCHING 2ND SCREENSHOT) ───────────── */}
      < div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start" >
        {/* Left Column: Heading & Another Buy Button */}
        < div className="lg:col-span-5 space-y-5" >
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

        {/* Right Column: 3 Bullet Items with Custom Checked Icons */}
        < div className="lg:col-span-7 space-y-4 pt-1" >
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
              <strong className="text-black font-semibold">Silent kernel offset sync,</strong> automatic updates after every game patch, and zero framerate lag or micro-stutters.
            </p>
          </div>
        </div >
      </div >
    </div >
  );
}
