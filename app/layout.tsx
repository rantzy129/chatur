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
    default: "Assault Fire Cheat & Undetected Wallhack | Red Line VIP",
    template: "%s | Red Line VIP - Assault Fire Cheats",
  },
  description:
    "The #1 undetected Assault Fire cheat and stream-proof wallhack ESP suite. Bone skeleton aimbot tracking, visual ESP overlays, and Peace Cleaner device ban remover. Works on all AF servers and versions.",
  keywords: [
    "assault fire cheat",
    "assault fire cheats",
    "assault fire wallhack",
    "assault fire aimbot",
    "assault fire cheat undetected",
    "assault fire undetected cheat",
    "assault fire esp",
    "assault fire hack",
    "assault fire hacks",
    "assault fire wallhack undetected",
    "assault fire esp hack",
    "assault fire cheat download",
    "assault fire hack download",
    "assault fire stream proof",
    "assault fire bone esp",
    "af cheat",
    "af wallhack",
    "af hack",
    "af esp",
    "af aimbot",
    "af cheat undetected",
    "assault fire unban",
    "assault fire device ban",
    "assault fire hwid unban",
    "assault fire peace cleaner",
    "red line vip",
    "red line cheats",
    "red line assault fire",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "google324759b81e7af25f",
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
    siteName: "Red Line VIP - Assault Fire Cheats",
    title: "Assault Fire Cheat & Undetected Wallhack | Red Line VIP",
    description:
      "Undetected stream-proof wallhack, visual ESP suite, bone skeleton aimbot tracking, and Peace Cleaner device ban remover for all Assault Fire servers.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Red Line VIP - Undetected Assault Fire Cheat & Wallhack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assault Fire Cheat & Undetected Wallhack | Red Line VIP",
    description:
      "Undetected stream-proof wallhack, visual ESP suite, bone skeleton aimbot tracking, and Peace Cleaner device ban remover for all Assault Fire servers.",
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: "Red Line VIP - Undetected Assault Fire Cheat & Wallhack",
      },
    ],
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
                  name: "Red Line VIP - Assault Fire Cheats & Wallhack",
                  alternateName: [
                    "Assault Fire Cheat",
                    "Assault Fire Wallhack",
                    "Assault Fire Aimbot",
                    "Assault Fire Cheat Undetected",
                    "AF Cheat",
                    "AF Wallhack",
                    "AF Hack",
                    "Red Line VIP",
                  ],
                  description:
                    "The #1 undetected Assault Fire cheat and stream-proof wallhack ESP suite with bone skeleton tracking and Peace Cleaner device ban remover.",
                  inLanguage: "en",
                },
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}#organization`,
                  name: "Red Line VIP",
                  url: siteUrl.toString(),
                  logo: new URL("/logo.png", siteUrl).toString(),
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${siteUrl}#software`,
                  name: "Red Line VIP - Assault Fire Wallhack & ESP Suite",
                  applicationCategory: "GameApplication",
                  operatingSystem: "Windows 10, Windows 11",
                  description:
                    "Undetected tactical stream-proof wallhack, visual ESP overlay, bone skeleton aimbot tracking, and Peace Cleaner device ban removal suite for Assault Fire.",
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "PHP",
                    lowPrice: "500",
                    highPrice: "3000",
                    offerCount: "3",
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": `${siteUrl}#faq`,
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Is this Assault Fire cheat undetected?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Red Line VIP uses driver-level stream isolation and non-invasive memory hooks that remain 100% undetected across all current Assault Fire servers and versions.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What features are included in the Assault Fire wallhack?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "The suite includes full 2D/3D player ESP boxes, distance radar, health meters, real-time bone skeleton tracking for aimbot-precision hitbox alignment, and the Peace Cleaner device ban removal tool.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What is Peace Cleaner and does it remove device bans?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Peace Cleaner removes the device ban you got so you will be able to play Assault Fire again immediately. It clears HWID identifiers, resets machine flags, and flushes anti-cheat tracking logs.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Does this work on all Assault Fire servers?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Red Line VIP is universally compatible across all Assault Fire servers and versions with automatic detection and seamless operation.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Is the wallhack stream-proof on Discord and OBS?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. The visual overlay operates on a separate graphics render layer that is completely invisible to screen capture software, Discord streaming, OBS Studio, and TikTok Live Studio.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How do I download and activate the Assault Fire cheat?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Select your preferred subscription tier (Weekly, Monthly, or Lifetime), submit payment via GCash or Maya, and log into your VIP Customer Portal with Discord to immediately receive your license key and cheat download.",
                      },
                    },
                  ],
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
