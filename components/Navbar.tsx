"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDiscordAuth } from "@/context/DiscordAuthContext";
import {
  Shield,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lock,
  Key,
  Menu,
  X,
} from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";
export default function Navbar() {
  const pathname = usePathname();
  const { user, loginWithDiscord, logout } = useDiscordAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-cyber-bg/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="h-9 w-9 rounded-lg bg-cyber-card border border-red-500/40 flex items-center justify-center shadow-sm group-hover:border-red-500 transition-all overflow-hidden p-1 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Red Line Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-extrabold tracking-wider text-base sm:text-lg text-white group-hover:text-red-400 transition-colors font-mono whitespace-nowrap">
                RED LINE
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/#pricing"
                className={`transition-colors hover:text-cyber-neon ${pathname === "/#pricing" ? "text-cyber-neon" : "text-zinc-300"
                  }`}
              >
                Pricing & Plans
              </Link>
              <Link
                href="/#features"
                className={`transition-colors hover:text-cyber-neon ${pathname === "/#features" ? "text-cyber-neon" : "text-zinc-300"
                  }`}
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 transition-colors hover:text-cyber-neon ${pathname === "/dashboard"
                  ? "text-cyber-neon font-semibold"
                  : "text-zinc-300"
                  }`}
              >
                <Key className="h-4 w-4 text-cyber-neon" />
                My License
              </Link>
            </nav>

            {/* Right User Actions */}
            <div className="flex items-center gap-3">
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all font-mono"
              >
                <span>Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              {user ? (
                /* Authenticated User Menu */
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-cyber-card border border-white/[0.1] hover:border-cyber-neon/40 transition-all text-sm"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-6 w-6 rounded-full border border-cyber-neon/50 object-cover"
                    />
                    <span className="font-medium text-white max-w-[120px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-cyber-card border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                        <p className="text-[11px] text-zinc-400 uppercase font-mono tracking-wider">
                          Authenticated via Discord
                        </p>
                        <p className="text-xs text-zinc-300 font-mono truncate">
                          ID: {user.id}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.05] hover:text-cyber-neon rounded-lg transition-colors font-medium"
                      >
                        <Key className="h-4 w-4 text-cyber-neon" />
                        VIP Dashboard & Key
                      </Link>

                      <div className="border-t border-white/[0.06] my-1"></div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Connect Discord CTA */
                <button
                  onClick={() => loginWithDiscord()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  <DiscordIcon className="h-4 w-4 fill-current" />
                  <span>Connect Discord</span>
                </button>
              )}
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-cyber-card border border-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#0b0e14]/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 font-mono">
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/[0.05] transition-colors"
            >
              <span>Pricing & Plans</span>
              <span className="text-xs text-red-400">From ₱500</span>
            </Link>

            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/[0.05] transition-colors"
            >
              <span>System Architecture</span>
              <span className="text-xs text-zinc-500">Specs</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-red-500" />
                <span>My VIP License Portal</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>

            <div className="border-t border-white/[0.06] pt-2">
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <span>Join Discord Syndicate</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

