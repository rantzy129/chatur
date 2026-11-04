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
        className="relative my-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
          className="absolute right-4 top-4 rounded-lg border border-zinc-200 bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E53935]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <h2
          id="order-confirmation-title"
          className="text-2xl font-black text-black font-sans tracking-tight uppercase"
        >
          ORDER TRANSMITTED
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-zinc-600 font-sans">
          Your payment receipt has been delivered to staff for cryptographic verification. Your license key will automatically unlock in your VIP dashboard once verified.
        </p>

        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
            Order Reference Code
          </span>
          <strong className="mt-1 block break-all font-mono text-emerald-700 text-sm tracking-wider">
            {orderNumber}
          </strong>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 px-4 text-xs font-bold font-mono text-white transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>View License Portal</span>
            <ChevronRight className="h-4 w-4 text-[#E53935]" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-zinc-200 bg-zinc-100 px-4 text-xs font-semibold font-mono text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
          >
            Continue Browsing
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
