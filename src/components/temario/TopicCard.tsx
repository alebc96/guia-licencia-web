"use client";

import Link from "next/link";
import { BLOCK_LABELS, EXAM_WEIGHT_LABELS } from "@/lib/constants";
import { ProgressToggle } from "@/components/progress/ProgressToggle";

export interface TopicSummary {
  slug: string;
  title: string;
  order: number;
  readingTime: number;
  block: string;
  examWeight: string;
  description: string;
}

/** One topic row with a "mark as read" control backed by localStorage. */
export function TopicCard({ topic }: { topic: TopicSummary }) {
  const href = `/temario/${topic.slug}`;

  return (
    <article className="topic-card">
      <p className="topic-card__order">Tema {String(topic.order).padStart(2, "0")}</p>
      <h3 className="topic-card__title">
        <Link href={href}>{topic.title}</Link>
      </h3>
      <p className="topic-card__meta">
        {BLOCK_LABELS[topic.block as keyof typeof BLOCK_LABELS] ?? topic.block} · {topic.readingTime} min · Peso{" "}
        {EXAM_WEIGHT_LABELS[topic.examWeight as keyof typeof EXAM_WEIGHT_LABELS] ?? topic.examWeight}
      </p>
      <p className="topic-card__description">{topic.description}</p>
      <ProgressToggle kind="tema" id={topic.slug} doneLabel="Leído" pendingLabel="Marcar como leído" />
    </article>
  );
}
