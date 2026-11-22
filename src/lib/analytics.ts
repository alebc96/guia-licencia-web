/**
 * Google Analytics 4, loaded only after the visitor accepts it.
 *
 * `NEXT_PUBLIC_GA_ID` wins when the build sets it (an empty value turns
 * analytics off). Otherwise the production id applies only on the production
 * host, checked in the browser: Dokploy may not build from our Dockerfile, and
 * local or GitHub Pages copies must never send hits.
 */
const BUILD_GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PRODUCTION = { hosts: ["autoescuelaguide.com", "www.autoescuelaguide.com"], id: "G-68N32CQT0G" };

/** Browser-only: the GA id for this page, or "" when analytics is off. */
export function getGaId(): string {
  if (BUILD_GA_ID !== undefined) return BUILD_GA_ID;
  return PRODUCTION.hosts.includes(window.location.hostname) ? PRODUCTION.id : "";
}

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
  const gaId = getGaId();
  if (!gaId || window.gtag) return;
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
  window.gtag("config", gaId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
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
