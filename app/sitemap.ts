import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/terms", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
