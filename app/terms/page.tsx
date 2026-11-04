import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowLeft, Lock, FileText, Ban, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Red Line VIP for Assault Fire PH",
  description: "Terms of service, refund policy, and operational risk disclaimer for Red Line VIP.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4 sm:py-8 font-sans bg-white text-zinc-800">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Store</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black font-sans text-black tracking-tight uppercase">
          TERMS OF SERVICE & DISCLAIMER
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Effective Date: October 2026 • Assault Fire PH Single-Seat License Agreement
        </p>
      </div>

      {/* Quick Summary Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2">
          <div className="flex items-center gap-2 text-[#E53935] font-mono text-xs font-bold uppercase">
            <Ban className="h-4 w-4" />
            <span>Strictly Non-Refundable</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            All payments are final once verified. Digital license keys cannot be recalled or refunded after issuance.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
          <div className="flex items-center gap-2 text-black font-mono text-xs font-bold uppercase">
            <AlertTriangle className="h-4 w-4 text-[#E53935]" />
            <span>Use At Your Own Risk</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            You operate the visual assist engine at your personal discretion. Red Line is not liable for game penalties or bans.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold uppercase">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Undetected Engine</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            Engine operates on direct physical swapchain surfaces with stream isolation to maintain clean, undetected operation.
          </p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm text-zinc-600 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Strict Non-Refundable Policy
          </h2>
          <p>
            Due to the immediate provisioning and cryptographic nature of single-seat digital license keys, all transactions conducted via GCash, InstaPay, or cryptocurrency are <strong className="text-black">STRICTLY NON-REFUNDABLE AND FINAL</strong> once payment has been submitted and reviewed.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-500 pl-2">
            <li>No refunds, returns, or balance exchanges will be granted once an activation key is generated or dispatched.</li>
            <li>Failure to follow PC prerequisite instructions or game maintenance downtime does not qualify for refunds.</li>
            <li>Initiating fraudulent payment reversals or chargebacks will result in permanent hardware ban (HWID revocation) and permanent blacklisting from our Discord syndicate.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Assumption of Operational Risk (&quot;Use at Your Own Risk&quot;)
          </h2>
          <p>
            All products and tactical visual suites provided by Red Line VIP are offered exclusively for Assault Fire PH research, competitive display customization, and private performance testing. By purchasing or downloading any file from this service:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-500 pl-2">
            <li>You expressly understand and acknowledge that you are using this third-party utility entirely <strong className="text-black">AT YOUR OWN RISK</strong>.</li>
            <li>You agree that no guarantees are made regarding your personal game standing or tournament eligibility.</li>
            <li>You accept full accountability for your in-game behavior and operational configuration while utilizing the software.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Limitation of Liability &amp; Ban Disclaimer
          </h2>
          <p>
            Red Line VIP, its core developers, server administrators, and affiliates shall <strong className="text-black">NOT BE HELD LIABLE</strong> for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this software, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-500 pl-2">
            <li>Account bans, temporary suspensions, competitive restrictions, or disciplinary actions enforced by third-party game publishers or anti-cheat developers.</li>
            <li>Loss of in-game rank, virtual items, digital currency, or account valuation.</li>
            <li>Hardware ID bans resulting from external cheat software, unauthorized script injection, or user carelessness.</li>
          </ul>
          <p className="text-xs text-zinc-500 pt-2">
            While our development team continuously verifies our security layers, no third-party modification can claim indefinite immunity against server-side behavioral profiling or manual player reports.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Undetected Engine Status &amp; Maintenance
          </h2>
          <p>
            The Red Line VIP client is designed with modern bypass principles specifically for Assault Fire PH:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-500 pl-2">
            <li><strong className="text-black">Hardware Direct Surface Overlay:</strong> Telemetry is drawn over the Assault Fire PH viewport without modifying game executable memory space directly.</li>
            <li><strong className="text-black">Broadcast Isolation:</strong> Full capture protection against OBS Studio, Discord Screenshare, and standard screen recording utilities.</li>
            <li><strong className="text-black">Active Undetected Architecture:</strong> In the event of a game patch or anti-cheat update, software may enter temporary maintenance status to ensure ongoing security before re-enabling access.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Hardware Binding (HWID) &amp; License Integrity
          </h2>
          <p>
            Each license key is single-seat and cryptographically locked to one computer hardware signature upon initial activation:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-500 pl-2">
            <li>Sharing, sublicensing, or renting license keys is prohibited and automatically flagged by server anti-tamper.</li>
            <li>HWID resets are granted at staff discretion for genuine motherboard or PC upgrades.</li>
            <li>Attempting to reverse-engineer, decompile, or dump engine binaries results in automatic license termination with no compensation.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-bold font-mono text-black flex items-center gap-2">
            Third-Party Independence &amp; Non-Affiliation
          </h2>
          <p>
            Red Line VIP and Esmiringhoy are independent third-party performance and tactical display tools developed specifically for the Assault Fire PH client. This software is completely independent and is not endorsed by, sponsored by, or affiliated with the original game developers, creators, or trademark holders. All trademarks, game titles, and assets belong to their respective copyright owners.
          </p>
        </section>
      </div>

      {/* Acceptance Box */}
      <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-mono font-bold text-black uppercase tracking-wider">
            Questions regarding terms or licensing?
          </p>
          <p className="text-xs text-zinc-600 font-sans">
            Contact staff directly through our verified Discord syndicate portal.
          </p>
        </div>
        <Link
          href="/#pricing"
          className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 active:scale-[0.98] text-white font-mono text-xs font-bold transition-all shadow-md whitespace-nowrap"
        >
          View Plans &amp; Pricing
        </Link>
      </div>
    </div>
  );
}
