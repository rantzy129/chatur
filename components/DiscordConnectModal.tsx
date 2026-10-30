"use client";

import { useDiscordAuth } from "@/context/DiscordAuthContext";
import { X } from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscordConnectModal({ isOpen, onClose }: Props) {
  const { loginWithDiscord } = useDiscordAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-cyber-card border border-white/[0.1] shadow-2xl p-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#5865F2] to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] mb-3 shadow-lg">
            <DiscordIcon className="h-9 w-9 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Connect Discord
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            Log in with your official Discord account to access your VIP license and bind your hardware ID.
          </p>
        </div>

        {/* Discord OAuth Action */}
        <div>
          <button
            onClick={() => {
              onClose();
              loginWithDiscord();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm transition-all shadow-lg hover:shadow-[#5865F2]/25 active:scale-[0.98] font-mono"
          >
            <DiscordIcon className="h-4 w-4 fill-current" />
            <span>Sign in with Discord</span>
          </button>
        </div>
      </div>
    </div>
  );
}
