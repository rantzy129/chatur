"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  EyeOff,
  Crosshair,
  Sparkles,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";

interface Section {
  id: string;
  tabLabel: string;
  number: string;
  title: string;
  items: {
    code: string;
    title?: string;
    content: string;
    subItems?: { code: string; content: string }[];
  }[];
}

export default function FaqPage() {
  const [activeSection, setActiveSection] = useState("general");

  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  const sections: Section[] = [
    {
      id: "general",
      tabLabel: "General & Undetected",
      number: "1.",
      title: "General & Undetected Architecture",
      items: [
        {
          code: "1.1.",
          content:
            "Red Line VIP provides undetected tactical visual enhancement and stream isolation software services for Assault Fire. All tools operate via a ring-0 driver architecture that bypasses client-side and server-side heuristic inspections.",
        },
        {
          code: "1.2.",
          content:
            "Is Red Line VIP completely undetected? Yes. Our software utilizes isolated physical swapchain rendering and non-invasive memory hooks that leave zero registry or disk footprints. The game client never has access to the isolated render layer where overlays exist.",
        },
        {
          code: "1.3.",
          content: "To run Red Line VIP smoothly, your system must meet the following baseline prerequisites:",
          subItems: [
            {
              code: "1.3.1.",
              content: "Windows 10 or Windows 11 (64-bit architecture, version 2004 or newer).",
            },
            {
              code: "1.3.2.",
              content: "Secure Boot disabled in motherboard BIOS to permit driver-level isolation.",
            },
            {
              code: "1.3.3.",
              content: "Windows Defender real-time protection temporarily exempted during initial loader injection.",
            },
          ],
        },
        {
          code: "1.4.",
          content:
            "Automated updates: Our engineering syndicate pushes silent background offsets within minutes of every game maintenance, ensuring your VIP status remains uninterrupted and 100% undetected across all active servers.",
        },
      ],
    },
    {
      id: "streamproof",
      tabLabel: "Stream-Proof (OBS)",
      number: "2.",
      title: "Stream-Proof Technology (OBS & Discord)",
      items: [
        {
          code: "2.1.",
          content:
            "Dual swapchain buffer: Red Line VIP injects visual indicators exclusively onto your physical monitor hardware buffer, completely isolated from desktop capture pipelines and API screen hooks.",
        },
        {
          code: "2.2.",
          content:
            "Is the overlay invisible during Discord screen sharing? Yes, 100%. When sharing your screen in Discord calls or server stages, viewers see only clean, vanilla Assault Fire gameplay. No boxes, skeletons, or cheat elements appear.",
        },
        {
          code: "2.3.",
          content:
            "OBS Studio, Streamlabs & TikTok Live: Broadcasters can stream full-resolution competitive gameplay. Game Capture, Window Capture, and Display Capture sources all record 100% clean video with zero overlay artifacts.",
        },
        {
          code: "2.4.",
          content:
            "FPS and framerate stability: Red Line is built on DirectX zero-overhead direct hardware draw, maintaining a stable 240+ FPS with zero input lag or screen tearing.",
        },
      ],
    },
    {
      id: "cleaner",
      tabLabel: "Peace Cleaner (HWID)",
      number: "3.",
      title: "Peace Cleaner & Hardware Ban Removal",
      items: [
        {
          code: "3.1.",
          content:
            "Peace Cleaner overview: Peace Cleaner is our proprietary hardware identifier flusher engineered specifically to bypass and remove persistent device bans in Assault Fire.",
        },
        {
          code: "3.2.",
          content:
            "How device bans are removed: Peace Cleaner flushes residual anti-cheat telemetry tokens, clears persistent registry traces, and regenerates randomized virtual hardware identifiers (NIC MAC address, volume serial numbers, and SMBIOS UUIDs).",
        },
        {
          code: "3.3.",
          content:
            "Is Peace Cleaner included in cheat subscriptions? Yes. All Red Line VIP monthly and lifetime cheat plans include Peace Cleaner at zero extra charge. Peace Cleaner is also available as an independent standalone license for banned players who do not need visual overlays.",
        },
      ],
    },
    {
      id: "features",
      tabLabel: "Wallhack & Aimbot",
      number: "4.",
      title: "Wallhack ESP & Bone Skeleton Aimbot",
      items: [
        {
          code: "4.1.",
          content:
            "Tactical ESP overlays: Features include 2D and 3D adaptive player bounding boxes, dynamic distance-to-target meters, enemy health bars, active weapon indicators, and team visibility checks.",
        },
        {
          code: "4.2.",
          content:
            "Bone skeleton tracking: Renders precise human bone joints, spine segments, and head hitboxes through walls, smoke grenades, and destructible barricades, guaranteeing crosshair alignment before peeking corners.",
        },
        {
          code: "4.3.",
          content:
            "Smooth aimbot sensitivity: Fully customizable FOV radius, humanized tracking smoothing, aimbone priority (head, neck, chest), and smooth target snapping that appears 100% natural on spectator cameras.",
        },
      ],
    },
    {
      id: "billing",
      tabLabel: "Billing & Activation",
      number: "5.",
      title: "Billing, Licensing & Instant Activation",
      items: [
        {
          code: "5.1.",
          content:
            "Accepted payment channels: We accept GCash, Maya, InstaPay, QR Ph bank transfers, and major cryptocurrencies (USDT, BTC, LTC). All payments are processed with encrypted end-to-end receipt verification.",
        },
        {
          code: "5.2.",
          content:
            "Instant key dispatch: The moment your payment is verified, your encrypted single-seat license key and private loader download URL appear immediately in your Customer Portal (/dashboard).",
        },
        {
          code: "5.3.",
          content:
            "Strict Non-Refundable Policy: In accordance with digital software licensing standards, all sales are final once an activation key is generated. Please review our Terms of Service prior to checkout.",
        },
        {
          code: "5.4.",
          content:
            "Hardware binding (HWID): Each key is bound to one personal gaming computer. Single-seat HWID resets can be requested via our Discord ticket system in the event of hardware upgrades.",
        },
      ],
    },
    {
      id: "support",
      tabLabel: "Support & Community",
      number: "6.",
      title: "Support, Community & Syndicate Access",
      items: [
        {
          code: "6.1.",
          content:
            "24/7 technical assistance: Our senior staff and technical moderators are active around the clock on our official Discord server. Open a private ticket for 1-on-1 setup guidance or troubleshooting.",
        },
        {
          code: "6.2.",
          content:
            "VIP Syndicate perks: Active subscribers receive exclusive access to private Discord channels, early patch beta releases, configuration presets, and member-only giveaways.",
        },
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-black font-sans select-none">
      {/* ─── TWO-COLUMN SIDEBAR DOCUMENTATION LAYOUT (STICKY SIDEBAR) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ── LEFT COLUMN: CATEGORY PILL TABS (STICKY SIDEBAR LOCKED IN VIEW) ── */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 lg:self-start z-20 space-y-4">
            {/* Return to Store */}
            <div className="pb-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Store</span>
              </Link>
            </div>

            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 scrollbar-none">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink text-left px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? "bg-[#E53935] text-white shadow-sm font-bold"
                        : "text-zinc-600 hover:text-black hover:bg-zinc-200/50 bg-white/70 lg:bg-transparent"
                    }`}
                  >
                    <span>{section.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Discord Support Card on Sidebar */}
            <div className="hidden lg:block pt-2">
              <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4 text-[#E53935]" />
                  <span>Live Support</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                  Have questions not listed here? Our support team is active 24/7 on Discord.
                </p>
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <DiscordIcon className="h-3.5 w-3.5 fill-current text-white" />
                  <span>Join Discord Support</span>
                </a>
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: NUMBERED EDITORIAL CONTENT ─────────────── */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12 sm:space-y-16">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 space-y-6 pt-2"
              >
                {/* Big Bold Section Title (matching "2. General Terms and Conditions") */}
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-black tracking-tight flex items-baseline gap-2">
                  <span>{section.number}</span>
                  <span>{section.title}</span>
                </h2>

                {/* Section Items */}
                <div className="space-y-6 text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <p>
                        <strong className="text-black font-semibold mr-2 font-mono text-sm">
                          {item.code}
                        </strong>
                        {item.content}
                      </p>

                      {/* Sub-items (e.g. 1.3.1, 1.3.2) */}
                      {item.subItems && (
                        <div className="pl-6 sm:pl-8 space-y-2 pt-1 border-l-2 border-zinc-200">
                          {item.subItems.map((sub, sIdx) => (
                            <p key={sIdx} className="text-sm text-zinc-600">
                              <strong className="text-black font-semibold mr-2 font-mono text-xs">
                                {sub.code}
                              </strong>
                              {sub.content}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Bottom Quick Return Bar */}
            <div className="pt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/#pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#E53935] hover:bg-[#c62828] text-white font-bold font-sans text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Ready to play? View VIP Plans</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <span>Need 1-on-1 assistance? Ask on Discord</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
