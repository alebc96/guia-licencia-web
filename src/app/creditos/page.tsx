import type { Metadata } from "next";
import Link from "next/link";
import { loadSenales } from "@/lib/content";
import { SITE, absoluteUrl, publicUrl } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { formatSpanishDate } from "@/components/layout/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Créditos y aviso legal",
  description:
    "Aviso de guía independiente, licencias de tipografías y pictogramas, fuentes oficiales citadas y política de datos de esta guía del permiso B.",
  path: "/creditos/",
});

const IMAGE_CREDIT_SAMPLE = 8;

export default function CreditosPage() {
  const senales = loadSenales();
  const licenseCount = (test: (license: string) => boolean) =>
    senales.filter((senal) => senal.imageLicense && test(senal.imageLicense)).length;
  const publicDomain = licenseCount((l) => /^(dominio público|cc0)/i.test(l));
  const ccBy = licenseCount((l) => /^CC BY \d/i.test(l));
  const ccBySa = licenseCount((l) => /^CC BY-SA/i.test(l));

  return (
    <>
      <SubNav title="Créditos" links={[{ href: "/recursos", label: "Fuentes" }, { href: "/creditos", label: "Aviso legal" }]} />

      <section className="tile tile-parchment">
        <div className="container-read">
          <h1 className="t-display-lg">
            Aviso legal y créditos
          </h1>
          <p className="t-lead" style={{ marginTop: 16 }}>{SITE.disclaimer}</p>
          <p className="t-caption muted" style={{ marginTop: 12 }}>
            Última actualización: {formatSpanishDate(SITE.updated)}
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container-read stack-lg">
          <article className="stack">
            <h2 className="t-display-md">Qué es esta web</h2>
            <p>
              Esta guía es un material de estudio independiente sobre el teórico del permiso B. No es una publicación
              oficial, no sustituye a la formación de una autoescuela homologada y no garantiza el resultado de ningún
              examen. La normativa cambia: antes de dar por bueno un dato, comprueba la fecha de corte indicada en cada
              página y consulta el BOE o la DGT.
            </p>
          </article>

          <article className="stack">
            <h2 className="t-display-md">Fuentes oficiales</h2>
            <p>
              El contenido se redacta a partir del Reglamento General de Circulación, el Reglamento General de
              Conductores, la Ley de Tráfico y Seguridad Vial y las páginas públicas de la Dirección General de Tráfico.
              No se copia texto, tabla ni imagen de otras webs de autoescuela; se usan solo como referencia de estructura
              y de detección de temas.
            </p>
            <p>
              <Link href="/recursos" className="btn-link">
                Ver la lista completa de fuentes
              </Link>
            </p>
          </article>

          <article className="stack">
            <h2 className="t-display-md">Imágenes y pictogramas</h2>
            <p>
              Las imágenes de las señales proceden de Wikimedia Commons y se usan según la licencia de cada archivo:{" "}
              {publicDomain} están en dominio público o CC0, {ccBy} son CC BY 4.0 y {ccBySa} son CC BY-SA 3.0 o 4.0.
              La página de cada señal muestra el autor, la licencia con enlace a su texto y un enlace al archivo
              original. Las imágenes CC BY-SA conservan su licencia; esta no se extiende al resto del contenido de la web.
              No son el símbolo oficial ni deben usarse como señalización. La ilustración de la portada es propia. La
              tipografía es Inter, publicada bajo SIL Open Font License 1.1 y servida desde este dominio.
            </p>
            <ul className="plain-list">
              {senales.slice(0, IMAGE_CREDIT_SAMPLE).map((senal) => (
                <li key={senal.code} className="plain-list__item">
                  <span className="t-body-strong">
                    {senal.code} · {senal.name}
                  </span>
                  <p className="t-caption muted">{senal.imageCredit}</p>
                </li>
              ))}
            </ul>
            {senales.length > IMAGE_CREDIT_SAMPLE ? (
              <p className="t-caption muted">
                Y {senales.length - IMAGE_CREDIT_SAMPLE} fichas más, cada una con su crédito en la propia página.
              </p>
            ) : null}
          </article>

          <article className="stack">
            <h2 className="t-display-md">Datos y privacidad</h2>
            <p>
              Esta web no tiene cuentas, no usa cookies, no incluye analítica ni servicios externos en tiempo de
              ejecución. El progreso de estudio se guarda únicamente en el almacenamiento local de tu navegador y puedes
              borrarlo desde la página de progreso. No se envía ningún dato a ningún servidor.
            </p>
          </article>

          <article className="stack">
            <h2 className="t-display-md">Titularidad y contacto</h2>
            <p>
              Proyecto personal publicado en abierto. El código y el contenido están en un repositorio
              público y las correcciones se hacen mediante incidencias y propuestas sobre ese repositorio.
            </p>
            <p>
              <a href={absoluteUrl("/")} className="btn-link">
                {absoluteUrl("/")}
              </a>
            </p>
          </article>

          <article className="stack">
            <h2 className="t-display-md">Marca DGT</h2>
            <p>
              «DGT» y las denominaciones oficiales pertenecen a sus titulares. Se citan únicamente como referencia de la
              fuente normativa, no como respaldo ni patrocinio de esta guía.
            </p>
            <div className="sign-figure" style={{ marginTop: 16 }}>
              <img src={publicUrl("/img/hero-road.svg")} alt="Ilustración propia de una carretera" width={320} height={210} />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
