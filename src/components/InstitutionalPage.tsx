import Link from "next/link";
import { institutionalPages } from "@/data/institutional";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";

export function InstitutionalPage({ page }: { page: (typeof institutionalPages)[number] }) {
  return (
    <article className="container institutional-page">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <Icon name="chevron" size={13} />
        <span aria-current="page">{page.slug === "nosotros" ? "Nosotros" : page.title}</span>
      </nav>
      <div className="institutional-content">
        <span className="eyebrow">VÉNDELO MEJOR</span>
        <h1>{page.title}</h1>
        <p className="article-intro">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {page.slug === "contacto" && section.title === "Canal de atención" ? (
              site.contactEmail ? (
                <>
                  <p>
                    Para consultas sobre nuestras herramientas, escríbenos a{" "}
                    <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
                  </p>
                  <p>Comparte únicamente la información necesaria para atender tu consulta.</p>
                </>
              ) : (
                <p>
                  El correo de atención estará disponible antes del lanzamiento público. Por ahora,
                  el canal de contacto está pendiente de configuración.
                </p>
              )
            ) : (
              section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </section>
        ))}
        <div className="article-nav">
          <Link href="/crear-anuncio" className="button button-primary">
            Crear mi anuncio
            <Icon name="arrow" size={17} />
          </Link>
          <Link href="/politica-privacidad">Política de privacidad</Link>
          <Link href="/terminos">Términos de uso</Link>
        </div>
      </div>
    </article>
  );
}
