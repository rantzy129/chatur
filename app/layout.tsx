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
  title: "Red Line | Assault Fire PH",
  description:
    "Premium stream-proof tactical visual engine and performance optimization suite engineered specifically for Assault Fire PH with single-device hardware security.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#FFFFFF] text-[#0A0A0B] flex flex-col selection:bg-[#E53935] selection:text-[#FFFFFF] font-sans antialiased">
        <DiscordAuthProvider>
          <AppFrame>{children}</AppFrame>
        </DiscordAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
