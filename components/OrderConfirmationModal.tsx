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
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmation-title"
        className="relative my-auto w-full max-w-md rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 text-center shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] font-sans"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
          className="absolute right-5 top-5 rounded-full bg-zinc-100 hover:bg-zinc-200 p-2 text-zinc-400 hover:text-black transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-200/80 bg-emerald-50 text-emerald-600 shadow-sm">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h2
          id="order-confirmation-title"
          className="text-2xl font-black text-black font-sans tracking-tight"
        >
          Order Transmitted
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-zinc-500 font-sans">
          Your payment receipt has been delivered to staff for verification. Your VIP license key will automatically unlock in your dashboard once approved.
        </p>

        <div className="mt-5 rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3.5">
          <span className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
            Order Reference Code
          </span>
          <strong className="mt-1 block break-all font-mono text-emerald-700 text-sm sm:text-base font-bold tracking-wider">
            {orderNumber}
          </strong>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black hover:bg-zinc-800 px-4 text-xs sm:text-sm font-bold font-sans text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span>View VIP Portal</span>
            <ChevronRight className="h-4 w-4 text-[#E53935]" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-2xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 px-4 text-xs sm:text-sm font-semibold font-sans text-black transition-all active:scale-[0.98] cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
