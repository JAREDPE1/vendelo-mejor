import Link from "next/link";
import { Icon } from "@/components/Icon";

export function CategoryCard({
  category,
}: {
  category: { slug: string; name: string; icon: string; accent: string };
}) {
  return (
    <Link className="category-card" href={`/${category.slug}`}>
      <span className={`icon-box ${category.accent}`}>
        <Icon name={category.icon} size={29} />
      </span>
      <h3>{category.name}</h3>
      <span>
        Consejos para vender
        <Icon name="arrow" size={15} />
      </span>
    </Link>
  );
}
