"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GA_ID,
  OPEN_CONSENT_EVENT,
  loadAnalytics,
  readConsent,
  revokeAnalytics,
  saveConsent,
  type Consent,
} from "@/lib/analytics";

/**
 * Asks before loading Google Analytics. Accept and reject carry the same
 * weight; the choice is kept in `localStorage` and can be changed from the
 * footer. Renders nothing when the build has no analytics id.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const consent = readConsent();
    if (consent === "granted") loadAnalytics();
    if (consent === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!GA_ID || !open) return null;

  const choose = (consent: Consent) => {
    saveConsent(consent);
    if (consent === "granted") loadAnalytics();
    else revokeAnalytics();
    setOpen(false);
  };

  return (
    <section className="consent" role="region" aria-labelledby="consent-title">
      <div className="consent__inner">
        <div className="consent__copy">
          <h2 id="consent-title" className="t-caption-strong">
            ¿Nos dejas medir las visitas?
          </h2>
          <p className="t-caption">
            Usamos Google Analytics para saber qué temas se leen más y mejorar la guía. Pone cookies y solo se activa
            si aceptas. Tu progreso de estudio no se envía en ningún caso.{" "}
            <Link href="/cookies">Más información</Link>
          </p>
        </div>
        <div className="consent__actions">
          <button type="button" className="btn btn-primary" onClick={() => choose("granted")}>
            Aceptar
          </button>
          <button type="button" className="btn btn-primary" onClick={() => choose("denied")}>
            Rechazar
          </button>
        </div>
      </div>
    </section>
  );
}
