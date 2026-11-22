import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, OwnerDetails } from "@/components/legal/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Aviso legal",
  description: "Titular de la guía, condiciones de uso, responsabilidad, propiedad intelectual y legislación aplicable.",
  path: "/aviso-legal/",
});

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" lead="Quién publica esta guía y en qué condiciones puedes usarla.">
      <article className="stack">
        <h2 className="t-display-md">Titular</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
          electrónico (LSSI-CE), estos son los datos del titular de {SITE.name}:
        </p>
        <OwnerDetails />
      </article>

      <article className="stack">
        <h2 className="t-display-md">Objeto y condiciones de uso</h2>
        <p>
          {SITE.name} es un material de estudio gratuito sobre el examen teórico del permiso de conducir B en España.
          Usar la web implica aceptar este aviso. El acceso es libre y no requiere registro.
        </p>
        <p>
          {SITE.disclaimer} Tampoco sustituye a la formación de una autoescuela ni garantiza el resultado de ningún
          examen.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Responsabilidad</h2>
        <p>
          El contenido se redacta a partir de la normativa publicada en el BOE y de la información pública de la DGT, y se
          revisa con cuidado. Aun así, la normativa cambia y puede haber errores u omisiones. Antes de dar por bueno un
          dato, comprueba la fecha de actualización y consulta las fuentes oficiales enlazadas en cada tema. El titular no
          responde de los daños que pudieran derivarse del uso de la información de esta web.
        </p>
        <p>
          Los enlaces a páginas de terceros se ofrecen como referencia. El titular no controla su contenido ni responde de
          él. Si detectas un error o un enlace roto, escribe al correo de contacto.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Propiedad intelectual</h2>
        <p>
          Los textos, la ilustración de la portada y el diseño de la web son obra del titular, salvo que se indique otra
          cosa. Las imágenes de señales proceden de Wikimedia Commons y conservan la licencia de cada archivo; las
          tipografías y los iconos tienen sus propias licencias. Todo ello se detalla en{" "}
          <Link href="/creditos">Créditos</Link>.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Marcas</h2>
        <p>
          «DGT», «Dirección General de Tráfico» y las demás denominaciones oficiales pertenecen a sus titulares. Se citan
          únicamente como referencia de la fuente normativa, no como respaldo ni patrocinio de esta guía.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Datos personales y cookies</h2>
        <p>
          Cómo se tratan los datos y qué cookies se usan se explica en la{" "}
          <Link href="/privacidad">política de privacidad</Link> y en la{" "}
          <Link href="/cookies">política de cookies</Link>.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Legislación aplicable</h2>
        <p>
          Este aviso se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y
          tribunales que correspondan conforme a la ley; si actúas como consumidor, los de tu domicilio.
        </p>
      </article>
    </LegalPage>
  );
}
