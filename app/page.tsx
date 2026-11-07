"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  EyeOff,
  Eye,
  Zap,
  Crosshair,
  Cpu,
  Layers,
  Monitor,
  Video,
  Maximize2,
  X,
} from "lucide-react";
import PricingSection from "@/components/ui/pricing-section";
import { StreamproofShowcase } from "@/components/ui/StreamproofShowcase";
import { PaperCutDivider } from "@/components/ui/PaperCutDivider";
import CheckoutModal from "@/components/CheckoutModal";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import TermsModal from "@/components/TermsModal";
import DiscordIcon from "@/components/DiscordIcon";
import { useDiscordAuth } from "@/context/DiscordAuthContext";

export default function HomePage() {
  const { user } = useDiscordAuth();
  const [selectedPlan, setSelectedPlan] = useState<{
    tier: string;
    price: number;
    description: string;
    isLifetime?: boolean;
  } | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="w-full">
      {/* ─── MINIMALIST HERO (SKRIPT.GG STYLE) ────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 overflow-hidden select-none">
        {/* Left Floating 3D Card (using public/img-1.png) */}
        <div className="hidden xl:block absolute left-4 2xl:left-12 top-1/2 -translate-y-1/2 pointer-events-none z-10 animate-float-slow">
          <img
            src="/img-1.png"
            alt="Aimbot 3D Interface Element"
            className="w-72 2xl:w-88 select-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)] transform -rotate-12 transition-transform duration-700"
          />
        </div>

        {/* Right Floating 3D Cards (Wallhack & Profiles Claymorphic Card matching Skript.gg) */}
        <div className="hidden xl:block absolute right-4 2xl:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-10 animate-float-reverse">
          {/* Background Blurred Profile Card */}
          <div className="absolute -top-12 -right-3 w-48 2xl:w-52 p-4 rounded-3xl bg-white/75 border border-white shadow-lg backdrop-blur-md transform rotate-12 opacity-85">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold text-zinc-500 mb-2">
              <span>Profiles</span>
              <span className="text-[10px] text-zinc-400">#01</span>
            </div>
            <div className="py-2 px-3 rounded-2xl bg-zinc-100/90 text-xs font-mono font-bold text-black flex items-center justify-between shadow-xs">
              <span>EZ Win</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Main Wallhack Card */}
          <div className="relative w-64 2xl:w-76 p-5 2xl:p-6 rounded-[2.5rem] bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border border-white/95 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.16),inset_0_2px_4px_rgba(255,255,255,1)] transform rotate-6">
            <div className="flex items-center justify-between mb-4 2xl:mb-5">
              <span className="text-xl 2xl:text-2xl font-black text-black font-sans tracking-tight">Wallhack</span>
              <div className="h-8 w-8 rounded-xl bg-zinc-100/80 flex items-center justify-center text-zinc-700">
                <Eye className="h-4 w-4" />
              </div>
            </div>

            {/* Toggle 1 - Active Red */}
            <div className="mb-3 flex items-center justify-between p-2 rounded-2xl bg-zinc-200/50 shadow-inner">
              <div className="h-3.5 w-20 2xl:w-24 rounded-lg bg-zinc-300/60" />
              <div className="h-6 w-11 rounded-full bg-[#E53935] p-0.5 flex items-center justify-end shadow-md shadow-red-500/30">
                <div className="h-5 w-5 rounded-full bg-white shadow-xs" />
              </div>
            </div>

            {/* Toggle 2 - Active Red */}
            <div className="mb-3.5 flex items-center justify-between p-2 rounded-2xl bg-zinc-200/50 shadow-inner">
              <div className="flex gap-1.5">
                <div className="h-3.5 w-5 rounded-full bg-zinc-300/70" />
                <div className="h-3.5 w-12 2xl:w-14 rounded-lg bg-zinc-300/60" />
              </div>
              <div className="h-6 w-11 rounded-full bg-[#E53935] p-0.5 flex items-center justify-end shadow-md shadow-red-500/30">
                <div className="h-5 w-5 rounded-full bg-white shadow-xs" />
              </div>
            </div>

            {/* Pill slots */}
            <div className="space-y-2">
              <div className="h-5 w-full rounded-xl bg-zinc-200/40 shadow-inner" />
              <div className="h-5 w-3/4 rounded-xl bg-zinc-200/35 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Ambient Floating Clay Pill on Bottom-Left */}
        <div className="hidden xl:block absolute left-20 bottom-10 pointer-events-none z-0 animate-float-subtle">
          <div className="h-9 w-20 rounded-full bg-white/70 border border-white/80 shadow-md backdrop-blur-sm" />
        </div>

        {/* Center Content Container */}
        <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto">
          {/* Crown Emblem (matching the iconic Skript.gg crown above title) */}
          <div className="mb-2 sm:mb-3 flex items-center justify-center">
            <svg
              className="w-10 h-10 sm:w-14 sm:h-14 text-[#E53935] drop-shadow-[0_8px_24px_rgba(229,57,53,0.35)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[7.5rem] font-black tracking-tight text-black font-sans leading-none whitespace-nowrap">
            REDLINE<span className="text-xl xs:text-2xl sm:text-4xl md:text-6xl font-extrabold text-zinc-400 lowercase tracking-normal">.vip</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl lg:text-2xl text-zinc-600 font-sans tracking-tight">
            Your <strong className="font-extrabold text-black">foolproof solution</strong> to winning.
          </p>

          {/* Social Proof Pill (matching Skript.gg social proof banner) */}
          <div className="mt-6 sm:mt-8 inline-flex flex-wrap sm:flex-nowrap justify-center items-center gap-2.5 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-3xl sm:rounded-full bg-white/95 border border-zinc-200/90 shadow-sm text-xs sm:text-sm font-sans text-zinc-700 backdrop-blur-md max-w-full">
            <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
              <img
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover"
                src="/avatars/avatar-1.svg"
                alt="Member Avatar"
              />
              <img
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover"
                src="/avatars/avatar-2.svg"
                alt="Member Avatar"
              />
              <img
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover"
                src="/avatars/avatar-3.svg"
                alt="Member Avatar"
              />
              <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#5865F2] ring-2 ring-white text-white p-1">
                <DiscordIcon className="h-full w-full fill-current" />
              </span>
            </div>
            <span className="text-zinc-600 text-center sm:text-left">
              Join <strong className="font-bold text-black">2.5K+ members</strong> on Discord, 280 online now.{" "}
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN"}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#E53935] hover:underline whitespace-nowrap"
              >
                Join now
              </a>
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-black hover:bg-zinc-800 active:scale-95 text-white font-bold font-sans text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore VIP Membership</span>
              <ChevronRight className="h-4 w-4 text-[#E53935]" />
            </a>
            <a
              href="#streamproof"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 active:scale-95 text-black border border-zinc-200/90 font-semibold font-sans text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <EyeOff className="h-4 w-4 text-emerald-600" />
              <span>Watch Stream-Proof Proof</span>
            </a>
          </div>

          {/* Mobile 3D preview card */}
          <div className="xl:hidden mt-8 w-full max-w-xs flex justify-center">
            <img
              src="/img-1.png"
              alt="Aimbot 3D Card"
              className="w-48 sm:w-56 drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] select-none"
            />
          </div>
        </div>
      </section>

      {/* ─── 2ND SECTION: EDITORIAL SIMPLICITY (SKRIPT.GG STYLE) ──── */}
      <section id="features" className="scroll-mt-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto py-14 sm:py-20 lg:py-24 select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-14 items-start">
          {/* Column 1: Headline */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-tight leading-[1.06] font-sans text-black">
              Pure precision,
              <span className="block text-[#8E95A2] font-semibold mt-1">
                zero detection.
              </span>
            </h2>
            <p className="text-sm sm:text-[15px] font-semibold text-zinc-600 leading-snug max-w-[260px] mt-3">
              Engineered specifically for competitive Assault Fire.
            </p>
          </div>

          {/* Column 2: 100% Stream-Proof */}
          <div className="space-y-3.5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-[#E53935] shadow-xs mb-3">
              <EyeOff className="h-4 w-4 stroke-[1.8]" />
            </div>
            <h3 className="text-xl sm:text-[1.35rem] font-black font-sans text-black tracking-tight mb-2.5">
              100% Stream-Proof.
            </h3>
            <p className="text-xs sm:text-[13.5px] text-zinc-500 font-sans leading-relaxed text-pretty">
              Stream, record, and share your screen on Discord or OBS with total confidence. Viewers and recordings only see clean, natural gameplay while you keep your full visual edge.
            </p>
          </div>

          {/* Column 3: Smooth & Undetected */}
          <div className="space-y-3.5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-[#E53935] shadow-xs mb-3">
              <ShieldCheck className="h-4 w-4 stroke-[1.8]" />
            </div>
            <h3 className="text-xl sm:text-[1.35rem] font-black font-sans text-black tracking-tight mb-2.5">
              Smooth & Undetected.
            </h3>
            <p className="text-xs sm:text-[13.5px] text-zinc-500 font-sans leading-relaxed text-pretty">
              Keeps your account and device protected across every match with zero framerate lag or stutters. Always updated for the latest game patches so you can just log in and dominate.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TORN PAPER SEPARATION CUT & TEXTURED GREEN SECTION ─── */}
      <div className="relative w-full my-4 sm:my-8">
        {/* Top Paper Cut Divider (White Canvas to Green Paper Transition) */}
        <PaperCutDivider position="top" fillColor="#E2EAE2" />

        {/* Textured Green Paper Canvas */}
        <div className="w-full bg-paper-cut-green py-12 sm:py-20 space-y-16 sm:space-y-24">
          {/* Pricing Section (with "TAKE CONTROL / From here, the game plays your way") */}
          <section id="pricing" className="scroll-mt-24">
            <PricingSection onSelectPlan={(plan) => setSelectedPlan(plan)} />
          </section>

          {/* Stream-Proof Auto-Sliding Showcase with Info & Buy Button (Skript.gg Style) */}
          <StreamproofShowcase
            onSelectPlan={(plan) => setSelectedPlan(plan)}
            onPreviewImage={(img) => setPreviewImage(img)}
          />
        </div>

        {/* Bottom Paper Cut Divider (Green Paper to White Canvas Transition) */}
        <PaperCutDivider position="bottom" fillColor="#E2EAE2" />
      </div>


      {/* ─── MODALS ────────────────────────────────────────────── */}
      <CheckoutModal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        onSuccess={(orderNum) => {
          setSelectedPlan(null);
          setSuccessOrderNumber(orderNum);
        }}
      />
      <OrderConfirmationModal
        isOpen={Boolean(successOrderNumber)}
        orderNumber={successOrderNumber}
        onClose={() => setSuccessOrderNumber(null)}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* ─── STREAM-PROOF IMAGE LIGHTBOX MODAL ────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0A0A0B] rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <span className="font-bold text-xs sm:text-sm text-white font-sans truncate max-w-[80%]">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative bg-black flex items-center justify-center max-h-[80vh] overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-auto object-contain max-h-[75vh] rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
