import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold font-mono text-white">404 - PAGE NOT FOUND</h2>
      <p className="text-xs text-zinc-400 max-w-sm font-mono">
        The requested tactical coordinate does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Base</span>
      </Link>
    </div>
  );
}

