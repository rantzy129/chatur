"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  EyeOff,
  Eye,
  Zap,
  Crosshair,
  Cpu,
  Layers,
  HelpCircle,
  Monitor,
  Video,
  Maximize2,
  X,
} from "lucide-react";
import PricingSection from "@/components/ui/pricing-section";
import CheckoutModal from "@/components/CheckoutModal";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import TermsModal from "@/components/TermsModal";
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [proofView, setProofView] = useState<"both" | "overlay" | "clean">("both");
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Is this Assault Fire cheat completely undetected?",
      answer:
        "Yes. Red Line VIP uses driver-level stream isolation and non-invasive memory hooks that remain 100% undetected across all Assault Fire servers and versions. Our team pushes silent updates alongside every game patch to maintain undetected status.",
    },
    {
      question: "What features are included in the Assault Fire wallhack & ESP?",
      answer:
        "The suite includes 2D and 3D player bounding boxes, real-time distance meters, health bars, weapon icons, bone skeleton overlays for aim tracking, and the Peace Cleaner device ban removal engine.",
    },
    {
      question: "What is Peace Cleaner and how does it remove device bans?",
      answer:
        "Peace Cleaner removes the device ban you got so you will be able to play Assault Fire again immediately. It clears hardware identifiers, flushes anti-cheat tracking registries, and cleans residual tokens to restore full game access.",
    },
    {
      question: "Does the bone skeleton aimbot tracking work through walls and smoke?",
      answer:
        "Yes. The bone skeleton overlay highlights all player joints, heads, and hitboxes through walls, smoke grenades, and any visual obstruction, giving you precise crosshair alignment and target tracking at all times.",
    },
    {
      question: "Is the wallhack invisible during Discord screen sharing and OBS streams?",
      answer:
        "Yes, 100% stream-proof. Red Line runs on an isolated graphics render layer. When sharing your screen on Discord, streaming on OBS Studio, Streamlabs, or TikTok Live, your viewers see only clean gameplay with zero cheat visuals.",
    },
    {
      question: "Does this work on all Assault Fire servers and versions?",
      answer:
        "Yes. Red Line VIP is built with universal compatibility and works seamlessly across all Assault Fire servers and client versions with automatic detection and zero manual configuration.",
    },
    {
      question: "How do I download and activate the Assault Fire cheat?",
      answer:
        "Choose your plan (Weekly, Monthly, or Lifetime), pay via GCash or Maya, and link your Discord account. Once confirmed, your VIP license key and loader download appear instantly in your Customer Dashboard.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-20 pb-8 flex flex-col items-center text-center">
        {/* Category Pill */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono font-medium text-zinc-700 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
          <span>UNDETECTED ASSAULT FIRE CHEAT & WALLHACK SUITE</span>
        </div>

        {/* Brand Emblem */}
        <div className="relative z-10 mb-6 flex items-center justify-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-zinc-200 p-2.5 shadow-sm flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Red Line VIP - Assault Fire Cheats & Wallhack"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* H1 Headline */}
        <h1 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black font-sans uppercase leading-[0.98] max-w-4xl">
          <span>UNDETECTED ASSAULT FIRE</span>
          <br />
          <span className="text-[#E53935]">CHEAT & WALLHACK SUITE.</span>
        </h1>

        {/* Lead Paragraph */}
        <p className="relative z-10 mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed font-sans text-pretty">
          Stream-proof wallhack ESP, bone skeleton aimbot tracking, and the Peace Cleaner device ban removal system. Engineered to stay 100% undetected across all <strong className="text-black font-semibold">Assault Fire</strong> servers and versions.
        </p>

        {/* CTAs */}
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-bold font-sans text-sm tracking-wide transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <span>View Membership Plans</span>
            <ChevronRight className="h-4 w-4 text-[#E53935]" />
          </a>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-50 active:scale-[0.98] text-black border border-zinc-200 hover:border-zinc-300 hover:-translate-y-0.5 font-semibold font-sans text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <span>VIP License Portal</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-zinc-600">
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
            <span>100% Undetected</span>
          </div>
          <a
            href="#streamproof"
            className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl transition-all hover:border-zinc-400 group cursor-pointer whitespace-nowrap"
          >
            <EyeOff className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
            <span>Stream-Proof Proof</span>
            <ChevronRight className="h-3 w-3 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </a>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
            <Crosshair className="h-3.5 w-3.5 text-[#E53935] flex-shrink-0" />
            <span>Bone Skeleton Aim Tracking</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
            <Zap className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <span>Instant Key Delivery</span>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─────────────────────────────────────── */}
      <section id="features" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-mono font-semibold text-[#E53935] uppercase tracking-wider">
            Assault Fire Cheat Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight text-black">
            UNDETECTED WALLHACK & ESP FEATURES
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
            Everything you need for a competitive edge across all Assault Fire servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
                <EyeOff className="h-5 w-5 text-[#E53935]" />
              </div>
              <h3 className="font-bold text-base font-sans text-black">
                Undetected Wallhack ESP
              </h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                2D/3D player boxes, health bars, weapon tags, and distance meters rendered on an isolated buffer invisible to OBS, Discord, and screen capture.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">Stream-Proof Overlay</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
                <Crosshair className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-base font-sans text-black">
                Bone Skeleton Aim Tracking
              </h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                Precise joint and head tracking mapped to Assault Fire hitboxes for effortless pre-aiming and wall-penetration reads with zero visual delay.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">Hitbox Alignment</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
                <Cpu className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base font-sans text-black">
                Peace Cleaner Device Unban
              </h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                Removes the device ban you got so you will be able to play again. Clears HWID machine flags and anti-cheat tracking traces for all Assault Fire servers.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">Device Ban Removal</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-base font-sans text-black">
                All AF Servers Supported
              </h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                Seamless operation across all Assault Fire servers and client versions with automatic detection and zero manual configuration needed.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">Universal Compatibility</span>
          </div>
        </div>
      </section>

      {/* ─── STREAM-PROOF VISUAL COMPARISON (LIVE PROOF) ────────── */}
      <section id="streamproof" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-semibold text-emerald-700 uppercase tracking-wider">
            <EyeOff className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Stream-Proof Visual Isolation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight text-black">
            STREAM-PROOF IN ACTION: LIVE PROOF
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
            Direct comparison showing live in-game ESP visuals on your display versus what OBS Studio, Discord Screenshare, or your recording software captures.
          </p>

          {/* View Filter Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setProofView("both")}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                proofView === "both"
                  ? "bg-black text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setProofView("overlay")}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                proofView === "overlay"
                  ? "bg-black text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200"
              }`}
            >
              Your Screen (Overlay)
            </button>
            <button
              type="button"
              onClick={() => setProofView("clean")}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                proofView === "clean"
                  ? "bg-black text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200"
              }`}
            >
              Stream POV (Clean)
            </button>
          </div>
        </div>

        {/* Dual Cards Comparison Grid */}
        <div className={`grid gap-6 ${proofView === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-4xl mx-auto"}`}>
          {/* Card 1: What You See */}
          {(proofView === "both" || proofView === "overlay") && (
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-lg overflow-hidden flex flex-col justify-between transition-all hover:border-zinc-300">
              <div className="p-4 sm:px-5 sm:py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center flex-shrink-0">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm font-sans text-black uppercase tracking-tight truncate sm:whitespace-normal">
                      Your Screen (What You See)
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 truncate sm:whitespace-normal">
                      Physical Monitor Display
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] font-mono font-bold text-[#E53935] uppercase whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E53935] animate-pulse" />
                    <span>Live Overlay Active</span>
                  </span>
                </div>
              </div>

              <div
                onClick={() => setPreviewImage({ url: "/proof/your-screen.webp", title: "Your Screen (What You See) - Live ESP & Skeleton HUD Active" })}
                className="relative group cursor-pointer overflow-hidden bg-black aspect-video flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/proof/your-screen.webp"
                  alt="Assault Fire Cheat Your Screen View with ESP Wallhack"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-sans text-xs font-semibold backdrop-blur-[2px]">
                  <Maximize2 className="h-4 w-4" />
                  <span>Click to Expand High-Res</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-zinc-100 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-black">
                  <Eye className="h-3.5 w-3.5 text-[#E53935]" />
                  <span>Full Tactical Visibility</span>
                </div>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                  Real-time bone skeletons, player boxes, and distance tags render directly on your screen layer with zero lag.
                </p>
              </div>
            </div>
          )}

          {/* Card 2: What Discord / Stream Sees */}
          {(proofView === "both" || proofView === "clean") && (
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-lg overflow-hidden flex flex-col justify-between transition-all hover:border-zinc-300">
              <div className="p-4 sm:px-5 sm:py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm font-sans text-black uppercase tracking-tight truncate sm:whitespace-normal">
                      Screenshot & Stream POV
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 truncate sm:whitespace-normal">
                      OBS • Discord • Screen Capture
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 uppercase whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>100% Clean Capture</span>
                  </span>
                </div>
              </div>

              <div
                onClick={() => setPreviewImage({ url: "/proof/screenshot-pov.webp", title: "Screenshot & Stream POV - 100% Clean, Stream-Proof Capture" })}
                className="relative group cursor-pointer overflow-hidden bg-black aspect-video flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/proof/screenshot-pov.webp"
                  alt="Assault Fire Stream-Proof Proof - Clean Capture on Discord and OBS"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-sans text-xs font-semibold backdrop-blur-[2px]">
                  <Maximize2 className="h-4 w-4" />
                  <span>Click to Expand High-Res</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-zinc-100 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-black">
                  <EyeOff className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Zero Overlay Traces</span>
                </div>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                  Screen recording tools capture completely clean gameplay with zero cheat visuals. Safe for live streams and Discord screen share.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── PRICING SECTION ───────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-24">
        <PricingSection onSelectPlan={(plan) => setSelectedPlan(plan)} />
      </section>

      {/* ─── FAQ SECTION ───────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono font-medium text-zinc-700 uppercase">
            <HelpCircle className="h-3.5 w-3.5 text-[#E53935]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight text-black">
            ASSAULT FIRE CHEAT & WALLHACK FAQ
          </h2>
          <p className="text-sm text-zinc-600 font-sans">
            Common questions about detection, features, streaming, and activation.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-colors shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold font-sans text-black">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#E53935]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed border-t border-zinc-100">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SEO INFORMATION BLOCK ─────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
          <h3 className="text-lg font-bold font-sans text-black tracking-tight">
            About Assault Fire Cheats & Red Line VIP
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
            <strong className="text-black font-semibold">Assault Fire</strong> is an intense tactical first-person shooter with an active competitive community across multiple servers and versions. <strong className="text-black font-semibold">Red Line VIP</strong> is the premier undetected cheat and wallhack suite, offering players stream-proof ESP overlays, precision bone skeleton aim tracking, and the proprietary Peace Cleaner device ban removal engine. With single-seat encrypted HWID licensing and instant Discord activation, Red Line VIP delivers a decisive competitive advantage while keeping your account secure across all AF servers.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
            <span>All Assault Fire Servers Supported</span>
            <span>•</span>
            <span>Status: Undetected</span>
            <span>•</span>
            <span>OS: Windows 10 / 11 x64</span>
            <span>•</span>
            <span>Payment: GCash & Maya</span>
          </div>
        </div>
      </section>

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
