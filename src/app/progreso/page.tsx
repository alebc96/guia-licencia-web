import type { Metadata } from "next";
import { loadTemas } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { ProgressSummary } from "@/components/progress/ProgressSummary";

export const metadata: Metadata = buildMetadata({
  title: "Mi progreso",
  description:
    "Tu avance en los 17 temas del permiso B. Se guarda en tu navegador: sin cuentas, sin cookies y sin servidor.",
  path: "/progreso/",
});

export default function ProgresoPage() {
  const temas = loadTemas().map((tema) => ({ slug: tema.slug, title: tema.title, order: tema.order }));

  return (
    <>
      <SubNav
        title="Mi progreso"
        links={[
          { href: "/temario", label: "Temario" },
          { href: "/senales", label: "Señales" },
        ]}
        action={{ href: "/temario", label: "Seguir estudiando" }}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <h1 className="t-display-lg">
            Nada de cuentas: tu progreso vive en este navegador
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 640 }}>
            Marca los temas cuando los termines y las señales cuando las repases. Si cambias de dispositivo, empiezas de
            cero: no hay datos tuyos en ningún servidor.
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container-read">
          <ProgressSummary temas={temas} />
        </div>
      </section>
    </>
  );
}
