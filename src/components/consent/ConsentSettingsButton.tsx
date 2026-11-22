"use client";

import { GA_ID, OPEN_CONSENT_EVENT } from "@/lib/analytics";

/** Footer control to reopen the consent banner and change the choice. */
export function ConsentSettingsButton({ className = "footer__legal-button" }: { className?: string }) {
  if (!GA_ID) return null;

  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Preferencias de cookies
    </button>
  );
}
