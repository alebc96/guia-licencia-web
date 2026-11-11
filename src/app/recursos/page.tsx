import type { Metadata } from "next";
import { loadRecursos } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import type { Recurso } from "@/lib/schemas";

export const metadata: Metadata = buildMetadata({
  title: "Recursos y fuentes",
  description:
    "Fuentes oficiales del BOE y la DGT, materiales didácticos y pruebas externas para preparar el teórico del permiso B.",
  path: "/recursos/",
});

const TYPE_LABELS: Record<Recurso["type"], string> = {
  oficial: "Oficial",
  legal: "Texto legal",
  didactico: "Didáctico",
  video: "Vídeo",
  test: "Pruebas externas",
};

const TYPE_ORDER: Recurso["type"][] = ["legal", "oficial", "didactico", "video", "test"];

export default function RecursosPage() {
  const recursos = loadRecursos();
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: recursos.filter((recurso) => recurso.type === type),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <SubNav
        title="Recursos"
        links={[
          { href: "/recursos", label: "Fuentes" },
          { href: "/glosario", label: "Glosario" },
          { href: "/creditos", label: "Créditos" },
        ]}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <p className="eyebrow">Fuentes</p>
          <h1 className="t-display-lg" style={{ marginTop: 8 }}>
            De dónde sale cada dato
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            Esta guía se redacta desde los textos legales y las páginas oficiales. Los materiales externos sirven para
            ampliar, nunca como autoridad.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <span className="badge">{recursos.length} recursos enlazados</span>
            <span className="badge">Sin enlaces de pago presentados como gratuitos</span>
          </div>
        </div>
      </section>

      {grouped.map((group) => (
        <section key={group.type} className="tile tile-light">
          <div className="container">
            <div className="section-head">
              <h2 className="t-display-md">{group.label}</h2>
              <span className="t-caption muted">{group.items.length} enlaces</span>
            </div>
            <ul className="plain-list">
              {group.items.map((recurso) => (
                <li key={recurso.url} className="resource-item">
                  <a href={recurso.url} target="_blank" rel="noopener noreferrer" className="t-body-strong">
                    {recurso.title} ↗
                  </a>
                  <p>{recurso.description}</p>
                  {recurso.topics.length > 0 ? (
                    <p className="t-caption muted">Temas: {recurso.topics.join(" · ")}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="tile tile-parchment">
        <div className="container">
          <div className="callout">
            <p className="callout__label">Cómo usamos las fuentes</p>
            <p>
              Cada tema enlaza su norma y su página oficial. No se copia texto, tabla ni imagen de otras webs de
              autoescuela: se usan como referencia de estructura y se redacta de nuevo desde la norma. Si encuentras una
              discrepancia, la corrección se anota en <code>docs/fuentes.md</code> del repositorio.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
