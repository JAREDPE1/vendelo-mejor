import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: "es_ES",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
