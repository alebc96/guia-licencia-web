import type { Metadata } from "next";
import { loadTemas } from "@/lib/content";
import { BLOCK_LABELS, EXAM_WEIGHT_LABELS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { TopicCard, type TopicSummary } from "@/components/temario/TopicCard";

export const metadata: Metadata = buildMetadata({
  title: "Temario del permiso B",
  description:
    "Los 17 temas del teórico del permiso B, en orden de estudio, con el peso de cada uno en el examen y su tiempo de lectura.",
  path: "/temario/",
});

export default function TemarioPage() {
  const temas = loadTemas();

  const blocks = Array.from(new Set(temas.map((tema) => tema.block)));
  const totalMinutes = temas.reduce((total, tema) => total + tema.readingTime, 0);

  return (
    <>
      <SubNav
        title="Temario"
        links={[
          { href: "/temario", label: "Los 17 temas" },
          { href: "/senales", label: "Señales" },
          { href: "/examen", label: "El examen" },
        ]}
        action={{ href: temas[0] ? `/temario/${temas[0].slug}` : "/temario", label: "Empezar" }}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <p className="eyebrow">Ruta de estudio</p>
          <h1 className="t-display-lg" style={{ marginTop: 8 }}>
            Diecisiete temas, en el orden que funciona
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            Primero el vocabulario y las normas de circulación, después los usuarios vulnerables y el vehículo. Cada tema
            se lee en {Math.round(totalMinutes / Math.max(temas.length, 1))} minutos de media y termina con las fuentes
            oficiales.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            {blocks.map((block) => (
              <span key={block} className="badge">
                {BLOCK_LABELS[block as keyof typeof BLOCK_LABELS] ?? block} ·{" "}
                {temas.filter((tema) => tema.block === block).length}
              </span>
            ))}
            <span className="badge">{totalMinutes} min de lectura</span>
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="grid grid-3">
            {temas.map((tema) => (
              <TopicCard
                key={tema.slug}
                topic={
                  {
                    slug: tema.slug,
                    title: tema.title,
                    order: tema.order,
                    readingTime: tema.readingTime,
                    block: tema.block,
                    examWeight: tema.examWeight,
                    description: tema.description,
                  } satisfies TopicSummary
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-parchment">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h2 className="t-display-md">Por qué este orden</h2>
              <p style={{ marginTop: 12 }}>
                Los cuatro primeros temas construyen el vocabulario y las reglas de circulación. Sin ellos, los temas de
                prioridad y maniobras se estudian de memoria y se olvidan. Los cinco siguientes son normativa que se
                pregunta mucho y se falla por matices.
              </p>
            </div>
            <div className="card">
              <h2 className="t-display-md">Cómo usar el temario</h2>
              <p style={{ marginTop: 12 }}>
                Un tema por sesión, con la sección «Lo esencial» el día antes del examen. Marca cada tema como leído: el
                progreso se guarda en tu navegador y aparece en la barra superior con el porcentaje del{" "}
                {EXAM_WEIGHT_LABELS["muy-alta"]} al {EXAM_WEIGHT_LABELS.baja} de peso.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
