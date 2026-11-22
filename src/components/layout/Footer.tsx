import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, SITE } from "@/lib/constants";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";

/** Parchment footer: navigation columns plus the legal notice. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="footer__title">{column.title}</h2>
              <div className="footer__links">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <div className="footer__legal">
          <span>
            © {new Date(SITE.updated).getFullYear()} {SITE.name}
          </span>
          <span>{SITE.disclaimer}</span>
          <span>Actualizado el {formatSpanishDate(SITE.updated)}</span>
          <nav aria-label="Información legal" className="footer__legal-links">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <ConsentSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function formatSpanishDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    date,
  );
}
