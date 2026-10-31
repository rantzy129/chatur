"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDiscordAuth } from "@/context/DiscordAuthContext";
import { getSupabaseClient } from "@/lib/supabase";
import {
  MAX_RECEIPT_BYTES,
  RECEIPT_IMAGE_TYPES,
} from "@/lib/receipt-constants";
import {
  X,
  QrCode,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ZoomIn,
} from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    tier: string;
    price: number;
    description: string;
    isLifetime?: boolean;
  } | null;
  onSuccess: (orderNumber: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: Props) {
  const { user, loginWithDiscord } = useDiscordAuth();
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showEnlargedQr, setShowEnlargedQr] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showEnlargedQr) {
        setShowEnlargedQr(false);
      } else {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, showEnlargedQr]);

  if (!isOpen || !plan || typeof document === "undefined") return null;

  const gcashName = process.env.NEXT_PUBLIC_GCASH_NAME || "RED LINE";
  const qrUrl = process.env.NEXT_PUBLIC_GCASH_QR_URL || "/qr.jpg";

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(plan.price.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(gcashName);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!RECEIPT_IMAGE_TYPES.includes(file.type)) {
      setError("Receipt must be a PNG, JPEG, GIF, or WebP image.");
      return;
    }

    if (file.size > MAX_RECEIPT_BYTES) {
      setError("Receipt image must be 3MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please connect your Discord account first.");
      return;
    }

    if (!referenceNumber.trim()) {
      setError("Please input the GCash reference number from your receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session }, error: sessionError } =
        await getSupabaseClient().auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Your Discord session expired. Please sign in again.");
      }

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tier: plan.tier,
          amount: plan.price,
          reference_number: referenceNumber.trim(),
          sender_name: senderName.trim(),
          receipt_url: receiptBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit order");
      }

      onSuccess(data.orderNumber);
    } catch (err: any) {
      setError(err.message || "Failed to submit payment verification request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-md p-3 sm:p-6"
    >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          onClick={(e) => e.stopPropagation()}
          className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-[#0e1118] border border-white/[0.1] shadow-2xl p-5 sm:p-7 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Top Brand Accent Line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              plan.isLifetime
                ? "bg-amber-500"
                : "bg-red-600"
            }`}
          />

          {/* Close Button (Offset to avoid overlapping price) */}
          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Plan Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] pr-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Purchasing License
              </span>
              <h3 id="checkout-modal-title" className="text-xl font-bold text-white font-mono flex items-center gap-2 mt-0.5">
                <span>{plan.tier}</span>
                {plan.isLifetime && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Lifetime
                  </span>
                )}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-black text-white font-mono">
                ₱{plan.price.toLocaleString()}
              </span>
              <span className="block text-[10px] text-zinc-400 font-mono">
                PHP / InstaPay
              </span>
            </div>
          </div>

          {/* Discord Authentication Check */}
          {!user ? (
            <div className="my-5 p-4 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#5865F2] font-semibold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Discord Identity Required</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans">
                Your license key and PC hardware lock are securely bound to your Discord account. Please sign in before submitting.
              </p>
              <button
                type="button"
                onClick={loginWithDiscord}
                className="w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
              >
                <DiscordIcon className="h-4 w-4 fill-current" />
                <span>Connect Discord Account</span>
              </button>
            </div>
          ) : (
            <div className="my-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-7 w-7 rounded-full border border-red-500/40 object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{user.username}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">ID: {user.id}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="h-3 w-3" /> Bound
              </span>
            </div>
          )}

          {/* GCash / InstaPay QR & Account Section */}
          <div className="space-y-4 pt-1">
            <div className="p-3.5 sm:p-4 rounded-xl bg-black/50 border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
              {/* QR Image Box */}
              <div
                onClick={() => setShowEnlargedQr(true)}
                className="relative group cursor-pointer flex-shrink-0"
                title="Click to zoom QR code"
              >
                <div className="h-28 w-28 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg border border-white/20 group-hover:border-red-500 transition-colors overflow-hidden">
                  <img
                    src={qrUrl}
                    alt="InstaPay GCash QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-mono text-center flex items-center justify-center gap-1 text-zinc-400 group-hover:text-red-400 mt-1 transition-colors">
                  <ZoomIn className="h-3 w-3" />
                  <span>Enlarge QR</span>
                </span>
              </div>

              {/* Account Details */}
              <div className="flex-1 space-y-1.5 text-center sm:text-left font-mono w-full">
                <span className="text-[10px] uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 font-bold inline-block">
                  Universal InstaPay QR
                </span>

                <div className="flex items-center justify-center sm:justify-between gap-2 pt-0.5">
                  <span className="text-xs text-zinc-400">Account:</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="text-xs font-bold text-white hover:text-red-400 flex items-center gap-1 transition-colors"
                    title="Copy Account Name"
                  >
                    <span>{gcashName}</span>
                    {copiedAccount ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-zinc-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center sm:justify-between gap-2">
                  <span className="text-xs text-zinc-400">Amount:</span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="text-sm font-bold text-red-400 hover:underline flex items-center gap-1"
                    title="Copy exact amount"
                  >
                    <span>₱{plan.price.toLocaleString()} PHP</span>
                    {copiedAmount ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-zinc-500" />
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-zinc-500 font-sans leading-tight pt-1">
                  Compatible with GCash, Maya, ShopeePay, BDO, BPI, GoTyme, or any PH banking app.
                </p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-1">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1">
                  GCash Reference Number (13 Digits) *
                </label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. 1029384756102"
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-red-500 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1">
                  Sender Name / Mobile (Optional)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Juan D. / 0917xxxxxxx"
                  className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-red-500 font-mono transition-colors"
                />
              </div>

              {/* Receipt Screenshot Upload */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1">
                  Receipt Screenshot (Speeds up approval)
                </label>
                <div className="relative border border-dashed border-white/[0.15] hover:border-red-500/40 rounded-xl p-3 text-center transition-colors bg-black/20">
                  <input
                    type="file"
                    accept={RECEIPT_IMAGE_TYPES.join(",")}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {receiptBase64 ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={receiptBase64}
                        alt="Receipt preview"
                        className="h-12 w-12 object-contain rounded-lg border border-red-500/50 bg-black/50"
                      />
                      <div className="text-left text-xs">
                        <p className="text-emerald-400 font-medium font-mono">
                          Receipt image attached
                        </p>
                        <p className="text-zinc-500 text-[10px]">
                          Click to choose another screenshot
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 py-1 font-mono">
                      <Upload className="h-4 w-4 text-red-500" />
                      <span>Attach GCash receipt screenshot</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms & Risk Agreement Disclosure */}
              <div className="rounded-xl border border-white/[0.08] bg-black/50 p-3 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:text-red-300 underline font-mono font-medium"
                    >
                      Terms of Service
                    </a>
                    . I understand digital licenses are <strong className="text-white">strictly non-refundable</strong>, I use this software <strong className="text-white">at my own risk</strong>, and Red Line is <strong className="text-white">not liable for game bans</strong>. Engine is verified <strong className="text-emerald-400">undetected</strong>.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !user || !agreedTerms}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg min-h-[48px] ${
                  plan.isLifetime
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "bg-red-600 hover:bg-red-500 text-white"
                } ${
                  isSubmitting || !user || !agreedTerms
                    ? "opacity-50 cursor-not-allowed"
                    : "active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <span>Transmitting Order to Staff...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    {!agreedTerms ? (<span>Agree to Terms to Continue</span>) : (<span>Submit Payment for Verification</span>)}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
      </div>

      {/* Enlarged High-Resolution QR Modal */}
      {showEnlargedQr && (
        <div
          onClick={() => setShowEnlargedQr(false)}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full p-6 rounded-3xl bg-[#0e1118] border border-white/[0.1] shadow-2xl flex flex-col items-center text-center space-y-4"
          >
            <button
              onClick={() => setShowEnlargedQr(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]"
              aria-label="Close enlarged QR"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
                Universal InstaPay QR
              </span>
              <h4 className="text-lg font-bold text-white font-mono mt-1">
                Scan with GCash or Maya
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                Account Name: <strong className="text-white">{gcashName}</strong>
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-xl w-64 h-64 flex items-center justify-center">
              <img
                src={qrUrl}
                alt="InstaPay GCash QR Enlarged"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-zinc-400 font-mono">
              Transfer exact amount:{" "}
              <strong className="text-red-400">
                ₱{plan.price.toLocaleString()} PHP
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
