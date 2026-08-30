import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";

const SITE = "https://israel.easytech365.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/about", priority: 0.8, freq: "monthly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/service-packages", priority: 0.9, freq: "monthly" as const },
    { path: "/projects", priority: 0.7, freq: "monthly" as const },
    { path: "/blog", priority: 0.9, freq: "weekly" as const },
    { path: "/resume", priority: 0.5, freq: "yearly" as const },
    { path: "/contact", priority: 0.7, freq: "yearly" as const },
  ];

  return [
    ...pages.map((p) => ({
      url: `${SITE}${p.path}`,
      lastModified: new Date(),
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
