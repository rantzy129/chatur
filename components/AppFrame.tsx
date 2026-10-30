"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/redgate";

  if (isAdminRoute) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-tactical-grid">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
