"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDiscordAuth } from "@/context/DiscordAuthContext";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Key,
  LogOut,
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
      {/* ─── GLASSMORPHISM HEADER (MATCHING SKRIPT.GG REFERENCE) ───── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-zinc-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Column: Brand Logo + [Terms], FAQ, Discord */}
            <div className="flex items-center gap-5 sm:gap-7">
              {/* Brand Logo with Crown over 'I' */}
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer outline-none focus:outline-none group"
              >
                <div className="relative flex items-center h-8 sm:h-9">
                  <img
                    src="/logo.png"
                    alt="Red Line VIP Sniper"
                    className="h-6 sm:h-7.5 w-auto max-w-[85px] sm:max-w-[110px] object-contain pointer-events-none drop-shadow-[0_2px_8px_rgba(229,57,53,0.35)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="relative flex items-center">
                  <span className="font-black tracking-tight text-lg text-black font-sans whitespace-nowrap flex items-center pointer-events-none">
                    REDL
                    <span className="relative inline-flex flex-col items-center">
                      <svg
                        className="w-2.5 h-2.5 text-[#E53935] absolute -top-2.5 left-1/2 -translate-x-1/2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                      </svg>
                      I
                    </span>
                    NE
                    <span className="text-zinc-400 font-bold text-xs uppercase tracking-wider ml-0.5">
                      .vip
                    </span>
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
                {/* Terms Link */}
                <Link
                  href="/terms"
                  className={`transition-colors duration-150 cursor-pointer ${
                    pathname === "/terms"
                      ? "text-[#E53935]"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Terms
                </Link>

                {/* FAQ Link */}
                <Link
                  href="/faq"
                  className={`transition-colors duration-150 cursor-pointer ${
                    pathname === "/faq"
                      ? "text-[#E53935]"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  FAQ
                </Link>

                {/* Discord Link */}
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-600 hover:text-black transition-colors duration-150 cursor-pointer"
                >
                  Discord
                </a>
              </nav>
            </div>

            {/* Right Column: Sign In with Discord icon + Join Red Line CTA */}
            <div className="flex items-center gap-3 sm:gap-4">
              {user ? (
                <>
                  {/* Authenticated User Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/80 border border-zinc-200 hover:border-[#E53935] transition-all text-xs sm:text-sm shadow-xs focus-visible:outline-none cursor-pointer"
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="h-6 w-6 rounded-full border border-[#E53935]/40 object-cover pointer-events-none"
                      />
                      <span className="font-semibold text-black max-w-[120px] truncate pointer-events-none">
                        {user.username}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                          <p className="text-[11px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">
                            Discord Account
                          </p>
                          <p className="text-xs text-zinc-700 font-mono truncate">
                            ID: {user.id}
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 hover:text-[#E53935] rounded-xl transition-colors font-medium cursor-pointer"
                        >
                          <Key className="h-4 w-4 text-[#E53935]" />
                          VIP Dashboard & Key
                        </Link>

                        <div className="border-t border-zinc-100 my-1"></div>

                        <button
                          type="button"
                          onClick={() => {
                            setShowUserDropdown(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#E53935] hover:bg-red-50 rounded-xl transition-colors text-left font-medium cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold font-sans transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>VIP Dashboard</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#E53935]" />
                  </Link>
                </>
              ) : (
                <>
                  {/* Sign In button WITH Discord Icon (desktop & tablet) */}
                  <button
                    type="button"
                    onClick={() => loginWithDiscord()}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100/80 transition-all cursor-pointer"
                  >
                    <DiscordIcon className="h-4 w-4 fill-current text-[#5865F2]" />
                    <span>Sign in</span>
                  </button>

                  {/* Join Red Line now CTA pill (responsive text) */}
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-[#E53935] hover:bg-[#c62828] hover:shadow-lg hover:shadow-red-600/30 hover:scale-[1.02] active:scale-95 text-white text-xs sm:text-sm font-bold font-sans transition-all duration-200 shadow-sm cursor-pointer select-none shrink-0"
                  >
                    <span className="pointer-events-none sm:hidden">Join now</span>
                    <span className="pointer-events-none hidden sm:inline">Join Red Line now</span>
                    <ChevronRight className="h-3.5 w-3.5 text-white pointer-events-none" />
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
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

        {/* Mobile Dropdown Menu (Glassmorphism) */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl space-y-2">
            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              Terms of Service
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              FAQ
            </Link>
            <a
              href={discordInvite}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-zinc-600 hover:text-black hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              <span>Discord</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              Pricing & Plans
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              VIP Dashboard
            </Link>

            {!user && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  loginWithDiscord();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black text-white text-sm font-semibold shadow-md active:scale-[0.98] mt-2 cursor-pointer"
              >
                <DiscordIcon className="h-4 w-4 fill-current text-[#5865F2]" />
                <span>Sign in with Discord</span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
