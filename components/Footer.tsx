"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TermsModal from "@/components/TermsModal";
import DiscordIcon from "@/components/DiscordIcon";

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  return (
    <>
      {/* ─── FULL-BLEED FOOTER USING PUBLIC/FOOTER.JPG AS SECTION BACKGROUND ─── */}
      <footer
        className="relative w-full text-white bg-[#8E171E] bg-cover bg-left sm:bg-center bg-no-repeat overflow-hidden border-t border-red-950/40 mt-16 sm:mt-24 select-none"
        style={{ backgroundImage: "url('/footer.jpg')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pb-8 text-center sm:text-left">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 text-white font-sans font-black text-xl shrink-0 cursor-pointer outline-none focus:outline-none group"
              >
                <div className="relative flex items-center h-8">
                  <img
                    src="/logo.png"
                    alt="Red Line VIP Sniper"
                    className="h-6 sm:h-7 w-auto max-w-[90px] sm:max-w-[110px] object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="whitespace-nowrap tracking-tight font-black text-white pointer-events-none">
                  REDLINE<span className="text-white/60 font-bold text-xs uppercase tracking-wider ml-0.5">.vip</span>
                </span>
              </Link>
              <p className="text-xs text-white/80 max-w-sm font-sans leading-relaxed">
                Undetected tactical cheat suite and stream-proof wallhack engineered for all Assault Fire servers.
              </p>
            </div>

            {/* Essential Clean Navigation: Terms, FAQ, Discord */}
            <nav className="flex items-center justify-center gap-6 sm:gap-8 font-sans text-sm font-semibold">
              <Link
                href="/terms"
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                Terms
              </Link>
              <Link
                href="/faq"
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </Link>
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <DiscordIcon className="h-4 w-4 fill-current text-white" />
                <span>Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </nav>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 font-mono gap-3 text-center sm:text-left">
            <p>© 2026 Red Line VIP. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white/85">Assault Fire Systems Undetected</span>
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
