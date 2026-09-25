"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Véndelo Mejor, inicio"
          onClick={() => setOpen(false)}
        >
          <span className="brand-symbol">
            <Icon name="tag" size={21} />
          </span>
          <span>
            Véndelo<span className="text-emerald-700"> Mejor</span>
            <small>Publica mejor. Vende más fácil.</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="/#herramientas">Herramientas</Link>
          <Link href="/#categorias">Qué quieres vender</Link>
          <Link href="/nosotros" aria-current={pathname === "/nosotros" ? "page" : undefined}>
            Nosotros
          </Link>
        </nav>
        <Link href="/crear-anuncio" className="button button-primary header-cta">
          Crear mi anuncio
          <Icon name="arrow" size={17} />
        </Link>
        <button
          className="mobile-menu"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil">
          {[
            ["/#herramientas", "Herramientas"],
            ["/#categorias", "Qué quieres vender"],
            ["/nosotros", "Nosotros"],
            ["/crear-anuncio", "Crear mi anuncio"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <Icon name="chevron" size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
