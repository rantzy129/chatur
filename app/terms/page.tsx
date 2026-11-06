"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";

interface PolicySection {
  id: string;
  tabLabel: string;
  number: string;
  title: string;
  items: {
    code: string;
    content: string;
    subItems?: { code: string; content: string }[];
  }[];
}

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms");

  const discordInvite =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

  const policySections: PolicySection[] = [
    {
      id: "terms",
      tabLabel: "Terms and Conditions",
      number: "1.",
      title: "Terms and Conditions",
      items: [
        {
          code: "1.1.",
          content:
            "These terms and conditions (hereinafter — Terms) set out the rules and guidelines by which Red Line VIP (hereinafter — Service Provider or Red Line) offers access to its software services.",
        },
        {
          code: "1.2.",
          content:
            "Service Provider provides tactical display enhancement, memory isolation, and device ban removal utilities for competitive first-person shooter software (hereinafter — Services).",
        },
        {
          code: "1.3.",
          content: "To create an account and access our VIP services, you must:",
          subItems: [
            {
              code: "1.3.1.",
              content: "Be at least 18 years of age or possess legal parental consent in your jurisdiction.",
            },
            {
              code: "1.3.2.",
              content: "Possess an authenticated Discord account for cryptographic license key provisioning.",
            },
            {
              code: "1.3.3.",
              content: "Agree unconditionally to our assumption of operational risk disclaimer.",
            },
          ],
        },
        {
          code: "1.4.",
          content:
            "These Terms regulate rights of the customer and Service Provider, mutual obligations between them, provision of Services, price of Services, payment procedures, liability of the Parties, and related operational policies.",
        },
      ],
    },
    {
      id: "general",
      tabLabel: "General Terms & Risk",
      number: "2.",
      title: "General Terms and Risk Assumption",
      items: [
        {
          code: "2.1.",
          content:
            "After acceptance of these Terms (after completing your order and ticking the acceptance acknowledgment), these Terms become a binding legal agreement establishing mutual obligations between you and Red Line VIP.",
        },
        {
          code: "2.2.",
          content:
            "Assumption of operational risk: All tactical visual tools and enhancement utilities are provided strictly for performance analysis, display optimization, and private research. You acknowledge that you utilize this third-party utility entirely AT YOUR OWN RISK.",
        },
        {
          code: "2.3.",
          content:
            "Limitation of liability: Red Line VIP, its core developers, server administrators, and affiliates shall NOT be held liable for any direct or consequential actions resulting from gameplay, including account suspensions or disciplinary actions enforced by third-party game publishers.",
        },
      ],
    },
    {
      id: "privacy",
      tabLabel: "Privacy Policy",
      number: "3.",
      title: "Privacy & Data Policy",
      items: [
        {
          code: "3.1.",
          content:
            "Data minimization: We collect only the minimum data required to provision your digital license key: your Discord user ID, username, and transaction proof. We never store credit card numbers, passwords, or personal banking credentials.",
        },
        {
          code: "3.2.",
          content:
            "Hardware identifiers (HWID): To enforce single-seat licensing, our loader generates a one-way cryptographic hash of your motherboard and processor serials. This hash is never shared with third parties.",
        },
        {
          code: "3.3.",
          content:
            "Zero telemetry logs: Red Line VIP does not record in-game voice chat, keystrokes, personal files, or desktop screen content. Your physical monitor data remains entirely private on your local machine.",
        },
      ],
    },
    {
      id: "refund",
      tabLabel: "Refund Policy",
      number: "4.",
      title: "Strict Non-Refundable Policy",
      items: [
        {
          code: "4.1.",
          content:
            "Cryptographic digital delivery: Due to the immediate provisioning and cryptographic nature of single-seat VIP keys, all transactions via GCash, Maya, InstaPay, or cryptocurrency are STRICTLY NON-REFUNDABLE AND FINAL once processed.",
        },
        {
          code: "4.2.",
          content:
            "No returns or balance exchanges will be granted once an activation license key has been generated or dispatched to your Customer Dashboard.",
        },
        {
          code: "4.3.",
          content:
            "Failure to fulfill PC prerequisites (such as running Windows 10/11 64-bit or having Secure Boot disabled) or server maintenance downtime does not qualify for refunds. Our Discord technical support is available 24/7 to resolve local configuration issues.",
        },
        {
          code: "4.4.",
          content:
            "Initiating fraudulent payment reversals or chargebacks will result in immediate permanent HWID revocation and blacklisting from all future Red Line releases.",
        },
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of policySections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section.id);
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
      {/* Two-Column Layout (Matching Skript Legal Screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Category Tabs (Sticky sidebar locked in view) */}
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
              {policySections.map((section) => {
                const isActive = activeTab === section.id;
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

            {/* Support Callout */}
            <div className="hidden lg:block pt-2">
              <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Legal & Licensing Inquiries
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                  For custom business licensing or questions regarding our operational policy, reach our syndicate staff on Discord.
                </p>
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <DiscordIcon className="h-3.5 w-3.5 fill-current text-white" />
                  <span>Contact Syndicate Staff</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Numbered Editorial Content */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12 sm:space-y-16">
            {policySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 space-y-6 pt-2"
              >
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-black tracking-tight flex items-baseline gap-2">
                  <span>{section.number}</span>
                  <span>{section.title}</span>
                </h2>

                <div className="space-y-6 text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <p>
                        <strong className="text-black font-semibold mr-2 font-mono text-sm">
                          {item.code}
                        </strong>
                        {item.content}
                      </p>

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

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/#pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#E53935] hover:bg-[#c62828] text-white font-bold font-sans text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Accept Terms & View VIP Plans</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faq"
                className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors"
              >
                Have questions? Check our FAQ →
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
