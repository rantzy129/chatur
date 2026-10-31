"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Check,
  Cpu,
} from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
}: TermsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Centering container with scroll capability */}
      <div
        className="min-h-full flex items-center justify-center p-3 sm:p-6 cursor-pointer"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-2xl bg-[#0b0e14] border border-white/[0.1] shadow-2xl p-5 sm:p-8 space-y-6 text-zinc-300 my-6 cursor-default"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close Terms modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="space-y-2 pr-8 border-b border-white/[0.08] pb-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-wider uppercase">
              <FileText className="h-3 w-3" />
              <span>Legal & Compliance Policy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
              TERMS OF SERVICE & DISCLAIMER
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Effective October 2026 • Single-Seat License Agreement
            </p>
          </div>

          {/* 3 Callout Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-black/50 border border-red-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-mono text-xs font-bold uppercase">
                <Ban className="h-3.5 w-3.5" />
                <span>Non-Refundable</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                All sales final once verified. Digital license keys cannot be refunded or recalled.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Use At Own Risk</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                You operate the suite at your own discretion. Red Line is not liable for game penalties.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Undetected</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                Direct swapchain overlay surface with hardware broadcast stream isolation.
              </p>
            </div>
          </div>

          {/* Detailed Clauses (Scrollable area if screen height is constrained) */}
          <div className="max-h-[42vh] overflow-y-auto pr-2 space-y-4 text-xs font-sans text-zinc-300 leading-relaxed divide-y divide-white/[0.06]">
            {/* Clause 1 */}
            <div className="pt-3 first:pt-0 space-y-1.5">
              <h3 className="font-mono font-bold text-white text-xs flex items-center gap-2">
                <span className="text-red-500">01.</span> Strictly Non-Refundable Digital Sale
              </h3>
              <p>
                Due to the immediate provisioning and cryptographic nature of single-seat digital license keys (<code className="text-zinc-200 bg-white/[0.05] px-1 py-0.5 rounded font-mono text-[10px]">ESM-XXXX-XXXX-XXXX</code>), all transactions conducted via GCash, InstaPay, or cryptocurrency are <strong className="text-white">strictly non-refundable and final</strong> once verified by staff.
              </p>
              <p className="text-zinc-400 text-[11px]">
                Initiating fraudulent disputes or chargebacks will result in automatic HWID revocation and permanent blacklist from our Discord syndicate.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="pt-3 space-y-1.5">
              <h3 className="font-mono font-bold text-white text-xs flex items-center gap-2">
                <span className="text-red-500">02.</span> Assumption of Risk ("Use At Your Own Risk")
              </h3>
              <p>
                All products and tactical visual suites provided by Red Line VIP are offered exclusively for research, competitive display customization, and private performance testing. You expressly agree that you are using this third-party utility entirely <strong className="text-white">at your personal operational risk</strong>.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="pt-3 space-y-1.5">
              <h3 className="font-mono font-bold text-white text-xs flex items-center gap-2">
                <span className="text-red-500">03.</span> Limitation of Liability & Ban Disclaimer
              </h3>
              <p>
                Red Line VIP, its developers, and affiliates shall <strong className="text-white">not be held liable</strong> for any account bans, suspensions, ranking resets, or disciplinary actions enforced by third-party game publishers or anti-cheat systems. While our engine is engineered to bypass detection heuristics, user playstyle and server-side behavioral telemetry remain external factors.
              </p>
            </div>

            {/* Clause 4 */}
            <div className="pt-3 space-y-1.5">
              <h3 className="font-mono font-bold text-white text-xs flex items-center gap-2">
                <span className="text-red-500">04.</span> Undetected Engine Architecture & Safety
              </h3>
              <p>
                The visual suite operates exclusively through a hardware swapchain surface overlay without directly modifying game executable memory. Full stream isolation is maintained against OBS Studio, Discord Screenshare, and standard capture software. During game patches, the engine may enter temporary maintenance to guarantee undetected status before re-enabling access.
              </p>
            </div>

            {/* Clause 5 */}
            <div className="pt-3 space-y-1.5">
              <h3 className="font-mono font-bold text-white text-xs flex items-center gap-2">
                <span className="text-red-500">05.</span> Hardware Locking (HWID) & Fair Use
              </h3>
              <p>
                Each license key is cryptographically bound to a single computer hardware signature upon activation. Key sharing or redistribution is strictly prohibited and leads to immediate key termination. Genuine hardware upgrade resets may be requested through staff in Discord.
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">ESC</kbd> or click outside to dismiss
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.06] text-zinc-300 text-xs font-mono transition-colors"
              >
                Close
              </button>
              {onAccept ? (
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Accept Terms</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>I Understand</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}