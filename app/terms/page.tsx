import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowLeft, Lock, FileText, Ban, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Red Line VIP",
  description: "Terms of service, refund policy, and operational risk disclaimer for Red Line VIP.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4 sm:py-8 font-sans">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Store</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono">
          <FileText className="h-3.5 w-3.5" />
          <span>LEGAL & COMPLIANCE POLICY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
          TERMS OF SERVICE & DISCLAIMER
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Effective Date: October 2026 • Single-Seat License Agreement
        </p>
      </div>

      {/* Quick Summary Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0b0e14] border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
            <Ban className="h-4 w-4" />
            <span>Strictly Non-Refundable</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            All payments are final once verified. Digital license keys cannot be recalled or refunded after issuance.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0e14] border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="h-4 w-4" />
            <span>Use At Your Own Risk</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            You operate the visual assist engine at your personal discretion. Red Line is not liable for game penalties or bans.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0e14] border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <ShieldCheck className="h-4 w-4" />
            <span>Undetected Engine</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Engine operates on direct physical swapchain surfaces with stream isolation to maintain clean, undetected operation.
          </p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08]">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">01.</span>
            Strict Non-Refundable Policy
          </h2>
          <p>
            Due to the immediate provisioning and cryptographic nature of single-seat digital license keys, all transactions conducted via GCash, InstaPay, or cryptocurrency are <strong className="text-white">STRICTLY NON-REFUNDABLE AND FINAL</strong> once payment has been submitted and reviewed.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
            <li>No refunds, returns, or balance exchanges will be granted once an activation key is generated or dispatched.</li>
            <li>Failure to follow PC prerequisite instructions or game maintenance downtime does not qualify for refunds.</li>
            <li>Initiating fraudulent payment reversals or chargebacks will result in permanent hardware ban (HWID revocation) and permanent blacklisting from our Discord syndicate.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08]">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">02.</span>
            Assumption of Operational Risk ("Use at Your Own Risk")
          </h2>
          <p>
            All products and tactical visual suites provided by Red Line VIP are offered exclusively for research, competitive display customization, and private performance testing. By purchasing or downloading any file from this service:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
            <li>You expressly understand and acknowledge that you are using this third-party utility entirely <strong className="text-white">AT YOUR OWN RISK</strong>.</li>
            <li>You agree that no guarantees are made regarding your personal game standing or tournament eligibility.</li>
            <li>You accept full accountability for your in-game behavior and operational configuration while utilizing the software.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08]">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">03.</span>
            Limitation of Liability & Ban Disclaimer
          </h2>
          <p>
            Red Line VIP, its core developers, server administrators, and affiliates shall <strong className="text-white">NOT BE HELD LIABLE</strong> for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this software, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
            <li>Account bans, temporary suspensions, competitive restrictions, or disciplinary actions enforced by third-party game publishers or anti-cheat developers.</li>
            <li>Loss of in-game rank, virtual items, digital currency, or account valuation.</li>
            <li>Hardware ID bans resulting from external cheat software, unauthorized script injection, or user carelessness.</li>
          </ul>
          <p className="text-xs text-zinc-400 pt-2">
            While our development team continuously verifies our security layers, no third-party modification can claim indefinite immunity against server-side behavioral profiling or manual player reports.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08]">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">04.</span>
            Undetected Engine Status & Maintenance
          </h2>
          <p>
            The Red Line VIP client is designed with modern bypass principles:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
            <li><strong className="text-zinc-200">Hardware Direct Surface Overlay:</strong> Telemetry is drawn without modifying game executable memory space directly.</li>
            <li><strong className="text-zinc-200">Broadcast Isolation:</strong> Full capture protection against OBS Studio, Discord Screenshare, and standard screen recording utilities.</li>
            <li><strong className="text-zinc-200">Active Undetected Architecture:</strong> In the event of a game patch or anti-cheat update, software may enter temporary maintenance status to ensure ongoing security before re-enabling access.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08]">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">05.</span>
            Hardware Binding (HWID) & License Integrity
          </h2>
          <p>
            Each license key is single-seat and cryptographically locked to one computer hardware signature upon initial activation:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
            <li>Sharing, sublicensing, or renting license keys is prohibited and automatically flagged by server anti-tamper.</li>
            <li>HWID resets are granted at staff discretion for genuine motherboard or PC upgrades.</li>
            <li>Attempting to reverse-engineer, decompile, or dump engine binaries results in automatic license termination with no compensation.</li>
          </ul>
        </section>
      </div>

      {/* Acceptance Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/20 to-black border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Questions regarding terms or licensing?
          </p>
          <p className="text-xs text-zinc-400">
            Contact staff directly through our verified Discord syndicate portal.
          </p>
        </div>
        <Link
          href="/#pricing"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors whitespace-nowrap"
        >
          View Plans & Pricing
        </Link>
      </div>
    </div>
  );
}
