import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl.toString(),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: new URL("/terms", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
