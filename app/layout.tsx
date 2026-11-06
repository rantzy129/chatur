import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DiscordAuthProvider } from "@/context/DiscordAuthContext";
import AppFrame from "@/components/AppFrame";
import { siteUrl } from "@/lib/site";

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
  metadataBase: siteUrl,
  title: {
    default: "Red Line VIP for Assault Fire PH | Official Site",
    template: "%s | Red Line VIP",
  },
  description:
    "Explore Red Line VIP plans for Assault Fire PH, including weekly, monthly, and lifetime access. Manage your license and access private client downloads.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Red Line VIP",
    title: "Red Line VIP for Assault Fire PH | Official Site",
    description:
      "Explore weekly, monthly, and lifetime Red Line VIP plans for Assault Fire PH.",
    images: [
      {
        url: "/logo.png",
        width: 1280,
        height: 1280,
        alt: "Red Line VIP",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Red Line VIP for Assault Fire PH",
    description:
      "Explore weekly, monthly, and lifetime Red Line VIP plans for Assault Fire PH.",
    images: ["/logo.png"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}#website`,
                  url: siteUrl.toString(),
                  name: "Red Line VIP",
                  inLanguage: "en",
                },
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}#organization`,
                  name: "Red Line VIP",
                  url: siteUrl.toString(),
                  logo: new URL("/logo.png", siteUrl).toString(),
                },
              ],
            }),
          }}
        />
        <DiscordAuthProvider>
          <AppFrame>{children}</AppFrame>
        </DiscordAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
