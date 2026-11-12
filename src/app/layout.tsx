import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../styles/main.scss";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";
import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { loadTemas } from "@/lib/content";
import { BASE_PATH, SITE, publicUrl } from "@/lib/constants";
import { PREFERENCES_SCRIPT } from "@/components/reading/preferences";

/**
 * Inter is vendored as a woff2 (latin subset, variable weights) instead of being
 * downloaded by `next/font/google`: the build and the dev server must work
 * offline, and self-hosting is what the plan asked for. Licence: SIL OFL 1.1,
 * see src/fonts/OFL.txt.
 */
const inter = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Texto: Atkinson Hyperlegible Next (Braille Institute), pensada para baja
 * visión. Lectura: Literata, serif de pantalla; solo se usa en el modo
 * Lectura, por eso no se precarga. Ambas SIL OFL 1.1 (src/fonts/OFL-*.txt).
 */
const atkinson = localFont({
  src: [
    { path: "../fonts/atkinson-hyperlegible-next-latin-wght-normal.woff", weight: "200 800", style: "normal" },
    { path: "../fonts/atkinson-hyperlegible-next-latin-wght-italic.woff", weight: "200 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-atkinson",
  fallback: ["system-ui", "sans-serif"],
});

const literata = localFont({
  src: [
    { path: "../fonts/literata-latin-opsz-wght-normal.woff", weight: "200 900", style: "normal" },
    { path: "../fonts/literata-latin-opsz-wght-italic.woff", weight: "200 900", style: "italic" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-literata",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: BASE_PATH ? `${BASE_PATH}/` : "/" },
  robots: { index: true, follow: true },
  icons: { icon: publicUrl("/favicon.svg") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale.replace("-", "_"),
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f13" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const totalTemas = loadTemas().length;

  return (
    // suppressHydrationWarning: el script de preferencias pone data-theme y
    // data-text-size en <html> antes de que React hidrate.
    <html lang={SITE.lang} data-scroll-behavior="smooth" className={`${inter.variable} ${atkinson.variable} ${literata.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <ProgressProvider totalTemas={totalTemas}>
          <GlobalNav />
          <main id="contenido">{children}</main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
