import type { MetadataRoute } from "next";
import { siteConfig, servicePages, companyPages } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...servicePages, ...companyPages];
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    ...pages.map((page) => ({
      url: `${siteConfig.url}${page.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
