"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = (navigator.language || "").toLowerCase();
      const languages = (navigator.languages || []).map((l) => l.toLowerCase());

      const isBangkokTz =
        tz.toLowerCase().includes("bangkok") ||
        tz.toLowerCase().includes("thailand") ||
        tz === "Asia/Bangkok";
      const isThaiLanguage =
        lang.startsWith("th") || languages.some((l) => l.startsWith("th"));

      if (isBangkokTz || isThaiLanguage) {
        // Mark cookie so server-side middleware also blocks subsequent visits
        document.cookie = "rl_block_tz=1; path=/; max-age=604800; SameSite=Lax";
        setIsBlocked(true);
      }
    } catch {
      // Ignore evaluation errors
    }
  }, []);

  const isAdminRoute =
    pathname === "/staff-vault" ||
    pathname.startsWith("/staff-vault") ||
    pathname === "/redgate" ||
    pathname.startsWith("/redgate");

  if (isBlocked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6 text-center text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-red-900/50 bg-red-950/20 backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 font-mono text-xl font-black">
            !
          </div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-white mb-2">
            Access Restricted
          </h1>
          <p className="text-sm font-mono text-red-400">
            Bawal ka diri bai.
          </p>
        </div>
      </main>
    );
  }

  const isLightPage = !isAdminRoute;
  const hasFullBleedLayout =
    pathname === "/" || pathname === "/terms" || pathname === "/faq";

  if (isAdminRoute) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-x-clip ${
        isLightPage ? "bg-[#EDEDF0]" : "bg-tactical-grid"
      }`}
    >
      <Navbar />
      <main
        className={`flex-1 w-full ${
          hasFullBleedLayout
            ? ""
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
