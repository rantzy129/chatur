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
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="h-9 w-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover:border-[#E53935] transition-all overflow-hidden p-1 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Red Line Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-black tracking-tight text-base sm:text-lg text-black group-hover:text-[#E53935] transition-colors font-sans whitespace-nowrap">
                RED LINE
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/#features"
                className="text-zinc-600 hover:text-black transition-colors duration-150"
              >
                <span>Features</span>
              </Link>
              <Link
                href="/#pricing"
                className={`transition-colors duration-150 flex items-center gap-1.5 ${
                  pathname === "/#pricing" ? "text-black font-bold" : "text-zinc-600 hover:text-black"
                }`}
              >
                {pathname === "/#pricing" && <span className="h-1.5 w-1.5 rounded-full bg-[#E53935]" />}
                <span>Pricing & Plans</span>
              </Link>
              <Link
                href="/#faq"
                className="text-zinc-600 hover:text-black transition-colors duration-150"
              >
                <span>FAQ</span>
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 transition-colors duration-150 ${
                  pathname === "/dashboard"
                    ? "text-black font-bold"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {pathname === "/dashboard" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E53935]" />
                ) : (
                  <Key className="h-4 w-4 text-zinc-500" />
                )}
                <span>My License</span>
              </Link>
            </nav>

            {/* Right User Actions */}
            <div className="flex items-center gap-3">
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-black px-3.5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50 transition-all font-mono"
              >
                <span>Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              {user ? (
                /* Authenticated User Menu */
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-white border border-zinc-200 hover:border-[#E53935] transition-all text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-6 w-6 rounded-full border border-[#E53935]/40 object-cover"
                    />
                    <span className="font-semibold text-black max-w-[120px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                        <p className="text-[11px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">
                          Authenticated via Discord
                        </p>
                        <p className="text-xs text-zinc-700 font-mono truncate">
                          ID: {user.id}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 hover:text-[#E53935] rounded-xl transition-colors font-medium"
                      >
                        <Key className="h-4 w-4 text-[#E53935]" />
                        VIP Dashboard & Key
                      </Link>

                      <div className="border-t border-zinc-100 my-1"></div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#E53935] hover:bg-red-50 rounded-xl transition-colors text-left font-medium"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <DiscordIcon className="h-4 w-4 fill-current text-[#5865F2]" />
                  <span>Connect Discord</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
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

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 border-t border-zinc-200 bg-white space-y-3">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-medium"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-medium"
            >
              Pricing & Plans
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-zinc-800 hover:text-black hover:bg-zinc-100 font-medium"
            >
              VIP Dashboard
            </Link>
            <a
              href={discordInvite}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-zinc-600 hover:text-black hover:bg-zinc-100 font-medium"
            >
              <span>Join Discord</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {!user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  loginWithDiscord();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black text-white text-sm font-semibold shadow-md active:scale-[0.98]"
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
