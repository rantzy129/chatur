import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DiscordAuthProvider } from "@/context/DiscordAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Red Line VIP — Tactical Visual Engine & Private Syndicate",
  description:
    "Premium stream-proof tactical visual engine with strict single-device hardware security.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-cyber-bg text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white font-sans antialiased">
        <DiscordAuthProvider>
          <div className="relative min-h-screen flex flex-col bg-tactical-grid">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            <Footer />
          </div>
        </DiscordAuthProvider>
      </body>
    </html>
  );
}

