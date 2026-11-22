import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, OwnerDetails } from "@/components/legal/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Política de privacidad",
  description: "Qué datos trata esta guía del permiso B, con qué finalidad y qué derechos tienes.",
  path: "/privacidad/",
});

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      lead="No hay cuentas ni formularios. Solo se tratan datos de navegación si aceptas Google Analytics."
    >
      <article className="stack">
        <h2 className="t-display-md">Responsable del tratamiento</h2>
        <OwnerDetails />
      </article>

      <article className="stack">
        <h2 className="t-display-md">Tu progreso de estudio</h2>
        <p>
          Los temas leídos, las señales repasadas y tus ajustes de lectura se guardan en el almacenamiento local de tu
          navegador. No llegan al titular ni a ningún servidor, y puedes borrarlos desde{" "}
          <Link href="/progreso">Mi progreso</Link> o limpiando los datos del sitio en tu navegador.
        </p>
        <p>
          El enlace para llevar el progreso a otro dispositivo contiene esos datos tras la almohadilla (#). Los
          navegadores no envían esa parte del enlace al servidor, así que tampoco pasa por él.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Estadísticas de visitas (Google Analytics)</h2>
        <p>
          Solo si lo aceptas en el aviso de cookies, la web carga Google Analytics 4 para saber cuántas personas la usan,
          qué páginas leen y desde qué tipo de dispositivo. Google recoge datos de navegación: páginas vistas, fecha y
          hora, ubicación aproximada, navegador, dispositivo y un identificador aleatorio guardado en una cookie. No se
          envía tu progreso de estudio ni ningún dato que te identifique por tu nombre.
        </p>
        <ul className="plain-list">
          <li className="plain-list__item">
            <span className="t-body-strong">Finalidad:</span> estadísticas agregadas para mejorar la guía.
          </li>
          <li className="plain-list__item">
            <span className="t-body-strong">Base jurídica:</span> tu consentimiento (art. 6.1.a del RGPD). Puedes
            retirarlo cuando quieras desde «Preferencias de cookies», en el pie de página, sin que afecte a lo tratado
            antes.
          </li>
          <li className="plain-list__item">
            <span className="t-body-strong">Encargado del tratamiento:</span> Google Ireland Limited, Gordon House,
            Barrow Street, Dublín 4 (Irlanda).
          </li>
          <li className="plain-list__item">
            <span className="t-body-strong">Transferencias internacionales:</span> Google puede tratar datos en Estados
            Unidos. Google LLC está adherida al Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea
            considera que ofrece un nivel de protección adecuado.
          </li>
          <li className="plain-list__item">
            <span className="t-body-strong">Conservación:</span> los datos de cada visita se conservan 14 meses en
            Google Analytics y después se eliminan. Las cookies caducan a los dos años.
          </li>
          <li className="plain-list__item">
            <span className="t-body-strong">Publicidad:</span> las señales publicitarias de Google están desactivadas.
          </li>
        </ul>
        <p>
          Más información en la{" "}
          <a href="https://policies.google.com/privacy?hl=es" rel="noopener noreferrer">
            política de privacidad de Google
          </a>
          .
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Si nos escribes</h2>
        <p>
          Si envías un correo a {SITE.owner.email}, tu dirección y lo que cuentes se usan solo para responderte, con base
          en tu propia solicitud, y se conservan mientras dure la conversación. No se ceden a nadie.
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Tus derechos</h2>
        <p>
          Puedes pedir el acceso, la rectificación o la supresión de tus datos, la limitación de su tratamiento, oponerte
          a él y solicitar su portabilidad escribiendo a{" "}
          <a href={`mailto:${SITE.owner.email}`}>{SITE.owner.email}</a>. Si crees que no se han respetado tus derechos,
          puedes reclamar ante la Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" rel="noopener noreferrer">
            www.aepd.es
          </a>
          ).
        </p>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Cambios en esta política</h2>
        <p>
          Si cambia la forma de tratar los datos, por ejemplo al añadir publicidad, esta página se actualizará y se
          volverá a pedir tu consentimiento cuando haga falta. La fecha de la última actualización figura arriba.
        </p>
      </article>
    </LegalPage>
  );
}
