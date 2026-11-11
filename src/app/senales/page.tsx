import { buildMetadata } from "@/lib/seo";
import { loadSenales } from "@/lib/content";
import { SubNav } from "@/components/layout/SubNav";
import { SignalExplorer } from "@/components/senales/SignalExplorer";

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
      />

      <section className="tile tile-parchment">
        <div className="container">
          <h1 className="t-display-lg">
            Cada señal, con lo que de verdad preguntan
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            Significado, acción obligatoria, alcance y el error típico. Sin adornos: la ficha está pensada para
            estudiarla en un minuto y reconocerla en el examen.
          </p>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <h2 className="t-display-md" style={{ marginBottom: 24 }}>
            Cómo se organizan las señales
          </h2>
          <div className="grid grid-3">
            {HIERARCHY.map((item) => (
              <div key={item.title} className="card">
                <h3 className="t-body-strong">{item.title}</h3>
                <p style={{ marginTop: 8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-parchment">
        <div className="container">
          <h2 className="t-display-md" style={{ marginBottom: 24 }}>
            Explorar el catálogo
          </h2>
          <SignalExplorer signals={explorerData} />
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="callout">
            <p className="callout__label">De dónde sale el catálogo</p>
            <p>
              Los códigos, los nombres y las definiciones se extraen del catálogo oficial de señales verticales de
              circulación publicado con el RD 465/2025 (Boletín Oficial del Estado). Cada ficha indica su fuente y el
              crédito de la imagen: los dibujos vienen de Wikimedia Commons y, cuando no hay uno disponible, se usa un
              pictograma esquemático propio que reproduce la forma y los colores, no el símbolo oficial.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
