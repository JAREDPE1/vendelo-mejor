import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { institutionalPages } from "@/data/institutional";
import { ToolPage } from "@/components/ToolPage";
import { CategoryPage } from "@/components/CategoryPage";
import { InstitutionalPage } from "@/components/InstitutionalPage";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...tools.slice(1), ...categories, ...institutionalPages].map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  const page =
    tool ||
    categories.find((item) => item.slug === slug) ||
    institutionalPages.find((item) => item.slug === slug);
  if (!page) return {};
  return pageMetadata(tool ? `${tool.name} gratis` : page.title, page.description, `/${slug}`);
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (tool) return <ToolPage tool={tool} />;
  const category = categories.find((item) => item.slug === slug);
  if (category) return <CategoryPage category={category} />;
  const page = institutionalPages.find((item) => item.slug === slug);
  if (page) return <InstitutionalPage page={page} />;
  notFound();
}
