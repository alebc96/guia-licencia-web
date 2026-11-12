import Link from "next/link";
import { EXAM_FACTS } from "@/lib/constants";

/** The exam in 30 seconds: four utility cards. */
export function ExamFacts() {
  return (
    <section className="tile tile-light" aria-labelledby="exam-facts-title">
      <div className="container">
        <div className="section-head">
          <h2 id="exam-facts-title" className="t-display-md">
            El examen en 30 segundos
          </h2>
          <Link href="/examen" className="btn-link">
            Cómo es la prueba
          </Link>
        </div>

        <div className="grid grid-4">
          {EXAM_FACTS.map((fact) => (
            <div key={fact.label} className="card">
              <p className="t-caption muted">{fact.label}</p>
              <p className="t-display-lg" style={{ marginTop: 4 }}>
                {fact.value}
              </p>
              <p className="t-caption" style={{ marginTop: 8 }}>
                {fact.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
