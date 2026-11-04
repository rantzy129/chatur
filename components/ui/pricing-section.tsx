"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import {
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
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
  // Annual / Monthly Toggle Switch
  const [isAnnual, setIsAnnual] = useState(false);
  const [isWeeklyRedline, setIsWeeklyRedline] = useState(false);

  const pricingRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 20,
      opacity: 0,
    },
  };

  const triggerConfetti = () => {
    if (switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      fireConfetti({
        origin: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
        count: 90,
      });
    } else {
      fireConfetti({ count: 90 });
    }
  };

  const handleToggleSwitch = () => {
    setIsWeeklyRedline(false);
    const next = !isAnnual;
    setIsAnnual(next);
    if (next) {
      triggerConfetti();
    }
  };

  const handleSetAnnual = (target: boolean) => {
    setIsWeeklyRedline(false);
    if (target === isAnnual) return;
    setIsAnnual(target);
    if (target) {
      triggerConfetti();
    }
  };

  const handleSelectRedline = () => {
    const isWeekly = isWeeklyRedline;
    const price = isWeekly ? 500 : isAnnual ? 3000 : 1000;
    const durationLabel = isWeekly ? "1 Week" : isAnnual ? "Lifetime" : "1 Month";

    onSelectPlan?.({
      tier: `Red Line Cheats - ${durationLabel}`,
      price,
      description:
        "Tactical stream-proof visual overlay suite engineered specifically for Assault Fire PH.",
      isLifetime: isAnnual && !isWeekly,
    });
  };

  const handleSelectCleaner = () => {
    const price = isAnnual ? 3000 : 1000;
    const durationLabel = isAnnual ? "Lifetime" : "1 Month";

    onSelectPlan?.({
      tier: `Peace Cleaner - ${durationLabel}`,
      price,
      description:
        "1-click engine cache, standby memory, and registry purge engineered specifically for Assault Fire PH.",
      isLifetime: isAnnual,
    });
  };

  return (
    <div
      ref={pricingRef}
      className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 mx-auto bg-white text-black"
    >
      {/* Subtle Atmospheric Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-[400px] z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(229,57,53,0.08) 0%, transparent 75%)",
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-10 max-w-2xl mx-auto space-y-3">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-black leading-tight"
        >
          DEPLOYMENT PACKAGES
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed"
        >
          Every tier includes instant Discord OAuth activation, single-machine cryptographic binding, and continuous update coverage.
        </TimelineContent>
      </div>

      {/* ─── ANNUAL / MONTHLY TOGGLE SWITCH ───────────────────────── */}
      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-20 flex justify-center mb-12"
      >
        <div className="flex items-center justify-center gap-3.5 select-none">
          <button
            type="button"
            onClick={() => handleSetAnnual(false)}
            className={`font-sans text-sm font-semibold transition-colors cursor-pointer ${!isAnnual && !isWeeklyRedline ? "text-black font-bold" : "text-zinc-400 hover:text-black"
              }`}
          >
            Monthly
          </button>

          {/* Toggle Switch matching user request & screenshot */}
          <motion.button
            ref={switchRef}
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={handleToggleSwitch}
            animate={{
              backgroundColor: isAnnual ? "#000000" : "#D4D4D8",
            }}
            transition={{ duration: 0.2 }}
            className="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <span className="sr-only">Toggle annual billing</span>
            <motion.span
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md"
            />
          </motion.button>

          <button
            type="button"
            onClick={() => handleSetAnnual(true)}
            className={`font-sans text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${isAnnual ? "text-black font-bold" : "text-zinc-400 hover:text-black"
              }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-[#E53935] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Save 70%
            </span>
          </button>
        </div>
      </TimelineContent>

      {/* ─── TWO STREAMLINED PRODUCT CARDS ───────────────────────── */}
      <div className="relative z-10 grid lg:grid-cols-2 max-w-5xl gap-8 mx-auto items-stretch">
        {/* ── CARD 1: Red Line Cheats (FLAGSHIP) ──────────────────── */}
        <TimelineContent
          as="div"
          animationNum={3}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="h-full"
        >
          <Card className="relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-black bg-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 h-full">
            <CardHeader className="p-0 text-left space-y-4">
              {/* Title & Punchy Micro-Tagline */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-black">
                  RED LINE CHEATS
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-sans mt-1.5 leading-relaxed">
                  Stream-proof tactical visual overlay suite for <strong className="text-black font-semibold">Assault Fire PH</strong>.
                </p>
              </div>

              {/* Duration Options */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 border border-zinc-200 w-full sm:w-fit">
                  <button
                    type="button"
                    onClick={() => setIsWeeklyRedline(true)}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                      isWeeklyRedline
                        ? "bg-black text-white shadow-sm"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    1 Week (₱500)
                  </button>

                  <div className="relative flex-1 sm:flex-initial">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-emerald-500 text-white shadow-sm pointer-events-none z-10">
                      Best Seller!
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsWeeklyRedline(false);
                        setIsAnnual(false);
                      }}
                      className={`w-full px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                        !isWeeklyRedline && !isAnnual
                          ? "bg-black text-white shadow-sm"
                          : "text-zinc-600 hover:text-black"
                      }`}
                    >
                      1 Month (₱1,000)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsWeeklyRedline(false);
                      setIsAnnual(true);
                      triggerConfetti();
                    }}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                      !isWeeklyRedline && isAnnual
                        ? "bg-black text-white shadow-sm"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    Annual (₱3,000)
                  </button>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="py-4 border-y border-zinc-200 flex items-baseline">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight mr-1 text-black">
                  ₱
                </span>
                <NumberFlow
                  value={isWeeklyRedline ? 500 : isAnnual ? 3000 : 1000}
                  className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-black tabular-nums"
                />
                <span className="text-xs sm:text-sm text-zinc-500 font-mono ml-2">
                  / {isWeeklyRedline ? "7 days access" : isAnnual ? "lifetime permanent" : "30 days access"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6 space-y-6 flex-1 flex flex-col justify-between">
              {/* Primary Authorization CTA Button */}
              <button
                type="button"
                onClick={handleSelectRedline}
                className="w-full py-3.5 px-6 rounded-2xl font-bold font-sans text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] bg-black hover:bg-zinc-800 text-white shadow-black/10 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="h-4 w-4 text-[#E53935]" />
              </button>

              {/* Scannable, Clean Feature Checklist */}
              <ul className="space-y-3 font-sans text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">100% Stream-Proof HUD.</strong> Invisible on OBS Studio & Discord
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Adaptive Skeleton & ESP.</strong> Precise distance tracking & boxes
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Native 144Hz-360Hz Sync.</strong> Zero input lag or FPS loss
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Single-Seat Cryptographic Lock.</strong> Instant Discord OAuth binding
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Continuous Updates & Role.</strong> Verified VIP Discord Syndicate
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TimelineContent>

        {/* ── CARD 2: PEACE CLEANER (OPTIMIZER) ───────────────────── */}
        <TimelineContent
          as="div"
          animationNum={4}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="h-full"
        >
          <Card className="relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-zinc-200 hover:border-zinc-400 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 h-full">
            <CardHeader className="p-0 text-left space-y-4">
              {/* Title & Punchy Micro-Tagline */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-black">
                  PEACE CLEANER
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-sans mt-1.5 leading-relaxed">
                  1-click engine cache purge & FPS stabilizer for <strong className="text-black font-semibold">Assault Fire PH</strong>.
                </p>
              </div>

              {/* Duration Options */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 border border-zinc-200 w-full sm:w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAnnual(false);
                      setIsWeeklyRedline(false);
                    }}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                      !isAnnual
                        ? "bg-black text-white shadow-sm"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    1 Month (₱1,000)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAnnual(true);
                      triggerConfetti();
                    }}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                      isAnnual
                        ? "bg-black text-white shadow-sm"
                        : "text-zinc-600 hover:text-black"
                    }`}
                  >
                    Annual (₱3,000)
                  </button>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="py-4 border-y border-zinc-200 flex items-baseline">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight mr-1 text-black">
                  ₱
                </span>
                <NumberFlow
                  value={isAnnual ? 3000 : 1000}
                  className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-black tabular-nums"
                />
                <span className="text-xs sm:text-sm text-zinc-500 font-mono ml-2">
                  / {isAnnual ? "lifetime permanent" : "30 days access"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6 space-y-6 flex-1 flex flex-col justify-between">
              {/* Primary Authorization CTA Button */}
              <button
                type="button"
                onClick={handleSelectCleaner}
                className="w-full py-3.5 px-6 rounded-2xl font-bold font-sans text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] bg-black hover:bg-zinc-800 text-white shadow-black/10 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="h-4 w-4 text-[#E53935]" />
              </button>

              {/* Scannable, Clean Feature Checklist */}
              <ul className="space-y-3 font-sans text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-zinc-900 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">1-Click Engine Purge.</strong> Flushes shader cache & match buffers
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-zinc-900 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">FPS & Memory Stabilization.</strong> Eliminates micro-stutter & crashes
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-zinc-900 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">100% External Utility.</strong> Zero game file or memory modification
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-zinc-900 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Single-Seat Hardware Lock.</strong> Bound to your Discord account
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCheck className="h-4 w-4 text-zinc-900 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-800 leading-snug">
                    <strong className="text-black font-semibold">Continuous Updates.</strong> All future Peace Cleaner revisions included
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TimelineContent>
      </div>
    </div>
  );
}
