"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, ChevronRight, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  orderNumber: string | null;
  onClose: () => void;
}

export default function OrderConfirmationModal({
  isOpen,
  orderNumber,
  onClose,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !orderNumber || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-4 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmation-title"
        className="relative my-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1118] p-6 text-center shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
          className="absolute right-4 top-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-zinc-400 transition-colors hover:bg-white/[0.1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-950/30">
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <h2
          id="order-confirmation-title"
          className="text-2xl font-bold text-white font-mono"
        >
          Order submitted
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-300">
          Your payment details were sent to staff for review. Your license will
          appear in your dashboard after the order is approved.
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Order reference
          </span>
          <strong className="mt-1 block break-all font-mono text-emerald-300">
            {orderNumber}
          </strong>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-bold text-black transition-colors hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            View order status
            <ChevronRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Continue browsing
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
