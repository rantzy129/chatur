"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert, Check, AlertTriangle, ShieldCheck, Ban } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: Props) {
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
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Centering container with scroll capability */}
      <div
        className="min-h-full flex items-center justify-center p-3 sm:p-6 cursor-pointer"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-2xl bg-white border border-zinc-200 shadow-2xl p-5 sm:p-8 space-y-6 text-zinc-600 my-6 cursor-default"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
            aria-label="Close Terms modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="space-y-2 pr-8 border-b border-zinc-200 pb-5">
            <h2 className="text-xl sm:text-2xl font-black font-sans text-black tracking-tight uppercase">
              TERMS OF SERVICE & DISCLAIMER
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Effective October 2026 • Assault Fire PH Single-Seat License Agreement
            </p>
          </div>

          {/* 3 Callout Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#E53935] font-mono text-xs font-bold uppercase">
                <Ban className="h-3.5 w-3.5" />
                <span>Non-Refundable</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                All sales final once verified. Digital license keys cannot be refunded or recalled.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-black font-mono text-xs font-bold uppercase">
                <AlertTriangle className="h-3.5 w-3.5 text-[#E53935]" />
                <span>Use At Own Risk</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                You operate the suite at your own discretion. Red Line is not liable for game penalties.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Undetected</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                Full Assault Fire PH stream isolation. Zero broadcast overlay bleed into OBS/Discord.
              </p>
            </div>
          </div>

          {/* Detailed Clauses */}
          <div className="max-h-[360px] overflow-y-auto pr-2 space-y-5 text-xs font-sans leading-relaxed text-zinc-600">
            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Non-Refundable Digital Goods</span>
              </h3>
              <p>
                Due to the cryptographic generation and distribution of unique single-device software authorization keys, all purchases made through GCash, Maya, or manual staff settlement are <strong className="text-black">strictly non-refundable</strong>. Once your order has been verified and an authorization key generated or delivered to your Discord profile, no cancellations, refunds, or chargebacks will be accepted under any circumstances.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Single-Seat Device Binding</span>
              </h3>
              <p>
                Every license key is bound to a single physical computer system hardware signature (HWID) upon first launch. Sharing your key or attempting to run concurrent sessions on separate devices will result in automatic key termination without refund. Hardware resets (due to system upgrades or replacements) are granted at the sole discretion of staff through the Discord portal.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Operational Risk & Game Penalties</span>
              </h3>
              <p>
                Red Line VIP software operates directly at the user&apos;s own risk. While our tactical visual engine utilizes advanced DirectX 9 hardware overlay pipeline and hardware stream-proofing to maintain complete capture isolation, online multiplayer game platforms maintain dynamic security architectures. Red Line VIP and its developers assume zero responsibility or liability for in-game suspensions, account bans, competitive disqualifications, or financial loss incurred from the use of our software.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Third-Party Game Updates</span>
              </h3>
              <p>
                Assault Fire PH may release engine updates, game client changes, or maintenance downtimes. In the event of a game client update that affects tactical visual engine operations, our developers will deploy software updates to restore full functionality. Minor delays may occur during major game engine revisions. Active license time will not be paused or extended during standard maintenance windows.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Acceptable Conduct & License Revocation</span>
              </h3>
              <p>
                Attempting to decompile, reverse-engineer, crack, dump memory, or re-distribute Red Line VIP software or Peace Cleaner will result in immediate permanent HWID ban, Discord syndicate expulsion, and blacklisting across all associated systems without refund.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-black text-sm font-mono flex items-center gap-2">
                <span>Trademark & Ownership Notice</span>
              </h3>
              <p>
                Red Line VIP is an independent third-party performance and tactical display tool developed specifically for Assault Fire. This software is completely independent and is not endorsed by, sponsored by, or affiliated with the original game developers, creators, or trademark holders. All trademarks, game titles, and assets belong to their respective copyright owners.
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">ESC</kbd> or click outside to dismiss
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-mono transition-colors"
              >
                Close
              </button>
              {onAccept ? (
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 active:scale-95 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="h-4 w-4 text-[#E53935]" />
                  <span>Accept Terms</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 active:scale-95 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="h-4 w-4 text-[#E53935]" />
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
