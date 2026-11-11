import { NORMATIVE_CHANGELOG } from "@/lib/constants";
import { formatSpanishDate } from "@/components/layout/Footer";

/** Normative changelog: what changed, when, and what is still not in force. */
export function NormativeTimeline() {
  return (
    <section className="tile tile-light" aria-labelledby="changelog-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Actualizado</p>
            <h2 id="changelog-title" className="t-display-md">
              Qué ha cambiado en la normativa
            </h2>
          </div>
          <span className="t-caption muted">Fecha de corte: 11/11/2026</span>
        </div>

        <ul className="plain-list">
          {NORMATIVE_CHANGELOG.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="plain-list__item">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 className="t-body-strong">{entry.title}</h3>
                <span className={entry.status === "tramitacion" ? "badge badge--pending" : "badge"}>
                  {entry.status === "tramitacion"
                    ? "En tramitación, no vigente"
                    : formatSpanishDate(entry.date.startsWith("20") ? entry.date : "2026-01-01")}
                </span>
              </div>
              <p style={{ marginTop: 4 }}>{entry.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
