"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  EyeOff,
  Zap,
  Crosshair,
  Cpu,
  Layers,
  HelpCircle,
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
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-600">
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Undetected</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl">
            <EyeOff className="h-3.5 w-3.5 text-blue-600" />
            <span>Stream-Proof (Discord & OBS)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl">
            <Crosshair className="h-3.5 w-3.5 text-[#E53935]" />
            <span>Bone Skeleton Aim Tracking</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
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
    </div>
  );
}
