import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";

export const metadata: Metadata = buildMetadata({
  title: "Política de cookies",
  description: "Qué cookies y qué almacenamiento local usa esta guía del permiso B, para qué y cómo cambiar tu elección.",
  path: "/cookies/",
});

const ANALYTICS_COOKIES = [
  { name: "_ga", purpose: "Distinguir visitantes de forma anónima para contar visitas.", duration: "2 años" },
  { name: "_ga_<ID>", purpose: "Mantener el estado de la sesión de Google Analytics.", duration: "2 años" },
];

const LOCAL_STORAGE = [
  { name: "guiab.progress.v1", purpose: "Temas leídos y señales repasadas." },
  { name: "guiab.last-tema.v1", purpose: "Último tema abierto, para el botón «Seguir»." },
  { name: "guiab:theme y guiab:text-size", purpose: "Tema de color y tamaño de texto elegidos." },
  { name: "guiab.consent.v1", purpose: "Tu respuesta al aviso de cookies." },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      lead="Las únicas cookies son las de Google Analytics, y solo se instalan si las aceptas."
    >
      <article className="stack">
        <h2 className="t-display-md">Cookies de análisis (requieren tu consentimiento)</h2>
        <p>
          Las instala Google Analytics, de Google Ireland Limited, después de que pulses «Aceptar» en el aviso. Si lo
          rechazas no se instala ninguna. Los detalles del tratamiento están en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>
        <div className="prose">
          <table>
            <thead>
              <tr>
                <th scope="col">Cookie</th>
                <th scope="col">Titular</th>
                <th scope="col">Finalidad</th>
                <th scope="col">Duración</th>
              </tr>
            </thead>
            <tbody>
              {ANALYTICS_COOKIES.map((cookie) => (
                <tr key={cookie.name}>
                  <td>
                    <code>{cookie.name}</code>
                  </td>
                  <td>Google</td>
                  <td>{cookie.purpose}</td>
                  <td>{cookie.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Almacenamiento local (técnico)</h2>
        <p>
          La web guarda en tu navegador lo necesario para funcionar como pides. No son cookies, no salen de tu dispositivo
          y no se usan para seguirte, así que no necesitan consentimiento.
        </p>
        <div className="prose">
          <table>
            <thead>
              <tr>
                <th scope="col">Clave</th>
                <th scope="col">Para qué</th>
              </tr>
            </thead>
            <tbody>
              {LOCAL_STORAGE.map((item) => (
                <tr key={item.name}>
                  <td>
                    <code>{item.name}</code>
                  </td>
                  <td>{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="stack">
        <h2 className="t-display-md">Cambiar o retirar tu consentimiento</h2>
        <p>
          Puedes cambiar tu elección cuando quieras. Si retiras el consentimiento, se borran las cookies de Google
          Analytics de este sitio.
        </p>
        <p>
          <ConsentSettingsButton className="btn btn-primary" />
        </p>
        <p>
          También puedes borrar las cookies y los datos del sitio desde la configuración de tu navegador.
        </p>
      </article>
    </LegalPage>
  );
}
