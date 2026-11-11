import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSenal, loadSenales } from "@/lib/content";
import { relatedSenales } from "@/lib/catalog";
import { FAMILY_LABELS, SHAPE_LABELS, SUBFAMILY_LABELS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SignalImage } from "@/components/senales/SignalImage";
import { SignalCard, toCardData } from "@/components/senales/SignalCard";
import { ProgressToggle } from "@/components/progress/ProgressToggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return loadSenales().map((senal) => ({ slug: senal.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const senal = loadSenal(slug);
  if (!senal) return buildMetadata({ title: "Señal no encontrada", description: "", path: "/senales/", noIndex: true });

  return buildMetadata({
    title: `${senal.code} ${senal.name}`,
    description: `${senal.meaning} Qué hacer: ${senal.action}`,
    path: `/senales/${senal.code.toLowerCase()}/`,
  });
}

export default async function SenalPage({ params }: PageProps) {
  const { slug } = await params;
  const senal = loadSenal(slug);
  if (!senal) notFound();

  const all = loadSenales();
  const related = relatedSenales(senal, all, 4);
  const familyLabel = FAMILY_LABELS[senal.family as keyof typeof FAMILY_LABELS] ?? senal.family;

  return (
    <>
      <div className="sub-nav">
        <div className="sub-nav__inner">
          <Link href="/senales" className="sub-nav__title">
            ← Señales
          </Link>
          <span className="t-caption muted">{familyLabel}</span>
        </div>
      </div>

      <section className="tile tile-parchment">
        <div className="container">
          <div className="signal-detail">
            <div className="sign-figure">
              <SignalImage senal={senal} size={220} />
            </div>

            <div className="stack">
              <p className="t-fine muted">
                {senal.code} · {familyLabel}
              </p>
              <h1 className="t-display-lg">{senal.name}</h1>
              <p className="t-lead">{senal.meaning}</p>

              {senal.action || senal.where ? (
                <div className="keyfacts">
                  {senal.action ? (
                    <div className="keyfact">
                      <p className="keyfact__label">Qué haces</p>
                      <p className="keyfact__value" style={{ fontSize: 17 }}>
                        {senal.action}
                      </p>
                    </div>
                  ) : null}
                  {senal.where ? (
                    <div className="keyfact">
                      <p className="keyfact__label">Dónde aparece</p>
                      <p className="keyfact__value" style={{ fontSize: 17 }}>
                        {senal.where}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {senal.mistake ? (
                <div className="callout">
                  <p className="callout__label">En el examen</p>
                  <p>{senal.mistake}</p>
                </div>
              ) : null}

              <div className="row">
                <ProgressToggle kind="senal" id={senal.code} doneLabel="Señal repasada" pendingLabel="Marcar como repasada" />
                <Link href="/senales" className="btn btn-ghost">
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h2 className="t-caption-strong">Ficha técnica</h2>
              <dl className="meta-list">
                <dt>Familia</dt>
                <dd>{familyLabel}</dd>
                <dt>Tipo</dt>
                <dd>{SUBFAMILY_LABELS[senal.subfamily] ?? senal.subfamily}</dd>
                <dt>Forma</dt>
                <dd>{SHAPE_LABELS[senal.shape] ?? senal.shape}</dd>
                <dt>Colores</dt>
                <dd>{senal.colors.join(", ")}</dd>
                <dt>Ficha</dt>
                <dd>{senal.tier === "A" ? "Curada (definición, acción y error típico)" : "Definición oficial del catálogo"}</dd>
                <dt>Fuente oficial</dt>
                <dd>{senal.officialSource}</dd>
                <dt>Crédito de imagen</dt>
                <dd>{senal.imageCredit}</dd>
                <dt>Actualizada</dt>
                <dd>{senal.updated}</dd>
              </dl>
            </div>

            <div className="card">
              <h2 className="t-caption-strong">Cómo estudiarla</h2>
              <ol className="plain-list" style={{ marginTop: 8 }}>
                <li>Lee el significado y di en voz alta qué te obliga a hacer.</li>
                <li>Identifica la forma y el color: son la primera pista en el examen.</li>
                <li>Repasa la ficha al día siguiente y a la semana.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="tile tile-parchment">
          <div className="container">
            <div className="section-head">
              <h2 className="t-display-md">Señales relacionadas</h2>
              <Link href="/senales" className="btn-link">
                Ver todo el catálogo
              </Link>
            </div>
            <div className="sign-grid">
              {related.map((item) => (
                <SignalCard key={item.code} senal={toCardData(item)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
