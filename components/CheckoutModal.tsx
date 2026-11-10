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
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-white border border-zinc-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-left animate-in fade-in zoom-in-95 duration-150 font-sans"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout modal"
          className="absolute top-5 right-5 z-10 text-zinc-400 hover:text-black p-2 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Plan Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-100 pr-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Purchasing License
              </span>
              {plan.isLifetime && (
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] border border-red-200/80">
                  Lifetime VIP
                </span>
              )}
            </div>
            <h3 id="checkout-modal-title" className="text-xl sm:text-2xl font-black text-black font-sans tracking-tight">
              {plan.tier}
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Undetected ring-0 driver • Instant Discord delivery
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl sm:text-3xl font-black text-black font-sans tracking-tight">
              ₱{plan.price.toLocaleString()}
            </span>
            <span className="block text-[11px] font-medium text-zinc-400">
              PHP / InstaPay
            </span>
          </div>
        </div>

        {/* Discord Gate: Only logged in users can see payment details & form */}
        {!user ? (
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-3xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2] shadow-sm">
              <DiscordIcon className="h-8 w-8 fill-current" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-xl font-bold text-black font-sans tracking-tight">
                Discord Sign-In Required
              </h4>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
                To prevent payment fraud and automatically bind your hardware ID and license key, please sign in with Discord before accessing payment details.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs font-sans text-zinc-600 flex items-center justify-center gap-2 max-w-sm mx-auto">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>InstaPay QR, GCash details & order form unlock immediately</span>
            </div>

            <div className="pt-1 max-w-sm mx-auto">
              <button
                type="button"
                onClick={loginWithDiscord}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] active:scale-[0.98] text-white text-sm font-bold font-sans transition-all flex items-center justify-center gap-2.5 shadow-md shadow-[#5865F2]/25 cursor-pointer"
              >
                <DiscordIcon className="h-4 w-4 fill-current" />
                <span>Sign In with Discord to View Payment Form</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              Secure OAuth 2.0 • No password shared • Instant activation
            </p>
          </div>
        ) : (
          <>
            <div className="my-4 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
                />
                <div>
                  <p className="font-bold text-black font-sans">{user.username}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">ID: {user.id}</p>
                </div>
              </div>
              <span className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Discord Linked</span>
              </span>
            </div>

        {/* GCash / InstaPay QR & Account Section */}
        <div className="space-y-4 pt-1">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-center gap-4">
            {/* QR Image Box */}
            <div
              onClick={() => setShowEnlargedQr(true)}
              className="relative group cursor-pointer shrink-0"
              title="Click to zoom QR code"
            >
              <div className="h-28 w-28 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xs border border-zinc-200 group-hover:border-[#E53935] transition-colors overflow-hidden">
                <img
                  src={qrUrl}
                  alt="InstaPay GCash QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] font-sans font-semibold text-center flex items-center justify-center gap-1 text-zinc-400 group-hover:text-[#E53935] mt-1.5 transition-colors">
                <ZoomIn className="h-3 w-3" />
                <span>Enlarge QR</span>
              </span>
            </div>

            {/* Account Details */}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full font-sans">
              <span className="text-[10px] uppercase text-[#E53935] bg-red-50 px-2.5 py-1 rounded-full border border-red-200/80 font-bold inline-block">
                Universal InstaPay QR
              </span>

              <div className="space-y-1.5 pt-0.5 text-xs">
                <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white border border-zinc-200/60">
                  <span className="text-zinc-500 font-medium">Account:</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="font-bold font-sans text-xs transition-colors active:scale-95 flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-zinc-100 cursor-pointer"
                    title="Copy Account Name"
                  >
                    {copiedAccount ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="h-3 w-3" />
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-black hover:text-[#E53935]">
                        <span>{gcashName}</span>
                        <Copy className="h-3 w-3 text-zinc-400" />
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white border border-zinc-200/60">
                  <span className="text-zinc-500 font-medium">Amount:</span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="font-bold font-sans text-xs transition-colors active:scale-95 flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-zinc-100 cursor-pointer"
                    title="Copy exact amount"
                  >
                    {copiedAmount ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#E53935] hover:text-black">
                        <span>₱{plan.price.toLocaleString()} PHP</span>
                        <Copy className="h-3 w-3 text-zinc-400" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 font-sans leading-tight">
                Compatible with GCash, Maya, ShopeePay, BDO, BPI, GoTyme, or any PH banking app.
              </p>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-[#E53935] text-xs font-sans flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 font-sans mb-1.5">
                GCash Reference Number (13 Digits) <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. 1029384756102"
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-black placeholder:text-zinc-400 text-sm font-sans focus:bg-white focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 font-sans mb-1.5">
                Sender Name / Mobile <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Juan D. / 0917xxxxxxx"
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-black placeholder:text-zinc-400 text-sm font-sans focus:bg-white focus:outline-none focus:border-black transition-all"
              />
            </div>

            {/* Receipt Screenshot Upload with Drag & Drop & Visual Preview */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 font-sans mb-1.5">
                Receipt Screenshot <span className="text-zinc-400 font-normal">(Speeds up approval)</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50"
                    : receiptBase64
                    ? "border-emerald-500/50 bg-emerald-50/20"
                    : "border-zinc-200 hover:border-zinc-400 bg-zinc-50/50"
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
                        className="h-12 w-12 object-contain rounded-xl border border-emerald-500/40 bg-white shrink-0"
                      />
                      <div className="text-left text-xs min-w-0 font-sans">
                        <p className="text-emerald-700 font-bold truncate">
                          {receiptFileName || "receipt.png"}
                        </p>
                        <p className="text-zinc-400 text-[11px]">
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
                      className="p-2 rounded-xl bg-red-50 text-[#E53935] hover:bg-red-100 border border-red-200 transition-colors z-20 shrink-0 cursor-pointer"
                      title="Remove receipt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500 py-1 font-sans">
                    <Upload className="h-4 w-4 text-[#E53935] shrink-0" />
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
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-3.5 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="termsAgreement"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer shrink-0"
                />
                <span className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#E53935] hover:underline font-semibold inline cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  . I understand digital licenses are <strong className="text-black font-semibold">strictly non-refundable</strong>, I use this software <strong className="text-black font-semibold">at my own risk</strong>, and Red Line is <strong className="text-black font-semibold">not liable for game bans</strong>. Engine is verified <strong className="text-emerald-600 font-semibold">undetected</strong>.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !user || !agreedTerms}
              className={`w-full py-4 px-5 rounded-2xl font-bold text-sm font-sans tracking-wide transition-all flex items-center justify-center gap-2 shadow-md bg-black hover:bg-zinc-800 text-white cursor-pointer ${
                isSubmitting || !user || !agreedTerms
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-[0.98] hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span>Transmitting Order to Staff...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#E53935]" />
                  <span>{!agreedTerms ? "Agree to Terms to Continue" : "Submit Payment for Verification"}</span>
                  <ArrowRight className="h-4 w-4 text-[#E53935]" />
                </>
              )}
            </button>
          </form>
        </div>
      </>
    )}
  </div>

      {/* Enlarged QR Modal */}
      {showEnlargedQr && (
        <div
          onClick={() => setShowEnlargedQr(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-3xl bg-white border border-zinc-200 p-6 text-center shadow-2xl font-sans"
          >
            <button
              onClick={() => setShowEnlargedQr(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h4 className="text-sm font-bold text-black mb-3">
              Scan InstaPay / GCash QR
            </h4>
            <div className="rounded-2xl bg-zinc-50 p-3 shadow-inner border border-zinc-200">
              <img
                src={qrUrl}
                alt="Enlarged QR"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-zinc-500 font-sans mt-3">
              Account Name: <strong className="text-black">{gcashName}</strong>
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
