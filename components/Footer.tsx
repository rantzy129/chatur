"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TermsModal from "@/components/TermsModal";

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  return (
    <>
      <footer className="w-full border-t border-zinc-200 bg-zinc-50/95 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8">
            {/* Brand */}
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-3 text-black font-sans font-black text-lg group flex-shrink-0">
                <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden p-0.5 group-hover:border-[#E53935] transition-colors flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Red Line Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="whitespace-nowrap tracking-tight">RED LINE</span>
              </Link>
              <p className="text-xs text-zinc-600 max-w-sm font-sans leading-relaxed">
                Undetected tactical cheat suite and stream-proof wallhack engineered for all Assault Fire servers.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <nav className="flex flex-wrap items-center gap-6 font-sans text-xs sm:text-sm font-medium">
              <Link
                href="/#features"
                className="text-zinc-600 hover:text-black transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-zinc-600 hover:text-black transition-colors"
              >
                Pricing & Plans
              </Link>
              <Link
                href="/#faq"
                className="text-zinc-600 hover:text-black transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/dashboard"
                className="text-zinc-600 hover:text-black transition-colors"
              >
                Customer Portal
              </Link>
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 hover:text-black flex items-center gap-1 transition-colors"
              >
                <span>Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </nav>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-3">
            <p>© 2026 Red Line VIP. Engineered for Assault Fire. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-black transition-colors font-mono cursor-pointer"
              >
                Terms & Non-Refundable Policy
              </button>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-zinc-600">Systems Undetected</span>
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
