import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  return (
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

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-3">
          <p>© 2026 Red Line VIP. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-400">All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
