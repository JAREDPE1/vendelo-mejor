import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { institutionalPages } from "@/data/institutional";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...tools.map((tool) => ({
      url: absoluteUrl(`/${tool.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...institutionalPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
