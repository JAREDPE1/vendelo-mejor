import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Véndelo Mejor — Herramientas gratis para vender",
    template: "%s | Véndelo Mejor",
  },
  description:
    "Crea anuncios, títulos y descripciones para vender tus productos. Herramientas gratuitas, fáciles de usar y sin registro.",
  applicationName: site.name,
  robots: { index: site.isPublic, follow: site.isPublic },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
