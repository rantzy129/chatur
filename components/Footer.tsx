"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import TermsModal from "@/components/TermsModal";

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  return (
    <>
      <footer className="w-full border-t border-white/[0.08] bg-black/40 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8">
            {/* Brand */}
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2.5 text-white font-mono font-bold text-lg group flex-shrink-0">
                <div className="h-7 w-7 rounded-md bg-cyber-card border border-red-500/40 flex items-center justify-center overflow-hidden p-0.5 group-hover:border-red-500 transition-colors flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Red Line Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="whitespace-nowrap">RED LINE</span>
              </Link>
              <p className="text-xs text-zinc-400 max-w-sm font-sans leading-relaxed">
                Private tactical visual engine engineered for competitive performance and stream isolation.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <nav className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <Link
                href="/#pricing"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Pricing & Plans
              </Link>
              <Link
                href="/#features"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Architecture
              </Link>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Customer Portal
              </Link>
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
              >
                Terms of Service
              </button>
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </nav>
          </div>

          {/* Disclaimer Notice Banner */}
          <div className="py-4 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>
                Engine Status: <strong className="text-emerald-400">UNDETECTED</strong> • Direct Swapchain Invisibility
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-zinc-500 font-sans">
                Strictly Non-Refundable • Software is used at your own operational risk.
              </p>
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-red-400 hover:text-red-300 underline font-mono text-[10px] whitespace-nowrap"
              >
                View Terms
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-3">
            <p>© 2026 Red Line VIP. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-zinc-300 transition-colors font-mono cursor-pointer"
              >
                Terms & Non-Refundable Policy
              </button>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-zinc-400">Systems Undetected</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
}