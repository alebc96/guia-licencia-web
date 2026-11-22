import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Acerca de",
  description: "Quién hace esta guía del teórico del permiso B, para quién es y cómo se escribe y se verifica.",
  path: "/acerca/",
});

export default function AcercaPage() {
  return (
    <LegalPage
      section="about"
      title="Acerca de esta guía"
      lead="Una guía gratuita para preparar el teórico del permiso B con la norma delante."
    >
      <article className="stack">
        <h2 className="t-display-md">Quién la hace</h2>
        <p>
          {SITE.name} es un proyecto personal de {SITE.owner.name}. Nació para tener en un solo sitio el temario del
          examen teórico, explicado con calma y con las fuentes oficiales enlazadas, sin cuentas ni trucos para que
          pagues.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Para quién es</h2>
        <p>
          Para quien se prepara el examen teórico del permiso B en España, estudie por su cuenta o en una autoescuela.
          También sirve para repasar las normas si hace tiempo que te sacaste el carné. {SITE.disclaimer}
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Cómo se escribe</h2>
        <p>
          Cada tema se redacta a partir del Reglamento General de Circulación, el Reglamento General de Conductores, la
          Ley de Tráfico y Seguridad Vial y las páginas públicas de la DGT. El catálogo de señales sigue el Real Decreto
          465/2025, del que se toman literalmente el código, el nombre y la definición de cada señal.
        </p>
        <p>
          Ningún dato se inventa: si algo no está comprobado contra la norma, la página lo indica. Cada tema enlaza sus
          fuentes y muestra la fecha de la última revisión. La lista completa está en{" "}
          <Link href="/recursos">Recursos y fuentes</Link>.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Errores y sugerencias</h2>
        <p>
          Si encuentras un error, un dato desactualizado o algo que no se entiende, <Link href="/contacto">escríbeme</Link>.
          Las correcciones se agradecen y se aplican lo antes posible.
        </p>
      </article>
    </LegalPage>
  );
}
