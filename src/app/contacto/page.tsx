import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description: "Cómo escribir al responsable de esta guía del permiso B para avisar de errores o hacer sugerencias.",
  path: "/contacto/",
});

export default function ContactoPage() {
  return (
    <LegalPage section="about" title="Contacto" lead="Para avisar de un error, proponer una mejora o cualquier consulta.">
      <article className="stack">
        <h2 className="t-display-md">Escríbeme</h2>
        <p>
          <a href={`mailto:${SITE.owner.email}`} className="btn btn-primary">
            {SITE.owner.email}
          </a>
        </p>
        <p>
          Si es sobre un dato concreto, indica la página (o el código de la señal) y, si puedes, la norma o la fuente
          oficial que lo contradice. Así es mucho más rápido corregirlo.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Lo que no puedo hacer</h2>
        <p>
          Esta guía no es la DGT ni una autoescuela: no puedo gestionar citas de examen, consultar resultados ni resolver
          trámites. Para eso, usa la{" "}
          <a href="https://sede.dgt.gob.es" rel="noopener noreferrer">
            sede electrónica de la DGT
          </a>
          .
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Tus datos</h2>
        <p>
          Tu correo se usa solo para responderte. Más detalles en la <Link href="/privacidad">política de privacidad</Link>.
        </p>
      </article>
    </LegalPage>
  );
}
