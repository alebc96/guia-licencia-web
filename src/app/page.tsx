import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { loadSenales, loadTemas } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { ExamFacts } from "@/components/home/ExamFacts";
import { TopicGrid } from "@/components/home/TopicGrid";
import { SignalFeature } from "@/components/home/SignalFeature";
import { NormativeTimeline } from "@/components/home/NormativeTimeline";
import type { TopicSummary } from "@/components/temario/TopicCard";

export const metadata = buildMetadata({
  title: SITE.title,
  description: SITE.description,
  path: "/",
});

const FEATURED_SIGNS = ["R-1", "R-2", "R-301", "P-1", "P-18", "S-13"];

export default function HomePage() {
  const temas = loadTemas();
  const senales = loadSenales();

  const topics: TopicSummary[] = temas.map((tema) => ({
    slug: tema.slug,
    title: tema.title,
    order: tema.order,
    readingTime: tema.readingTime,
    block: tema.block,
    examWeight: tema.examWeight,
    description: tema.description,
  }));

  const featured = FEATURED_SIGNS.map((code) => senales.find((senal) => senal.code === code)).filter(
    (senal): senal is (typeof senales)[number] => Boolean(senal),
  );

  return (
    <>
      <Hero />
      <ExamFacts />
      <TopicGrid topics={topics} />
      <SignalFeature senales={featured.length >= 4 ? featured : senales.slice(0, 6)} />

      <section className="tile tile-parchment" aria-labelledby="practice-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Después del teórico</p>
              <h2 id="practice-title" className="t-display-md">
                El práctico no se aprueba de memoria
              </h2>
            </div>
            <Link href="/practico" className="btn-link">
              Ver el examen práctico
            </Link>
          </div>
          <div className="grid grid-3">
            <div className="card-plain">
              <h3 className="t-body-strong">12 maniobras obligatorias</h3>
              <p style={{ marginTop: 8 }}>
                Estacionamiento, incorporación, adelantamiento, glorieta y control del vehículo. Cada una con los fallos
                que eliminan.
              </p>
            </div>
            <div className="card-plain">
              <h3 className="t-body-strong">Checklist antes de arrancar</h3>
              <p style={{ marginTop: 8 }}>
                Asiento, espejos, cinturón y mandos: el orden que espera el examinador y que evita los nervios de salida.
              </p>
            </div>
            <div className="card-plain">
              <h3 className="t-body-strong">Cómo se puntúa</h3>
              <p style={{ marginTop: 8 }}>
                Falta leve, deficiente y eliminatoria: qué se considera peligro y cuándo se suspende la prueba.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NormativeTimeline />

      <section className="tile tile-light">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="t-display-md">Empieza por el principio</h2>
          <p className="t-lead" style={{ marginTop: 16, marginInline: "auto", maxWidth: 560 }}>
            Un tema detrás de otro, con las señales a mano y las fuentes enlazadas. Tu progreso se guarda solo en tu
            navegador.
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: 32 }}>
            <Link href="/temario" className="btn btn-primary">
              Ver el temario
            </Link>
            <Link href="/buscar" className="btn btn-ghost">
              Buscar algo concreto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
