import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { SearchIcon } from "@/components/ui/icons";
import { ReadingTools } from "@/components/reading/ReadingTools";

/** Barra global de cristal: marca, secciones, búsqueda, ajustes de lectura y progreso. */
export function GlobalNav() {
  return (
    <header className="global-nav">
      <div className="global-nav__inner">
        <Link href="/" className="global-nav__brand" aria-label={`${SITE.name}, inicio`}>
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6.5 15 17h-6z" fill="currentColor" />
          </svg>
          {SITE.name}
        </Link>

        <nav aria-label="Navegación principal" className="global-nav__links">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} nested className="global-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="global-nav__actions">
          <Link href="/buscar" className="global-nav__icon" aria-label="Buscar en la guía">
            <SearchIcon />
          </Link>
          <ReadingTools />
          <Link href="/progreso" className="global-nav__icon" aria-label="Ver mi progreso">
            <ProgressRing />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
