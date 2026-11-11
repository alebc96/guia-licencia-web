import type { Metadata } from "next";
import { loadGlosario } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { GlossarySearch } from "@/components/glosario/GlossarySearch";

export const metadata: Metadata = buildMetadata({
  title: "Glosario",
  description:
    "Términos del permiso B explicados en una frase: masas, tipos de vía, usuarios vulnerables, ADAS, señales y documentación.",
  path: "/glosario/",
});

export default function GlosarioPage() {
  const entries = loadGlosario();

  return (
    <>
      <SubNav
        title="Glosario"
        links={[
          { href: "/glosario", label: "Términos" },
          { href: "/recursos", label: "Fuentes" },
        ]}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <p className="eyebrow">Vocabulario</p>
          <h1 className="t-display-lg" style={{ marginTop: 8 }}>
            El diccionario del teórico
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            {entries.length} términos con la definición corta que necesitas para no fallar por vocabulario. Si un tema usa
            una palabra que no entiendes, está aquí.
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <GlossarySearch
            items={entries.map((entry) => ({
              slug: entry.slug,
              term: entry.term,
              definition: entry.definition,
              related: entry.related,
            }))}
          />
        </div>
      </section>
    </>
  );
}
