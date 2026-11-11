import { buildMetadata } from "@/lib/seo";
import { loadSenales } from "@/lib/content";
import { SubNav } from "@/components/layout/SubNav";
import { SignalExplorer } from "@/components/senales/SignalExplorer";
import { FAMILY_LABELS } from "@/lib/constants";
import { countByFamily } from "@/lib/catalog";

export const metadata = buildMetadata({
  title: "Catálogo de señales",
  description:
    "Qué significa cada señal de tráfico, qué hay que hacer al verla y el error típico de examen. Catálogo en construcción con fichas verificadas una a una.",
  path: "/senales/",
});

const HIERARCHY = [
  {
    title: "1. Agentes",
    body: "Sus indicaciones prevalecen sobre cualquier señal, marca o semáforo. Si un agente te indica pasar con el semáforo en rojo, obedeces al agente.",
  },
  {
    title: "2. Señalización circunstancial",
    body: "Señales y balizamiento que modifican temporalmente la vía: obras, desvíos y pasos alternativos.",
  },
  {
    title: "3. Semáforos",
    body: "Mandos que regulan el paso. Un semáforo en verde no te exime de ceder el paso a quien ya está cruzando.",
  },
  {
    title: "4. Señales verticales",
    body: "Peligro, reglamentación e indicación. La reglamentación es obligatoria; las de indicación orientan e informan.",
  },
  {
    title: "5. Marcas viales",
    body: "Pintadas sobre el firme. Ceden ante la señal vertical, pero delimitan carriles, prohibiciones y zonas de estacionamiento.",
  },
];

export default function SenalesPage() {
  const senales = loadSenales();
  const counts = countByFamily(senales);

  const explorerData = senales.map((senal) => ({
    code: senal.code,
    name: senal.name,
    family: senal.family,
    subfamily: senal.subfamily,
    meaning: senal.meaning,
    image: senal.image,
    imageAlt: senal.imageAlt,
    tier: senal.tier,
    isNew: senal.isNew,
  }));

  return (
    <>
      <SubNav
        title="Señales"
        links={[
          { href: "/senales", label: "Catálogo" },
          { href: "/recursos", label: "Fuentes oficiales" },
        ]}
        action={{ href: "/temario/senales-de-circulacion", label: "Tema 8" }}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <p className="eyebrow">Catálogo</p>
          <h1 className="t-display-lg" style={{ marginTop: 8 }}>
            Cada señal, con lo que de verdad preguntan
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            Significado, acción obligatoria, alcance y el error típico. Sin adornos: la ficha está pensada para
            estudiarla en un minuto y reconocerla en el examen.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <span className="badge">{senales.length} fichas publicadas</span>
            <span className="badge badge--pending">Catálogo completo en construcción</span>
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="section-head">
            <h2 className="t-display-md">Cómo se organizan las señales</h2>
            <span className="t-caption muted">Orden de prioridad cuando se contradicen</span>
          </div>
          <div className="grid grid-3">
            {HIERARCHY.map((item) => (
              <div key={item.title} className="card">
                <h3 className="t-body-strong">{item.title}</h3>
                <p style={{ marginTop: 8 }}>{item.body}</p>
              </div>
            ))}
          </div>
          {Object.keys(counts).length > 0 ? (
            <p className="t-caption muted" style={{ marginTop: 24 }}>
              Fichas por familia:{" "}
              {Object.entries(counts)
                .map(([family, total]) => `${FAMILY_LABELS[family as keyof typeof FAMILY_LABELS]} (${total})`)
                .join(" · ")}
              .
            </p>
          ) : null}
        </div>
      </section>

      <section className="tile tile-parchment">
        <div className="container">
          <div className="section-head">
            <h2 className="t-display-md">Explorar el catálogo</h2>
            <span className="t-caption muted">Se filtra en tu navegador, sin recargar</span>
          </div>
          <SignalExplorer signals={explorerData} />
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="callout">
            <p className="callout__label">Estado del catálogo</p>
            <p>
              La web va publicando fichas a medida que cada señal se contrasta con el catálogo oficial. Las fichas
              marcadas como <strong>pendientes de verificar</strong> están redactadas desde la norma pero su nombre aún
              no se ha cotejado uno a uno con el anexo del BOE. El detalle del trabajo pendiente está en{" "}
              <code>docs/cobertura-senales.md</code> del repositorio.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
