"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useProgress } from "./ProgressProvider";

export interface ContinueTopic {
  slug: string;
  order: number;
}

interface ContinueTarget {
  href: string;
  label: string;
}

/**
 * Where "continue" should take the reader: the last topic they opened if it is
 * still unread, else the first unread topic, else the syllabus once all are
 * done. With no history it starts at topic 1, which is also what the static
 * HTML shows before hydration.
 */
export function continueTarget(
  temas: ContinueTopic[],
  done: string[],
  lastTema: string | null,
  firstLabel: string,
): ContinueTarget {
  const doneSet = new Set(done);
  const number = (tema: ContinueTopic) => String(tema.order).padStart(2, "0");
  const last = temas.find((tema) => tema.slug === lastTema && !doneSet.has(tema.slug));
  if (last) return { href: `/temario/${last.slug}`, label: `Seguir en el tema ${number(last)}` };

  const pending = temas.find((tema) => !doneSet.has(tema.slug));
  if (!pending) return { href: "/temario", label: "Repasar el temario" };
  if (doneSet.size === 0 && !lastTema) return { href: `/temario/${pending.slug}`, label: firstLabel };
  return { href: `/temario/${pending.slug}`, label: `Seguir con el tema ${number(pending)}` };
}

interface ContinueLinkProps {
  temas: ContinueTopic[];
  /** Label when there is no progress yet. */
  firstLabel: string;
  className?: string;
  style?: CSSProperties;
}

export function ContinueLink({ temas, firstLabel, className, style }: ContinueLinkProps) {
  const { temas: done, lastTema, ready } = useProgress();
  const target = continueTarget(temas, ready ? done : [], ready ? lastTema : null, firstLabel);

  return (
    <Link href={target.href} className={className} style={style}>
      {target.label}
    </Link>
  );
}

/** Records the open topic so the home page can offer to continue there. */
export function TrackTemaVisit({ slug }: { slug: string }) {
  const { visitTema, ready } = useProgress();

  useEffect(() => {
    if (ready) visitTema(slug);
  }, [ready, slug, visitTema]);

  return null;
}
