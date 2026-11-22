/**
 * Google Analytics 4, loaded only after the visitor accepts it. The id comes
 * from the build (`NEXT_PUBLIC_GA_ID`); without it nothing below does anything,
 * so local builds and the GitHub Pages copy stay free of tracking.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const CONSENT_KEY = "guiab.consent.v1";
/** Fired by the footer button to show the banner again. */
export const OPEN_CONSENT_EVENT = "guiab:open-consent";

export type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    /* Blocked storage: the banner simply asks again next visit. */
  }
}

export function loadAnalytics(): void {
  if (!GA_ID || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, not an array.
    window.dataLayer!.push(arguments);
  };
  // Analytics only: advertising signals stay off (Consent Mode v2).
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Stops measuring and removes the `_ga*` cookies GA already set. */
export function revokeAnalytics(): void {
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of document.cookie.split(";").map((part) => (part.split("=")[0] ?? "").trim())) {
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
