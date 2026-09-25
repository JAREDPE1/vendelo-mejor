import Link from "next/link";
import type { CategoryGuide } from "@/data/categories";
import { categories } from "@/data/categories";
import { Icon } from "@/components/Icon";
import { Faq } from "@/components/Faq";
import { GeneratedResult } from "@/components/GeneratedResult";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export function CategoryPage({ category }: { category: CategoryGuide }) {
  return (
    <article className="container guide-page">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <Icon name="chevron" size={13} />
        <Link href="/#categorias">Categorías</Link>
        <Icon name="chevron" size={13} />
        <span aria-current="page">{category.name}</span>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: absoluteUrl(`/${category.slug}`),
            },
          ],
        }}
      />
      <header className="guide-heading">
        <span className={`icon-box ${category.accent}`}>
          <Icon name={category.icon} size={30} />
        </span>
        <span className="eyebrow">GUÍAS PARA VENDER · {category.name.toUpperCase()}</span>
        <h1>{category.title}</h1>
        <p>{category.intro}</p>
        <Link href={`/crear-anuncio?categoria=${category.key}`} className="button button-primary">
          Crear mi anuncio de {category.name.toLowerCase()}
          <Icon name="arrow" size={18} />
        </Link>
      </header>
      <div className="guide-grid">
        <div className="guide-prose">
          {category.sections.map((section, i) => (
            <section key={section.title}>
              <span className="article-number">0{i + 1}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section className="guide-example">
            <span className="eyebrow">UN EJEMPLO PARA INSPIRARTE</span>
            <h2>Así podría verse tu anuncio</h2>
            <GeneratedResult title={category.example.title} text={category.example.description} />
            <p className="field-hint">
              Ejemplo ilustrativo. Utiliza solo los datos que correspondan a tu producto.
            </p>
          </section>
        </div>
        <aside className="guide-sidebar">
          <div className="checklist-card">
            <span className="icon-box green">
              <Icon name="check" />
            </span>
            <h2>Antes de publicar, reúne estos datos</h2>
            <ul className="checklist">
              {category.checklist.map((item) => (
                <li key={item}>
                  <Icon name="check" size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="guide-tool-links">
            <h2>Prepara tu publicación</h2>
            {[
              ["generador-titulos", "Encuentra un buen título"],
              ["generador-descripciones", "Organiza la descripción"],
              ["texto-whatsapp", "Crea un texto para WhatsApp"],
            ].map(([slug, label]) => (
              <Link key={slug} href={`/${slug}?categoria=${category.key}`}>
                {label}
                <Icon name="arrow" size={16} />
              </Link>
            ))}
          </div>
        </aside>
      </div>
      <section className="guide-faq">
        <h2>Preguntas sobre la venta de {category.name.toLowerCase()}</h2>
        <Faq items={category.faq} />
      </section>
      <nav className="category-links" aria-label="Más categorías">
        <span>Otras guías:</span>
        {categories
          .filter((item) => item.slug !== category.slug)
          .map((item) => (
            <Link key={item.slug} href={`/${item.slug}`}>
              {item.name}
            </Link>
          ))}
      </nav>
    </article>
  );
}
