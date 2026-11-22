"use client";

import { useEffect, useState } from "react";
import { OPEN_CONSENT_EVENT, getGaId } from "@/lib/analytics";

/** Footer control to reopen the consent banner and change the choice. */
export function ConsentSettingsButton({ className = "footer__legal-button" }: { className?: string }) {
  // Decided after mount: whether analytics applies depends on the host.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(Boolean(getGaId())), []);

  if (!enabled) return null;

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
