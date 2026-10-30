import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DiscordAuthProvider } from "@/context/DiscordAuthContext";
import AppFrame from "@/components/AppFrame";

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
          <AppFrame>{children}</AppFrame>
        </DiscordAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
