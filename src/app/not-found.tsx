import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="eyebrow">ERROR 404</span>
      <h1>Este anuncio se nos perdió.</h1>
      <p>
        La página que buscas no existe. Puedes volver al inicio y encontrar la herramienta que
        necesitas.
      </p>
      <Link href="/" className="button button-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
