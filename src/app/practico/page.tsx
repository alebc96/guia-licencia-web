import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";

export const metadata: Metadata = buildMetadata({
  title: "El examen práctico",
  description:
    "Cómo es el examen práctico del permiso B: maniobras, control del vehículo, faltas leves, deficientes y eliminatorias, y checklist antes de arrancar.",
  path: "/practico/",
});

const MANIOBRAS = [
  { title: "Comprobaciones previas", body: "Asiento, espejos, cinturón y mandos. El examinador observa si miras antes de moverte." },
  { title: "Incorporación a la circulación", body: "Señalizar, mirar espejos y ángulo muerto, y adaptarte a la velocidad del tráfico." },
  { title: "Circulación en vía urbana", body: "Carril correcto, distancia de seguridad, atención a peatones y ciclistas." },
  { title: "Glorieta", body: "Entrar cediendo el paso a quien ya circula, mantener el carril y salir desde el exterior." },
  { title: "Cambio de carril", body: "Espejo, señal, ángulo muerto y ejecución progresiva sin obligar a nadie a frenar." },
  { title: "Adelantamiento", body: "Solo con visibilidad y espacio; 1,5 m a ciclistas y vuelta a la derecha al terminar." },
  { title: "Intersecciones", body: "Prioridad correcta, observación y elección del carril antes de llegar." },
  { title: "Estacionamiento en línea", body: "Maniobra de marcha atrás sin tocar bordillo ni obstaculizar el tráfico." },
  { title: "Estacionamiento en batería", body: "Entrada y salida con control del ángulo muerto y de los vehículos próximos." },
  { title: "Marcha atrás", body: "Trayectoria recta y controlada, mirando por los espejos y girando la cabeza." },
  { title: "Incorporación a autovía", body: "Acelerar en el carril de aceleración hasta igualar la velocidad del tráfico." },
  { title: "Detención y arranque en pendiente", body: "Control del embrague y del freno para no retroceder." },
];

const FALTAS = [
  { level: "Leve", effect: "No elimina por sí sola, pero penaliza la valoración final.", examples: "No señalizar con suficiente antelación, circular demasiado despacio sin motivo." },
  { level: "Deficiente", effect: "Suma faltas y puede llevar al suspenso si se acumulan.", examples: "No comprobar el ángulo muerto, mala elección de carril, frenadas bruscas." },
  { level: "Eliminatoria", effect: "Suspende la prueba en el momento.", examples: "No respetar un STOP o un semáforo, poner en peligro a un peatón, subir al bordillo con riesgo." },
];

export default function PracticoPage() {
  return (
    <>
      <SubNav
        title="Práctico"
        links={[
          { href: "/practico", label: "Maniobras" },
          { href: "/examen", label: "Teórico" },
        ]}
        action={{ href: "/senales", label: "Repasar señales" }}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <p className="eyebrow">Prueba de circulación</p>
          <h1 className="t-display-lg" style={{ marginTop: 8 }}>
            El práctico se aprueba conduciendo con criterio
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            El examinador no busca perfección: busca que circules con seguridad, respetes la prioridad y resuelvas las
            maniobras sin poner a nadie en peligro.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <span className="badge">Duración aproximada: 25 minutos</span>
            <span className="badge">Incluye una maniobra obligatoria</span>
            <span className="badge">Puede empezar en vía urbana o interurbana</span>
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="section-head">
            <h2 className="t-display-md">Las 12 maniobras que se evalúan</h2>
            <Link href="/senales" className="btn-link">
              Repasar la señalización
            </Link>
          </div>
          <div className="grid grid-3">
            {MANIOBRAS.map((maniobra, index) => (
              <div key={maniobra.title} className="card">
                <p className="t-caption muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="t-body-strong">{maniobra.title}</h3>
                <p style={{ marginTop: 8 }}>{maniobra.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-parchment">
        <div className="container">
          <h2 className="t-display-md">Cómo se puntúa</h2>
          <table className="prose" style={{ marginTop: 24 }}>
            <caption className="t-caption muted" style={{ textAlign: "left", paddingBottom: 8 }}>
              Tipos de falta en el examen práctico del permiso B
            </caption>
            <thead>
              <tr>
                <th scope="col">Falta</th>
                <th scope="col">Qué implica</th>
                <th scope="col">Ejemplos</th>
              </tr>
            </thead>
            <tbody>
              {FALTAS.map((falta) => (
                <tr key={falta.level}>
                  <th scope="row">{falta.level}</th>
                  <td>{falta.effect}</td>
                  <td>{falta.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="callout">
            <p className="callout__label">Antes de arrancar</p>
            <ul className="plain-list" style={{ marginTop: 8 }}>
              <li>Comprueba que el asiento te permite llegar a los pedales con la rodilla ligeramente flexionada.</li>
              <li>Ajusta los tres espejos con el vehículo parado, no en marcha.</li>
              <li>Ponte el cinturón antes de arrancar y comprueba que los ocupantes lo llevan.</li>
              <li>Mira antes de moverte: el examinador ve la primera impresión.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
