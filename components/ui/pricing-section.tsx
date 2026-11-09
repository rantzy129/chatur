"use client";

import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Crosshair,
  Sparkles,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fireConfetti } from "@/lib/confetti";

interface PricingSectionProps {
  onSelectPlan?: (plan: {
    tier: string;
    price: number;
    description: string;
    isLifetime?: boolean;
  }) => void;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  // 0: Before (hero.png on Left, text on Right)
  // 1: After (text on Left, hero-2.jpg on Right)
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);

  // Selected product & duration inside the Buy Now view
  const [selectedProduct, setSelectedProduct] = useState<"cheats" | "cleaner">("cheats");
  const [selectedDuration, setSelectedDuration] = useState<"weekly" | "monthly" | "lifetime">("monthly");

  const pricingRef = useRef<HTMLDivElement>(null);

  const goToSlide = (target: 0 | 1) => {
    setActiveSlide(target);
  };

  const getPrice = () => {
    if (selectedProduct === "cheats") {
      if (selectedDuration === "weekly") return 500;
      if (selectedDuration === "lifetime") return 3000;
      return 1000;
    } else {
      if (selectedDuration === "lifetime") return 3000;
      return 1000;
    }
  };

  const getDurationLabel = () => {
    if (selectedDuration === "weekly") return "7 Days VIP Access";
    if (selectedDuration === "lifetime") return "Lifetime Permanent";
    return "30 Days VIP Access";
  };

  const handleBuyNow = () => {
    if (selectedProduct === "cheats") {
      // Purchases for Red Line Cheats are closed
      return;
    }

    const isLifetime = selectedDuration === "lifetime";
    const price = getPrice();

    if (isLifetime) {
      fireConfetti({ count: 90 });
    }

    if (selectedProduct === "cheats") {
      const durationTag =
        selectedDuration === "weekly"
          ? "1 Week"
          : selectedDuration === "lifetime"
          ? "Lifetime"
          : "1 Month";

      onSelectPlan?.({
        tier: `Red Line Cheats - ${durationTag}`,
        price,
        description:
          "Undetected stream-proof cheat & wallhack suite for all Assault Fire servers.",
        isLifetime,
      });
    } else {
      const durationTag = isLifetime ? "Lifetime" : "1 Month";
      onSelectPlan?.({
        tier: `Peace Cleaner - ${durationTag}`,
        price,
        description:
          "Removes the device ban you got so you will be able to play Assault Fire again immediately.",
        isLifetime,
      });
    }
  };

  const currentPrice = getPrice();

  return (
    <div
      ref={pricingRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 text-black select-none"
    >
      {/* ─── SECTION HEADER (SKRIPT.GG TAKE CONTROL) ────────────────── */}
      <div className="relative z-10 text-center mb-10 sm:mb-16 max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] font-mono font-bold tracking-widest text-[#E53935] uppercase shadow-xs">
          TAKE CONTROL
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-bold font-sans tracking-tight text-black leading-[1.06]">
          From here,{" "}
          <span className="text-[#8E95A2] font-semibold block sm:inline">
            the game plays your way.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed max-w-xl mx-auto">
          Pick yours below. Each page walks you through exactly what changes the moment you load in.
        </p>
      </div>

      {/* ─── FLOATING DECORATIVE SLANTED STRIPES (FROM SKRIPT SCREENSHOT) ─── */}
      <div
        aria-hidden="true"
        className="hidden md:flex items-center gap-3 absolute right-[40%] top-60 rotate-[-25deg] opacity-35 pointer-events-none z-0"
      >
        <div className="h-1.5 w-18 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-10 rounded-full bg-zinc-300" />
      </div>

      {/* ─── MAIN PRODUCT SECTION: BEFORE & AFTER SWAPPING LAYOUT ────── */}
      <div className="relative z-10 min-h-[440px] sm:min-h-[480px] lg:min-h-[520px]">
        <div
          className={`w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            activeSlide === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* ─── CHARACTER COMPONENT (MOVES LEFT <-> RIGHT) ─────────── */}
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 26,
            }}
            className="w-full lg:w-7/12 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {activeSlide === 0 ? (
                /* Slide 0: hero.png (Standing Upright on Left) */
                <motion.div
                  key="hero-standing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex items-center justify-center cursor-pointer"
                  onClick={() => goToSlide(1)}
                  title="Click to view deployment options"
                >
                  <img
                    src="/hero.png"
                    alt="Assault Fire Squad Standing"
                    className="w-full max-h-[400px] sm:max-h-[460px] lg:max-h-[520px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.16)] select-none transition-transform duration-300 hover:scale-[1.01]"
                  />
                </motion.div>
              ) : (
                /* Slide 1: hero-2.jpg (Crouching & Aiming on Right) */
                <motion.div
                  key="hero-aiming"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex items-center justify-center cursor-pointer"
                  onClick={() => goToSlide(0)}
                  title="Click to view overview"
                >
                  <img
                    src="/hero-2.png"
                    alt="Assault Fire Squad Aiming"
                    className="w-full max-h-[400px] sm:max-h-[460px] lg:max-h-[520px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.16)] select-none transition-transform duration-300 hover:scale-[1.01]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── CONTENT COMPONENT (MOVES RIGHT <-> LEFT) ─────────── */}
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 26,
            }}
            className="w-full lg:w-5/12 relative flex flex-col justify-center pr-0 lg:pr-6"
          >
            <AnimatePresence mode="wait">
              {activeSlide === 0 ? (
                /* ── SLIDE 0 (BEFORE): ASSAULT FIRE OVERVIEW (RIGHT SIDE) ── */
                <motion.div
                  key="overview-content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Square Badges matching [A] [V] from screenshot */}
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100/90 border border-zinc-200/70 flex items-center justify-center shadow-xs">
                      <Crosshair className="h-5 w-5 text-[#E53935]" />
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-zinc-100/90 border border-zinc-200/70 flex items-center justify-center shadow-xs">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-black font-sans tracking-tight leading-[1.08]">
                      Assault Fire
                    </h3>
                  </div>

                  {/* Description matching reference */}
                  <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed max-w-md">
                    Works on all Assault Fire servers and client versions. However your match is set up, you'll run it on your terms.
                  </p>

                  {/* Signature Red Line Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => goToSlide(1)}
                      className="px-8 py-4 rounded-2xl bg-[#E53935] hover:bg-[#c62828] active:scale-95 text-white font-bold font-sans text-sm sm:text-base tracking-wide flex items-center gap-2.5 transition-all shadow-md hover:shadow-xl shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer"
                    >
                      <span>Red Line for Assault Fire</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── SLIDE 1 (AFTER): "SEE EVERYTHING, MISS NOTHING" (LEFT SIDE) ── */
                <motion.div
                  key="buynow-content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Signature 3-Line Headline matching reference screenshot */}
                  <h3 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.06] font-sans text-black">
                    <span className="block">See Everything,</span>
                    <span className="block text-zinc-400 font-extrabold mt-0.5">
                      Miss Nothing,
                    </span>
                    <span className="block text-black mt-0.5">
                      Own the Server.
                    </span>
                  </h3>

                  {/* Editorial Subtitle matching reference */}
                  <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed max-w-md">
                    The game looks different when nothing in it is hidden from you. Walk into every round, crossfire, and clutch already knowing how it ends.
                  </p>

                  {/* Software Suite Switcher */}
                  <div className="p-1 rounded-2xl bg-zinc-100/90 border border-zinc-200 flex items-center gap-1 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct("cheats")}
                      className={`flex-1 py-1.5 px-3 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
                        selectedProduct === "cheats"
                          ? "bg-white text-black shadow-xs"
                          : "text-zinc-500 hover:text-black"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        Red Line Cheats
                        <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                          Closed
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct("cleaner");
                        if (selectedDuration === "weekly") {
                          setSelectedDuration("monthly");
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
                        selectedProduct === "cleaner"
                          ? "bg-white text-black shadow-xs"
                          : "text-zinc-500 hover:text-black"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        Peace Cleaner
                        <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                          Available
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* Purchases Closed Info Note */}
                  {selectedProduct === "cheats" && (
                    <div className="p-3.5 rounded-2xl bg-zinc-100/90 border border-zinc-200 text-left space-y-1 max-w-md">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 uppercase tracking-wide">
                        <Lock className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Purchases Currently Closed</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        New license purchases for Red Line Cheats are temporarily closed. Existing subscribers can continue using their licenses via the dashboard. Peace Cleaner remains open for purchase.
                      </p>
                    </div>
                  )}

                  {/* Duration Selector Pills */}
                  <div className="grid grid-cols-3 gap-2 max-w-md w-full">
                    {selectedProduct === "cheats" && (
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("weekly")}
                        className={`py-2 px-2 sm:px-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedDuration === "weekly"
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <span className="block text-xs font-bold whitespace-nowrap">1 Week</span>
                        <span className="block text-[11px] font-mono opacity-80">₱500</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedDuration("monthly")}
                      className={`py-2 px-2 sm:px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDuration === "monthly"
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="block text-xs font-bold whitespace-nowrap">1 Month</span>
                      <span className="block text-[11px] font-mono opacity-80">₱1,000</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDuration("lifetime");
                        fireConfetti({ count: 90 });
                      }}
                      className={`relative py-2 px-2 sm:px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDuration === "lifetime"
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#E53935] text-white whitespace-nowrap shadow-xs">
                        -70%
                      </span>
                      <span className="block text-xs font-bold whitespace-nowrap">Lifetime</span>
                      <span className="block text-[11px] font-mono opacity-80">₱3,000</span>
                    </button>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-2 pt-1">
                    {selectedProduct === "cheats" ? (
                      <button
                        type="button"
                        disabled
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-200 text-zinc-500 font-bold font-sans text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 cursor-not-allowed shadow-none border border-zinc-300"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Purchases Closed</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E53935] hover:bg-[#c62828] active:scale-95 text-white font-bold font-sans text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-xl shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer"
                      >
                        <span>Buy Now ₱{currentPrice.toLocaleString()}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}

                    <div>
                      <button
                        type="button"
                        onClick={() => goToSlide(0)}
                        className="text-xs font-sans font-semibold text-zinc-400 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer pt-1"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        <span>Return to Overview</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ─── VERTICAL SLIDER PILL INDICATOR ON FAR RIGHT EDGE ──────── */}
        <div className="hidden lg:flex flex-col items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 select-none z-20">
          <button
            type="button"
            onClick={() => goToSlide(0)}
            aria-label="View Product Overview (Before)"
            className={`transition-all duration-300 cursor-pointer ${
              activeSlide === 0
                ? "h-7 w-2 rounded-full bg-black shadow-xs"
                : "h-2 w-2 rounded-full bg-zinc-300 hover:bg-zinc-500"
            }`}
          />
          <button
            type="button"
            onClick={() => goToSlide(1)}
            aria-label="View Product Pitch & Buy Now (After)"
            className={`transition-all duration-300 cursor-pointer ${
              activeSlide === 1
                ? "h-7 w-2 rounded-full bg-black shadow-xs"
                : "h-2 w-2 rounded-full bg-zinc-300 hover:bg-zinc-500"
            }`}
          />
        </div>
      </div>

      {/* Mobile Horizontal Slider Dots */}
      <div className="lg:hidden flex items-center justify-center gap-2 mt-6 select-none">
        <button
          type="button"
          onClick={() => goToSlide(0)}
          className={`transition-all duration-300 cursor-pointer ${
            activeSlide === 0
              ? "w-7 h-2 rounded-full bg-black"
              : "w-2 h-2 rounded-full bg-zinc-300"
          }`}
        />
        <button
          type="button"
          onClick={() => goToSlide(1)}
          className={`transition-all duration-300 cursor-pointer ${
            activeSlide === 1
              ? "w-7 h-2 rounded-full bg-black"
              : "w-2 h-2 rounded-full bg-zinc-300"
          }`}
        />
      </div>
    </div>
  );
}
