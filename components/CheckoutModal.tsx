"use client";

import { useEffect, useState, useCallback } from "react";
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
  FileText,
  Trash2,
} from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";
import TermsModal from "@/components/TermsModal";

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
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [receiptFileSize, setReceiptFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showEnlargedQr, setShowEnlargedQr] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  const processFile = (file: File) => {
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
      setReceiptFileName(file.name);
      setReceiptFileSize((file.size / 1024).toFixed(1) + " KB");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearReceipt = () => {
    setReceiptBase64(null);
    setReceiptFileName(null);
    setReceiptFileSize(null);
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
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-md p-3 sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white border border-zinc-200 shadow-2xl p-5 sm:p-7 text-left animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Brand Accent Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-[#E53935] shadow-[0_0_15px_rgba(229,57,53,0.35)]`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout modal"
          className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-black p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Plan Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-200 pr-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                Purchasing License
              </span>
              {plan.isLifetime && (
                <span className="whitespace-nowrap flex-shrink-0 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-red-50 text-[#E53935] border border-red-200">
                  Lifetime VIP
                </span>
              )}
            </div>
            <h3 id="checkout-modal-title" className="text-xl font-black text-black font-sans tracking-tight">
              {plan.tier}
            </h3>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <span className="text-2xl font-black text-black font-mono tabular-nums">
              ₱{plan.price.toLocaleString()}
            </span>
            <span className="block text-[10px] text-zinc-500 font-mono">
              PHP / InstaPay
            </span>
          </div>
        </div>

        {/* Discord Authentication Check */}
        {!user ? (
          <div className="my-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-[#5865F2] font-semibold text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Discord Identity Required</span>
            </div>
            <p className="text-xs text-zinc-600 font-sans">
              Your license key and PC hardware lock are securely bound to your Discord account. Please sign in before submitting.
            </p>
            <button
              type="button"
              onClick={loginWithDiscord}
              className="w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] active:scale-[0.98] text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-md min-h-[44px]"
            >
              <DiscordIcon className="h-4 w-4 fill-current" />
              <span>Connect Discord Account</span>
            </button>
          </div>
        ) : (
          <div className="my-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="h-7 w-7 rounded-full border border-[#E53935]/40 object-cover"
              />
              <div>
                <p className="font-semibold text-black">{user.username}</p>
                <p className="text-[10px] text-zinc-500 font-mono">ID: {user.id}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Bound</span>
            </span>
          </div>
        )}

        {/* GCash / InstaPay QR & Account Section */}
        <div className="space-y-4 pt-1">
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
            {/* QR Image Box */}
            <div
              onClick={() => setShowEnlargedQr(true)}
              className="relative group cursor-pointer flex-shrink-0"
              title="Click to zoom QR code"
            >
              <div className="h-28 w-28 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md border border-zinc-200 group-hover:border-[#E53935] transition-colors overflow-hidden">
                <img
                  src={qrUrl}
                  alt="InstaPay GCash QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-center flex items-center justify-center gap-1 text-zinc-500 group-hover:text-[#E53935] mt-1 transition-colors">
                <ZoomIn className="h-3 w-3" />
                <span>Enlarge QR</span>
              </span>
            </div>

            {/* Account Details */}
            <div className="flex-1 space-y-1.5 text-center sm:text-left font-mono w-full">
              <span className="text-[10px] uppercase text-[#E53935] bg-[#E53935]/10 px-2 py-0.5 rounded border border-[#E53935]/30 font-bold inline-block">
                Universal InstaPay QR
              </span>

              <div className="flex items-center justify-center sm:justify-between gap-2 pt-0.5">
                <span className="text-xs text-zinc-600 font-sans">Account:</span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="text-xs font-bold font-mono transition-colors active:scale-95 flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-zinc-200"
                  title="Copy Account Name"
                >
                  {copiedAccount ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="h-3 w-3" />
                      <span>COPIED!</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-black hover:text-[#E53935]">
                      <span>{gcashName}</span>
                      <Copy className="h-3 w-3 text-zinc-400" />
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center sm:justify-between gap-2">
                <span className="text-xs text-zinc-600 font-sans">Amount:</span>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="text-sm font-bold font-mono tabular-nums transition-colors active:scale-95 flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-zinc-200"
                  title="Copy exact amount"
                >
                  {copiedAmount ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="h-3.5 w-3.5" />
                      <span>COPIED!</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#E53935] hover:text-black">
                      <span>₱{plan.price.toLocaleString()} PHP</span>
                      <Copy className="h-3 w-3 text-zinc-400" />
                    </span>
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
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#E53935] text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-700 font-mono mb-1 font-semibold">
                GCash Reference Number (13 Digits) *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. 1029384756102"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder:text-zinc-400 text-base sm:text-sm focus:outline-none focus:border-black font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-700 font-mono mb-1 font-semibold">
                Sender Name / Mobile (Optional)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Juan D. / 0917xxxxxxx"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder:text-zinc-400 text-base sm:text-sm focus:outline-none focus:border-black font-mono transition-colors"
              />
            </div>

            {/* Receipt Screenshot Upload with Drag & Drop & Visual Preview */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-700 font-mono mb-1 font-semibold">
                Receipt Screenshot (Speeds up approval)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-3.5 text-center transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50"
                    : receiptBase64
                    ? "border-emerald-500/50 bg-emerald-50/30"
                    : "border-zinc-300 hover:border-black bg-zinc-50"
                }`}
              >
                <input
                  type="file"
                  accept={RECEIPT_IMAGE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {receiptBase64 ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={receiptBase64}
                        alt="Receipt preview"
                        className="h-12 w-12 object-contain rounded-lg border border-emerald-500/50 bg-white flex-shrink-0"
                      />
                      <div className="text-left text-xs min-w-0">
                        <p className="text-emerald-700 font-medium font-mono truncate">
                          {receiptFileName || "receipt.png"}
                        </p>
                        <p className="text-zinc-500 text-[10px] font-mono">
                          {receiptFileSize} • Click to replace
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearReceipt();
                      }}
                      className="p-1.5 rounded-lg bg-red-50 text-[#E53935] hover:bg-red-100 border border-red-200 transition-colors z-20 flex-shrink-0"
                      title="Remove receipt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-600 py-2 font-mono">
                    <Upload className="h-4 w-4 text-[#E53935] flex-shrink-0" />
                    <span>
                      {isDragging
                        ? "Drop screenshot to attach"
                        : "Click to upload or drag receipt screenshot here"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Risk Agreement Disclosure */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="termsAgreement"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer flex-shrink-0"
                />
                <span className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#E53935] hover:text-[#A71919] underline font-mono font-medium inline"
                  >
                    Terms of Service
                  </button>
                  . I understand digital licenses are <strong className="text-black">strictly non-refundable</strong>, I use this software <strong className="text-black">at my own risk</strong>, and Red Line is <strong className="text-black">not liable for game bans</strong>. Engine is verified <strong className="text-emerald-600 font-semibold">undetected</strong>.
                </span>
              </label>
            </div>

            {/* Submit CTA (Primary White background, Secondary Black button, Tertiary Red icon) */}
            <button
              type="submit"
              disabled={isSubmitting || !user || !agreedTerms}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg min-h-[48px] bg-black hover:bg-zinc-800 text-white hover:-translate-y-0.5 ${
                isSubmitting || !user || !agreedTerms
                  ? "opacity-50 cursor-not-allowed hover:translate-y-0"
                  : "active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <span>Transmitting Order to Staff...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#E53935]" />
                  {!agreedTerms ? (
                    <span>Agree to Terms to Continue</span>
                  ) : (
                    <span>Submit Payment for Verification</span>
                  )}
                  <ArrowRight className="h-4 w-4 text-[#E53935]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      {showEnlargedQr && (
        <div
          onClick={() => setShowEnlargedQr(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-2xl bg-white border border-zinc-200 p-5 text-center shadow-2xl"
          >
            <button
              onClick={() => setShowEnlargedQr(false)}
              className="absolute top-3 right-3 text-zinc-500 hover:text-black p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-mono font-bold text-black mb-3">
              Scan InstaPay / GCash QR
            </p>
            <div className="rounded-xl bg-white p-3 shadow-md border border-zinc-200">
              <img
                src={qrUrl}
                alt="Enlarged QR"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-[11px] text-zinc-600 font-mono mt-3">
              Account: <strong className="text-black">{gcashName}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Terms of Service Sub-modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>,
    document.body
  );
}
