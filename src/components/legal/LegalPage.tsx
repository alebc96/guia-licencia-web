import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";
import { SubNav } from "@/components/layout/SubNav";
import { formatSpanishDate } from "@/components/layout/Footer";

const LEGAL_NAV = {
  title: "Legal",
  links: [
    { href: "/aviso-legal", label: "Aviso legal" },
    { href: "/privacidad", label: "Privacidad" },
    { href: "/cookies", label: "Cookies" },
  ],
};

const ABOUT_NAV = {
  title: SITE.name,
  links: [
    { href: "/acerca", label: "Acerca de" },
    { href: "/contacto", label: "Contacto" },
  ],
};

interface LegalPageProps {
  title: string;
  lead: string;
  children: ReactNode;
  /** Which section bar to show: the legal texts or the about/contact pair. */
  section?: "legal" | "about";
}

/** Shared frame for the legal, privacy, cookie, about and contact pages. */
export function LegalPage({ title, lead, children, section = "legal" }: LegalPageProps) {
  const nav = section === "legal" ? LEGAL_NAV : ABOUT_NAV;

  return (
    <>
      <SubNav title={nav.title} links={nav.links} />

      <section className="tile tile-parchment">
        <div className="container-read">
          <h1 className="t-display-lg">{title}</h1>
          <p className="t-lead" style={{ marginTop: 16 }}>
            {lead}
          </p>
          <p className="t-caption muted" style={{ marginTop: 12 }}>
            Última actualización: {formatSpanishDate(SITE.legalUpdated)}
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container-read stack-lg">{children}</div>
      </section>
    </>
  );
}

/** Owner identity block, repeated where the law asks for it. */
export function OwnerDetails() {
  return (
    <ul className="plain-list">
      <li className="plain-list__item">
        <span className="t-body-strong">Titular:</span> {SITE.owner.name}
      </li>
      <li className="plain-list__item">
        <span className="t-body-strong">Correo de contacto:</span>{" "}
        <a href={`mailto:${SITE.owner.email}`}>{SITE.owner.email}</a>
      </li>
      <li className="plain-list__item">
        <span className="t-body-strong">Sitio web:</span> {SITE.url.replace(/^https?:\/\//, "")}
      </li>
    </ul>
  );
}
