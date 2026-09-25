import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ToolCard } from "@/components/ToolCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { tools, homeFaq } from "@/data/tools";
import { categories } from "@/data/categories";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata(
  "Herramientas gratis para crear mejores anuncios",
  "Prepara anuncios con títulos, descripciones y textos para Marketplace, WhatsApp e Instagram. Añade los detalles de tu producto, revisa y copia gratis.",
  "/",
);

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: "Herramientas gratuitas para preparar anuncios de productos.",
          inLanguage: "es",
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="small-spark">
                <Icon name="sparkles" size={14} />
              </span>{" "}
              TU PRODUCTO MERECE UN BUEN ANUNCIO
            </span>
            <h1>
              Crea mejores anuncios y{" "}
              <span>
                vende más fácil<span className="headline-period">.</span>
              </span>
            </h1>
            <p>
              Completa los datos de tu producto y prepara títulos, descripciones y mensajes para tus
              redes. Revisa qué información falta y copia el texto que necesitas, gratis.
            </p>
            <div className="hero-actions">
              <Link href="/crear-anuncio" className="button button-primary button-large">
                Crear mi anuncio
                <Icon name="arrow" size={19} />
              </Link>
              <Link href="#herramientas" className="button button-text">
                Ver herramientas
                <Icon name="chevron" size={17} />
              </Link>
            </div>
            <div className="hero-benefits">
              <span>
                <Icon name="check" size={15} /> 100 % gratis
              </span>
              <span>
                <Icon name="check" size={15} /> Sin registro
              </span>
              <span>
                <Icon name="check" size={15} /> Fácil de usar
              </span>
            </div>
          </div>
          <div className="hero-preview">
            <div className="preview-topline">
              <span className="preview-label">
                <Icon name="sparkles" size={16} /> DE UNA IDEA A UN BUEN ANUNCIO
              </span>
              <span className="example-label">Ejemplo</span>
            </div>
            <div className="before-note">
              <span>LOS DATOS DE TU PRODUCTO</span>
              <p>Celular usado · 128 GB · azul · con cargador · S/ 450 · recojo en Lima</p>
              <Icon name="arrow" size={20} />
            </div>
            <div className="preview-document">
              <div className="document-heading">
                <span className="icon-box green">
                  <Icon name="align" size={21} />
                </span>
                <span>
                  Tu anuncio, mejor presentado<small>Con la información que tú añades</small>
                </span>
                <span className="document-check">
                  <Icon name="check" size={15} />
                </span>
              </div>
              <span className="preview-caption">UNO DE TUS TÍTULOS</span>
              <h2>Celular de 128 GB — Usado</h2>
              <span className="preview-caption">DESCRIPCIÓN</span>
              <p>Vendo mi celular usado de 128 GB. Estos son los detalles del producto:</p>
              <ul>
                <li>
                  <Icon name="check" size={15} /> Almacenamiento de 128 GB
                </li>
                <li>
                  <Icon name="check" size={15} /> Color azul, con cargador incluido
                </li>
                <li>
                  <Icon name="check" size={15} /> Recojo en Lima
                </li>
              </ul>
              <div className="document-bottom">
                <span>S/ 450.00</span>
                <span className="preview-ready">
                  <Icon name="check" size={14} /> Listo para compartir
                </span>
              </div>
            </div>
            <p className="preview-footnote">Ejemplo creado con los datos indicados arriba.</p>
          </div>
        </div>
      </section>
      <div className="channel-strip">
        <div className="container">
          <span>PREPARA TUS TEXTOS PARA</span>
          <div>
            <span className="channel-name">
              <Icon name="tag" size={19} /> Marketplace
            </span>
            <span className="channel-name">
              <Icon name="message" size={19} /> WhatsApp
            </span>
            <span className="channel-name">
              <span className="instagram-mark" aria-hidden="true" /> Instagram
            </span>
            <span className="other-channels">y donde tú vendas</span>
          </div>
        </div>
      </div>
      <section className="section container" id="herramientas">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MENOS ESFUERZO, MEJORES PUBLICACIONES</span>
            <h2>Una ayuda para cada parte de tu venta</h2>
            <p>Crea un anuncio completo o trabaja en el texto que quieras mejorar.</p>
          </div>
          <span className="section-note">
            <Icon name="bolt" size={16} /> Todas gratuitas
          </span>
        </div>
        <Link href="/crear-anuncio" className="featured-tool">
          <span className="featured-icon">
            <Icon name="sparkles" size={32} />
          </span>
          <div>
            <span className="featured-label">TODO EN UNA SOLA HERRAMIENTA</span>
            <h3>Crea tu anuncio completo</h3>
            <p>
              Tres títulos, descripciones y textos para WhatsApp, Marketplace e Instagram. Con
              campos por categoría, vista previa y consejos para completar tu anuncio.
            </p>
          </div>
          <span className="featured-cta">
            Crear mi anuncio
            <Icon name="arrow" size={19} />
          </span>
        </Link>
        <div className="tools-grid">
          {tools.slice(1).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
      <section className="category-section" id="categorias">
        <div className="container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CADA PRODUCTO TIENE SU HISTORIA</span>
              <h2>¿Qué quieres vender?</h2>
              <p>Consejos específicos para destacar lo que importa de tu producto.</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
      <section className="section container how-section" id="como-funciona">
        <div className="section-heading centered">
          <span className="eyebrow">ASÍ DE SENCILLO</span>
          <h2>De tu producto a tu publicación</h2>
          <p>Tus datos, bien organizados. Tú eliges qué publicar.</p>
        </div>
        <div className="steps-grid">
          {[
            {
              title: "Cuéntanos qué vendes",
              text: "Elige la categoría y añade los datos que conoces: estado, precio y características de tu producto.",
              icon: "edit",
            },
            {
              title: "Revisa y completa",
              text: "Consulta la vista previa y las recomendaciones de calidad para saber qué información puedes añadir.",
              icon: "sparkles",
            },
            {
              title: "Elige el texto y compártelo",
              text: "Compara tres títulos y copia el texto para WhatsApp, Marketplace o Instagram. Revísalo antes de publicar.",
              icon: "copy",
            },
          ].map((step, i) => (
            <div className="how-step" key={step.title}>
              <div className="step-visual">
                <Icon name={step.icon} size={28} />
                <span>0{i + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="faq-section container">
        <div>
          <span className="eyebrow">POR SI TE LO PREGUNTABAS</span>
          <h2>
            Las cosas claras,
            <br />
            desde el principio.
          </h2>
          <p>Resolvemos algunas dudas antes de que prepares tu próximo anuncio.</p>
          <Link href="/nosotros" className="text-link">
            Conoce Véndelo Mejor
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <Faq items={homeFaq} />
      </section>
      <div className="container">
        <AdPlaceholder placement="home-bottom" />
        <section className="bottom-cta">
          <div>
            <span>MENOS TIEMPO ESCRIBIENDO. MÁS TIEMPO VENDIENDO.</span>
            <h2>Tu próximo buen anuncio empieza aquí.</h2>
          </div>
          <Link className="button button-white" href="/crear-anuncio">
            Crear mi anuncio
            <Icon name="arrow" size={19} />
          </Link>
        </section>
      </div>
    </>
  );
}
