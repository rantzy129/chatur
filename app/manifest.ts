import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Assault Fire VIP - Cheats & Wallhack",
    short_name: "Assault Fire VIP",
    description:
      "Undetected tactical cheat, wallhack ESP, and Peace Cleaner suite for all Assault Fire servers.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#E53935",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
      },
    ],
  };
}

