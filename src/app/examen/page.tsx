import type { Metadata } from "next";
import Link from "next/link";
import { EXAM_FACTS, NORMATIVE_CHANGELOG, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { formatSpanishDate } from "@/components/layout/Footer";

export const metadata: Metadata = buildMetadata({
  title: "El examen teórico",
  description:
    "Formato del examen teórico del permiso B: 30 preguntas, 30 minutos, máximo 3 fallos y 2 años de validez. Cómo es el día de la prueba y qué se pregunta.",
  path: "/examen/",
});

const FAQ = [
  {
    q: "¿Cuántas preguntas hay y cuánto dura?",
    a: "Treinta preguntas con tres opciones de respuesta y treinta minutos. Cada pregunta vale lo mismo y no resta contestar mal, así que conviene responder todas.",
  },
  {
    q: "¿Cuántos fallos puedo tener?",
    a: "Tres como máximo. Con cuatro fallos el examen queda suspenso, aunque el resto esté perfecto.",
  },
  {
    q: "¿Cuánto tiempo vale el aprobado?",
    a: "Dos años desde que apruebas el teórico. Si no apruebas el práctico en ese plazo, tienes que volver a examinarte del teórico.",
  },
  {
    q: "¿Hay preguntas de vídeo o de percepción del riesgo?",
    a: "A fecha de esta guía no hay ningún cambio aprobado. La DGT lo ha estudiado, pero no está en vigor y no debe estudiarse como si lo estuviera.",
  },
  {
    q: "¿Puedo llevar calculadora o apuntes?",
    a: "No. Se realiza en un aula con ordenador y solo puedes tener a mano el DNI o el documento de identidad con el que te has inscrito.",
  },
  {
    q: "¿Y si suspendo?",
    a: "Puedes volver a presentarte cuando te convoque tu centro. No hay un límite legal de convocatorias para el teórico, pero cada presentación se paga como tasa.",
  },
];

const EXAM_DAY = [
  "Llega con margen: el aula cierra a la hora exacta de la convocatoria.",
  "Lleva el DNI original, no una fotografía ni una copia.",
  "Lee la pregunta completa: muchas respuestas fallan por una negación o un «excepto».",
  "Si dudas, marca una y sigue. Puedes revisar al final si te sobra tiempo.",
  "No cambies respuestas por nervios en el último minuto: cambia solo si encuentras un motivo.",
];

export default function ExamenPage() {
  return (
    <>
      <SubNav
        title="Examen"
        links={[
          { href: "/examen", label: "Teórico" },
          { href: "/practico", label: "Práctico" },
        ]}
        action={{ href: "/temario", label: "Estudiar el temario" }}
      />

      <section className="tile tile-parchment">
        <div className="container">
          <h1 className="t-display-lg">
            Treinta preguntas. Tres fallos.
          </h1>
          <p className="t-lead" style={{ marginTop: 16, maxWidth: 680 }}>
            El examen teórico del permiso B es una prueba tipo test de 30 preguntas con tres opciones. No hay
            penalización por responder mal, así que se contesta todo.
          </p>

          <div className="grid grid-4" style={{ marginTop: 32 }}>
            {EXAM_FACTS.map((fact) => (
              <div key={fact.label} className="card">
                <p className="t-caption muted">{fact.label}</p>
                <p className="t-display-lg">{fact.value}</p>
                <p className="t-caption">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <h2 className="t-display-md">El día del examen</h2>
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <ol className="plain-list">
              {EXAM_DAY.map((step) => (
                <li key={step} className="plain-list__item">
                  {step}
                </li>
              ))}
            </ol>
            <div className="card">
              <h3 className="t-body-strong">Qué preguntan de verdad</h3>
              <p style={{ marginTop: 8 }}>
                La mayoría de preguntas caen en cinco bloques: prioridad de paso, maniobras, velocidad, señales y
                usuarios vulnerables. Los temas 3, 4, 5 y 8 concentran la mayor parte del examen.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/temario" className="btn-link">
                  Ver el temario ordenado por peso
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tile tile-parchment">
        <div className="container">
          <h2 className="t-display-md">Preguntas frecuentes</h2>
          <div className="stack" style={{ marginTop: 24 }}>
            {FAQ.map((item) => (
              <details key={item.q} className="card">
                <summary className="t-body-strong" style={{ cursor: "pointer" }}>
                  {item.q}
                </summary>
                <p style={{ marginTop: 12 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <h2 className="t-display-md">Normativa que afecta al examen</h2>
          <ul className="plain-list" style={{ marginTop: 16 }}>
            {NORMATIVE_CHANGELOG.map((entry) => (
              <li key={`${entry.date}-${entry.title}`} className="plain-list__item">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="t-body-strong">{entry.title}</span>
                  <span className="badge">
                    {entry.status === "tramitacion" ? "No vigente" : formatSpanishDate(entry.date)}
                  </span>
                </div>
                <p style={{ marginTop: 4 }}>{entry.description}</p>
              </li>
            ))}
          </ul>
          <p className="t-fine muted" style={{ marginTop: 24 }}>
            {SITE.disclaimer} Fecha de corte normativo: {formatSpanishDate(SITE.normCutoff)}.
          </p>
        </div>
      </section>
    </>
  );
}
