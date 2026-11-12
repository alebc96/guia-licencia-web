import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadTema, loadTemas } from "@/lib/content";
import { extractHeadings } from "@/lib/markdown";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SubNav } from "@/components/layout/SubNav";
import { Markdown } from "@/components/content/Markdown";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ProgressToggle } from "@/components/progress/ProgressToggle";
import { formatSpanishDate } from "@/components/layout/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return loadTemas().map((tema) => ({ slug: tema.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tema = loadTema(slug);
  if (!tema) {
    return buildMetadata({ title: "Tema no encontrado", description: "", path: "/temario/", noIndex: true });
  }

  return buildMetadata({
    title: `${tema.order}. ${tema.title}`,
    description: tema.description,
    path: `/temario/${tema.slug}/`,
    type: "article",
  });
}

export default async function TemaPage({ params }: PageProps) {
  const { slug } = await params;
  const tema = loadTema(slug);
  if (!tema) notFound();

  const temas = loadTemas();
  const index = temas.findIndex((item) => item.slug === tema.slug);
  const previous = index > 0 ? temas[index - 1] : undefined;
  const next = index >= 0 ? temas[index + 1] : undefined;
  const headings = extractHeadings(tema.body);

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <SubNav
        title="Temario"
        links={[
          { href: "/temario", label: "Los 17 temas" },
          { href: "/senales", label: "Señales" },
        ]}
        action={next ? { href: `/temario/${next.slug}`, label: "Siguiente" } : null}
      />

      <section className="tile tile-parchment">
        <div className="container-read" style={{ maxWidth: 880 }}>
          <h1 className="t-display-lg">
            {tema.title}
          </h1>
          <p className="t-lead" style={{ marginTop: 16 }}>
            {tema.description}
          </p>

          <p className="t-fine muted" style={{ marginTop: 16 }}>
            Tema {String(tema.order).padStart(2, "0")} de {temas.length} · {tema.readingTime} min de lectura
          </p>

          <div className="keyfacts" style={{ marginTop: 32 }}>
            {tema.keyFacts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`} className="keyfact">
                <p className="keyfact__label">{fact.label}</p>
                <p className="keyfact__value">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="container">
          <div className="topic-layout">
            <aside className="topic-layout__aside">
              <TableOfContents headings={headings} />
            </aside>

            <div className="topic-layout__body">
              <Markdown source={tema.body} />

              <div className="callout" style={{ marginTop: 48 }}>
                <p className="callout__label">Errores típicos</p>
                <ul className="plain-list" style={{ marginTop: 8 }}>
                  {tema.mistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ marginTop: 32 }}>
                <h2 className="t-caption-strong">Fuentes de este tema</h2>
                <ul className="plain-list" style={{ marginTop: 8 }}>
                  {tema.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="t-fine muted" style={{ marginTop: 12 }}>
                  Fecha de corte normativo: {formatSpanishDate(SITE.normCutoff)}. {SITE.disclaimer}
                </p>
              </div>

              <div className="row" style={{ marginTop: 32, justifyContent: "space-between" }}>
                <ProgressToggle
                  kind="tema"
                  id={tema.slug}
                  doneLabel="Tema leído"
                  pendingLabel="Marcar tema como leído"
                />
                <Link href="/temario" className="btn-link">
                  Volver al temario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="tile tile-parchment" aria-label="Temas anterior y siguiente">
        <div className="container">
          <div className="grid grid-2">
            <div>
              {previous ? (
                <Link href={`/temario/${previous.slug}`} className="topic-nav">
                  <span className="t-caption muted">Tema {String(previous.order).padStart(2, "0")}</span>
                  <span className="t-body-strong">← {previous.title}</span>
                </Link>
              ) : (
                <span className="t-caption muted">Este es el primer tema.</span>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {next ? (
                <Link href={`/temario/${next.slug}`} className="topic-nav">
                  <span className="t-caption muted">Tema {String(next.order).padStart(2, "0")}</span>
                  <span className="t-body-strong">{next.title} →</span>
                </Link>
              ) : (
                <Link href="/examen" className="topic-nav">
                  <span className="t-caption muted">Siguiente paso</span>
                  <span className="t-body-strong">El examen teórico →</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
