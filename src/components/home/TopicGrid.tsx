import Link from "next/link";
import { TopicCard, type TopicSummary } from "@/components/temario/TopicCard";

/** Grid of the 17 topics with reading progress. */
export function TopicGrid({ topics }: { topics: TopicSummary[] }) {
  return (
    <section className="tile tile-parchment" aria-labelledby="topic-grid-title">
      <div className="container">
        <div className="section-head">
          <h2 id="topic-grid-title" className="t-display-md">
            Tus 17 temas
          </h2>
          <Link href="/temario" className="btn-link">
            Ver el temario completo
          </Link>
        </div>

        <div className="grid grid-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </div>
    </section>
  );
}
