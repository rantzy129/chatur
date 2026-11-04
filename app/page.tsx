"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* ─── HERO SECTION (CLEAN EDITORIAL CANVAS) ──────────────── */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-20 pb-8 flex flex-col items-center text-center">
        {/* Brand Emblem */}
        <div className="relative z-10 mb-6 flex items-center justify-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-zinc-200 p-2.5 shadow-sm flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Red Line VIP"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Clean, Two-Line High-Craft Headline */}
        <h1 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black font-sans uppercase leading-[0.98] max-w-4xl">
          <span>TACTICAL VISUAL SUITE</span>
          <br />
          <span className="text-[#E53935]">FOR ASSAULT FIRE PH.</span>
        </h1>

        {/* Crisp Narrative */}
        <p className="relative z-10 mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed font-sans text-pretty">
          Private stream-isolated ESP, bone skeleton HUDs, and the Peace Cleaner memory optimization system. Engineered exclusively for <strong className="text-black font-semibold">Assault Fire PH</strong>.
        </p>

        {/* Clear Action CTAs */}
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
      </section>

      {/* ─── DYNAMIC PRICING SECTION (SHADCN + NUMBERFLOW + MOTION) ─ */}
      <section id="pricing" className="scroll-mt-24">
        <PricingSection onSelectPlan={(plan) => setSelectedPlan(plan)} />
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
