"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  X,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  EyeOff,
  CreditCard,
  Download,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";

interface PresetQA {
  id: string;
  category: string;
  question: string;
  shortLabel: string;
  icon?: React.ReactNode;
  answer: string;
  action?: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
  followUps?: string[];
}

const DISCORD_INVITE =
  process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/Whwxq9QAEN";

const PRESET_KNOWLEDGE: PresetQA[] = [
  {
    id: "separate_subs",
    category: "Important Notice",
    question: "Are Peace Cleaner and Red Line Cheats different subscriptions?",
    shortLabel: "Different subscriptions?",
    icon: <ShieldCheck className="h-3.5 w-3.5 text-[#E53935]" />,
    answer:
      "Yes, 100%! Peace Cleaner and Red Line Cheats are completely different subscriptions with separate license keys:\n\n• Red Line Cheats: Stream-proof Wallhack ESP and precision aimbot for Assault Fire (Starts at ₱500).\n• Peace Cleaner: Dedicated hardware ban remover for banned PCs (Starts at ₱1,000).\n\nIf your computer was banned and you also want cheats, you will need both subscriptions. If you only need one, you can subscribe independently!",
    action: {
      label: "Compare Plans in Store →",
      href: "/#pricing",
    },
    followUps: ["features", "cleaner", "payment"],
  },
  {
    id: "features",
    category: "Product Features",
    question: "What features are included in Red Line Cheats?",
    shortLabel: "What features included?",
    icon: <Layers className="h-3.5 w-3.5 text-[#E53935]" />,
    answer:
      "Red Line Cheats provides full tactical in-game visuals for Assault Fire:\n\n• 2D/3D Wallhack ESP: Renders enemy bounding boxes, health, and distance through walls.\n• Bone Skeleton: Displays player skeleton joints even through smoke.\n• Aimbot: Smooth aim tracking with adjustable FOV and speed.\n• Stream-Proof: Visuals never appear on OBS Studio, Discord, or live broadcasts.\n\n⚠️ Reminder: Peace Cleaner (ban remover) is a separate subscription and is not bundled with cheats.",
    action: {
      label: "Explore Features Showcase →",
      href: "/#streamproof",
    },
    followUps: ["separate_subs", "streamproof", "undetected"],
  },
  {
    id: "cleaner",
    category: "Ban Removal",
    question: "What is Peace Cleaner & what does it do?",
    shortLabel: "What is Peace Cleaner?",
    icon: <Sparkles className="h-3.5 w-3.5 text-emerald-500" />,
    answer:
      "Peace Cleaner is a standalone device ban removal tool. If your computer received a hardware ban in Assault Fire, Peace Cleaner clears the restriction so you can log back in and play normally on a fresh account.\n\n⚠️ Note: Peace Cleaner and Red Line Cheats are different subscriptions and are purchased separately.",
    action: {
      label: "View Peace Cleaner Plans →",
      href: "/#pricing",
    },
    followUps: ["separate_subs", "payment", "discord"],
  },
  {
    id: "undetected",
    category: "Safety & Status",
    question: "Is Red Line VIP undetected on Assault Fire?",
    shortLabel: "Is it undetected on AF?",
    icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />,
    answer:
      "Yes, Red Line VIP is fully undetected across all Assault Fire servers. It runs quietly in the background and is kept up-to-date with automatic updates after every game patch so you can play with confidence.",
    action: {
      label: "View Undetected VIP Plans →",
      href: "/#pricing",
    },
    followUps: ["features", "streamproof", "payment"],
  },
  {
    id: "streamproof",
    category: "Streaming",
    question: "How does the Stream-Proof overlay work?",
    shortLabel: "How does Stream-Proof work?",
    icon: <EyeOff className="h-3.5 w-3.5 text-[#E53935]" />,
    answer:
      "The visual overlay appears on your physical game screen only. When you stream or record with OBS Studio, share screens in Discord, or broadcast on TikTok Live, your broadcast remains 100% clean—viewers see normal gameplay without any overlays.",
    action: {
      label: "Watch Stream-Proof Proof →",
      href: "/#streamproof",
    },
    followUps: ["features", "undetected"],
  },
  {
    id: "installation",
    category: "Getting Started",
    question: "How do I install and run the client?",
    shortLabel: "How to install & launch?",
    icon: <Download className="h-3.5 w-3.5 text-blue-500" />,
    answer:
      "Setup takes less than 2 minutes in 4 simple steps:\n1. Download the client .rar from your /dashboard profile.\n2. Extract using the password available on your dashboard profile page.\n3. Run the loader as Administrator & paste your key.\n4. Launch Assault Fire in Borderless/Windowed mode. Press [INSERT] in-game to toggle the overlay menu!",
    action: {
      label: "Go to VIP Dashboard →",
      href: "/dashboard",
    },
    followUps: ["discord", "payment"],
  },
  {
    id: "payment",
    category: "Billing & Delivery",
    question: "What payment methods and pricing do you offer?",
    shortLabel: "Payment & pricing?",
    icon: <CreditCard className="h-3.5 w-3.5 text-amber-500" />,
    answer:
      "We accept GCash, Maya, ShopeePay, QR Ph, and all major Philippine banks via universal QR.\n\n• Red Line Cheats: ₱500 (1 Week) | ₱1,000 (1 Month) | ₱3,000 (Lifetime)\n• Peace Cleaner (Separate subscription): ₱1,000 (1 Month) | ₱3,000 (Lifetime)\n\nUpon payment verification, your license key unlocks automatically in your dashboard portal.",
    action: {
      label: "Select a Plan & Checkout →",
      href: "/#pricing",
    },
    followUps: ["separate_subs", "installation", "cleaner"],
  },
  {
    id: "discord",
    category: "Live Support",
    question: "I have a custom question or need 1-on-1 staff help",
    shortLabel: "Custom question / Ticket",
    icon: <MessageSquare className="h-3.5 w-3.5 text-[#5865F2]" />,
    answer:
      "Have a custom inquiry, setup question, or need live assistance? Our senior staff is active 24/7 on Discord! You can open a private support ticket for 1-on-1 help anytime.",
    action: {
      label: "Open a Ticket on Discord →",
      href: DISCORD_INVITE,
      isExternal: true,
    },
    followUps: ["separate_subs", "payment", "features"],
  },
];

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
  followUps?: string[];
  timestamp: string;
  showPresetMenu?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-msg",
    sender: "bot",
    text: "Hey soldier! 👋 I'm Reddy, your Red Line tactical assistant.\n\nTap any question below for instant general answers, or open a Discord ticket if you have custom questions!\n\n⚠️ Note: Red Line Cheats and Peace Cleaner are different subscriptions!",
    timestamp: "Online",
    showPresetMenu: true,
  },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Dismiss floating tooltip after 9s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectQuestion = (qaId: string) => {
    const item = PRESET_KNOWLEDGE.find((q) => q.id === qaId);
    if (!item) return;

    // Add user message bubble
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: item.question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate natural response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "bot",
        text: item.answer,
        action: item.action,
        followUps: item.followUps,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 280);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* ─── FLOATING TRIGGER BUTTON (BOTTOM-RIGHT) ───────────────── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
        {/* Floating Tooltip Bubble */}
        {showTooltip && !isOpen && (
          <div
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="absolute -top-12 right-1 sm:right-2 bg-black text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold font-sans tracking-wide whitespace-nowrap shadow-xl border border-zinc-800 flex items-center gap-2 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300 hover:scale-105 transition-transform"
          >
            <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
            <span>Questions? Ask Reddy!</span>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-black transform rotate-45 border-r border-b border-zinc-800" />
          </div>
        )}

        {/* Trigger Avatar Button with Float Animation */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          aria-label={isOpen ? "Close Reddy Chatbot" : "Chat with Reddy"}
          className="relative group focus:outline-none cursor-pointer"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -inset-1.5 rounded-full bg-[#E53935]/25 blur-md group-hover:bg-[#E53935]/40 transition-all duration-300 animate-pulse" />

          {/* Avatar Container with Float */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-chatbot-float transition-transform duration-300 group-hover:scale-105 active:scale-95">
            <img
              src="/chatbot.png"
              alt="Reddy - Red Line Assistant"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
            />

            {/* Online Status Dot */}
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" />
          </div>
        </button>
      </div>

      {/* ─── CHATBOT WINDOW (EARLY CHAT FORMAT WITH PRESET BUTTONS) ─── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-w-[430px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25),0_0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-5 duration-200 select-none text-black"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <img
                  src="/chatbot.png"
                  alt="Reddy Avatar"
                  className="h-full w-full object-contain"
                />
                <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <h3
                  id="chatbot-title"
                  className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5"
                >
                  <span>Reddy</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/40 font-bold uppercase">
                    VIP
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Instant Answers • 24/7 Support</span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Restart chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs sm:text-[13px] leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Chat Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-xs ${
                    msg.sender === "user"
                      ? "bg-black text-white rounded-br-xs"
                      : "bg-zinc-100/95 text-zinc-800 border border-zinc-200/80 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Direct Action Button */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-200/80">
                      {msg.action.isExternal ? (
                        <a
                          href={msg.action.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <DiscordIcon className="h-3 w-3 fill-current" />
                          <span>{msg.action.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link
                          href={msg.action.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E53935] hover:bg-[#c62828] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <span>{msg.action.label}</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-zinc-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Initial Menu: Full Pre-Built Question Pills Listed Directly in Chat */}
                {msg.showPresetMenu && (
                  <div className="mt-3 w-full space-y-1.5 max-w-[95%]">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-1 mb-1">
                      Choose a question to ask Reddy:
                    </p>
                    {PRESET_KNOWLEDGE.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectQuestion(q.id)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold font-sans flex items-center justify-between gap-2.5 border transition-all cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.99] ${
                          q.id === "discord"
                            ? "bg-zinc-900 text-white border-zinc-800 hover:bg-[#5865F2] hover:border-[#5865F2]"
                            : q.id === "separate_subs"
                            ? "bg-red-50 text-red-950 border-red-200/80 hover:bg-red-100 hover:border-[#E53935]"
                            : "bg-white text-zinc-800 border-zinc-200 hover:border-[#E53935] hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {q.icon}
                          <span className="truncate">{q.question}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-up Question Chips on Replies */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.followUps.map((fid) => {
                      const item = PRESET_KNOWLEDGE.find((q) => q.id === fid);
                      if (!item) return null;
                      return (
                        <button
                          key={fid}
                          type="button"
                          onClick={() => handleSelectQuestion(fid)}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-200/90 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs hover:border-[#E53935]"
                        >
                          {item.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-100 text-zinc-400 w-fit">
                <span className="h-2 w-2 rounded-full bg-[#E53935] animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-[#E53935] animate-bounce [animation-delay:0.15s]" />
                <span className="h-2 w-2 rounded-full bg-[#E53935] animate-bounce [animation-delay:0.3s]" />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Topics Horizontal Chips */}
          <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-100 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 px-1">
              <span>Quick Questions:</span>
              <span className="text-zinc-400 font-mono">Tap to Ask</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_KNOWLEDGE.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectQuestion(q.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                    q.id === "discord"
                      ? "bg-[#5865F2] text-white border-[#5865F2]"
                      : "bg-white hover:bg-zinc-100 text-zinc-700 hover:text-black border-zinc-200 hover:border-[#E53935]"
                  }`}
                >
                  {q.shortLabel}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
}
