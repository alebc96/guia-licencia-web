import Link from "next/link";
import type { Senal } from "@/lib/schemas";
import { SignalImage } from "@/components/senales/SignalImage";

/** Dark tile that introduces the sign catalogue. */
export function SignalFeature({ senales }: { senales: Senal[] }) {
  if (senales.length === 0) return null;

  return (
    <section className="tile tile-dark" aria-labelledby="signals-title">
      <div className="container">
        <div className="section-head">
          <h2 id="signals-title" className="t-display-lg">
            Cada señal. Qué significa y qué hacer.
          </h2>
          <Link href="/senales" className="btn btn-primary">
            Abrir el catálogo
          </Link>
        </div>

        <p className="t-lead-airy" style={{ maxWidth: 620, color: "var(--color-body-muted)" }}>
          Peligro, reglamentación, indicación y marcas viales: la ficha de cada señal con su significado, la acción que
          exige y el error que se comete en el examen.
        </p>

        <div className="sign-strip">
          {senales.map((senal) => (
            <Link key={senal.code} href={`/senales/${senal.code.toLowerCase()}`} className="sign-strip__item">
              <SignalImage senal={senal} size={96} />
              <span className="sign-strip__code">{senal.code}</span>
              <span className="sign-strip__name">{senal.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
