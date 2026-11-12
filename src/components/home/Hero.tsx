import Link from "next/link";
import { SITE } from "@/lib/constants";
import { ArrowRightIcon } from "@/components/ui/icons";
import { HeroIllustration } from "@/components/home/HeroIllustration";

/** Home hero: eyebrow, headline, tagline, two calls to action and an illustration. */
export function Hero() {
  return (
    <section className="tile tile-parchment" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Permiso B · Normativa de 2026</p>
            <h1 id="hero-title" className="t-hero">
              Todo el teórico.
              <br />
              Bien explicado.
            </h1>
            <p className="t-lead" style={{ marginTop: 24, maxWidth: 560 }}>
              Diecisiete temas y el catálogo de señales, con la norma delante y los errores típicos señalados. Sin
              cuentas, sin anuncios y sin simulacros escondidos.
            </p>
            <div className="row" style={{ marginTop: 32 }}>
              <Link href="/temario/tipos-de-vehiculos" className="btn btn-primary">
                Empezar por el tema 1
              </Link>
              <Link href="/senales" className="btn btn-ghost">
                Explorar señales
              </Link>
            </div>
            <p className="t-fine muted" style={{ marginTop: 20 }}>
              Guía independiente, no oficial. Actualizada el 11 de noviembre de 2026.
            </p>
          </div>

          <div className="hero__media">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroActions() {
  return (
    <div className="row">
      <Link href="/temario" className="btn btn-primary">
        Ver el temario <ArrowRightIcon />
      </Link>
      <span className="t-caption muted">{SITE.name}</span>
    </div>
  );
}
