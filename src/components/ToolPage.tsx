import Link from "next/link";
import { Suspense } from "react";
import type { ToolDefinition } from "@/data/tools";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { ProductForm } from "@/components/ProductForm";
import { PriceCalculator } from "@/components/PriceCalculator";
import { ImproveForm } from "@/components/ImproveForm";
import { ToolCard } from "@/components/ToolCard";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { absoluteUrl } from "@/lib/site";

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  return (
    <div className="tool-page container">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <Icon name="chevron" size={13} />
        <Link href="/#herramientas">Herramientas</Link>
        <Icon name="chevron" size={13} />
        <span aria-current="page">{tool.name}</span>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          url: absoluteUrl(`/${tool.slug}`),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          inLanguage: "es",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <div className="tool-page-heading">
        <span className="eyebrow">
          <Icon name={tool.icon} size={16} /> {tool.name.toUpperCase()}
          <span className="free-badge">Gratis</span>
        </span>
        <h1>{tool.title}</h1>
        <p>{tool.shortDescription} Sin registro y a tu ritmo.</p>
      </div>
      {tool.mode === "price" ? (
        <PriceCalculator />
      ) : tool.mode === "improve" ? (
        <ImproveForm />
      ) : (
        <Suspense
          fallback={
            <div className="form-panel" role="status">
              Preparando el formulario…
            </div>
          }
        >
          <ProductForm tool={tool} />
        </Suspense>
      )}
      <section className="tool-advice">
        <div>
          <span className="eyebrow">UN PEQUEÑO CONSEJO HACE LA DIFERENCIA</span>
          <h2>
            {tool.mode === "price"
              ? "Cómo interpretar tu cálculo"
              : "Sácale más partido a esta herramienta"}
          </h2>
        </div>
        <ul className="checklist">
          {tool.tips.map((tip) => (
            <li key={tip}>
              <Icon name="check" size={18} />
              {tip}
            </li>
          ))}
        </ul>
      </section>
      {tool.mode === "price" && (
        <section className="formula-note">
          <h2>La fórmula, paso a paso</h2>
          <p>Precio de venta = (costo + gastos) ÷ (1 − margen ÷ 100 − comisión ÷ 100).</p>
          <p>
            Por ejemplo, con un costo de S/ 100, gastos de S/ 10, un margen del 20 % y una comisión
            del 5 %, el precio calculado es S/ 146.67. El margen es una parte del precio final;
            sumar un 20 % al costo produce un resultado diferente.
          </p>
        </section>
      )}
      <AdPlaceholder placement="tool-bottom" />
      <section className="related-tools">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SIGUE PREPARANDO TU VENTA</span>
            <h2>También te puede ayudar</h2>
          </div>
          <Link href="/#herramientas" className="text-link">
            Ver todas
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="tools-grid">
          {tools
            .filter((item) => item.slug !== tool.slug)
            .slice(0, 3)
            .map((item) => (
              <ToolCard key={item.slug} tool={item} />
            ))}
        </div>
      </section>
      <div className="category-links">
        <span>Guías para vender:</span>
        {categories.map((category) => (
          <Link href={`/${category.slug}`} key={category.slug}>
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
