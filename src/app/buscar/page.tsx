import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { SearchBox } from "@/components/search/SearchBox";

export const metadata: Metadata = buildMetadata({
  title: "Buscar",
  description: "Búsqueda de texto completo en los 17 temas, las señales y el glosario de la guía del permiso B.",
  path: "/buscar/",
});

export default function BuscarPage() {
  return (
    <>
      <SubNav title="Buscar" links={[{ href: "/temario", label: "Temario" }, { href: "/senales", label: "Señales" }]} />

      <section className="tile tile-parchment">
        <div className="container">
          <h1 className="t-display-lg">
            Encuentra el concepto exacto
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 640 }}>
            Índice completo del contenido publicado, sin backend y sin enviar tu búsqueda a ningún servicio.
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container-read">
          <SearchBox />
        </div>
      </section>
    </>
  );
}
