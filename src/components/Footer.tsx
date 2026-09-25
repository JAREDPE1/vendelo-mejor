import Link from "next/link";
import { Icon } from "@/components/Icon";
import { tools } from "@/data/tools";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand-symbol">
              <Icon name="tag" size={21} />
            </span>
            <span>Véndelo Mejor</span>
          </Link>
          <p>Publica mejor. Vende más fácil.</p>
          <p>Herramientas sencillas para darle a lo que vendes una mejor presentación.</p>
          <span className="footer-free">
            <Icon name="check" size={15} /> Gratis y sin registro
          </span>
        </div>
        <div>
          <h2>Herramientas</h2>
          <ul>
            {tools.slice(0, 4).map((tool) => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`}>{tool.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Para tus ventas</h2>
          <ul>
            {tools.slice(4).map((tool) => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`}>{tool.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/#categorias">Guías por categoría</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Véndelo Mejor</h2>
          <ul>
            <li>
              <Link href="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
            <li>
              <Link href="/politica-privacidad">Política de privacidad</Link>
            </li>
            <li>
              <Link href="/terminos">Términos de uso</Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Véndelo Mejor</span>
        <span>Hecho para quienes tienen algo bueno que vender.</span>
      </div>
    </footer>
  );
}
