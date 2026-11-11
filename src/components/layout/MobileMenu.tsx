"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

/**
 * Full-screen mobile navigation. Opens from the global bar (visible below
 * 736 px), closes with Escape, locks background scroll and navigates away on
 * route change.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="global-nav__icon global-nav__menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Navegación principal">
          <ul className="mobile-menu__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="mobile-menu__link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/progreso" className="mobile-menu__link">
                Mi progreso
              </Link>
            </li>
            <li>
              <Link href="/buscar" className="mobile-menu__link">
                Buscar
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
}
