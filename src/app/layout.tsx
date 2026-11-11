import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";
import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { loadTemas } from "@/lib/content";
import { BASE_PATH, SITE, publicUrl } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
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
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const totalTemas = loadTemas().length;

  return (
    <html lang={SITE.lang} className={inter.variable}>
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
