/**
 * Site-wide constants: identity, navigation, exam facts and the normative
 * changelog shown on the home page and on /creditos.
 */

export const SITE = {
  name: "Guía B",
  title: "Guía B — Teórico del permiso B",
  tagline: "Todo el teórico. Bien explicado.",
  description:
    "Guía de estudio independiente para el teórico del permiso B: 17 temas, catálogo de señales explicado y enlaces a las fuentes oficiales del BOE y la DGT.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alebc96.github.io",
  locale: "es-ES",
  lang: "es",
  updated: "2026-11-11",
  normCutoff: "2026-11-11",
  author: "Alejandro Becerra",
  disclaimer:
    "Guía independiente. No es una publicación oficial de la Dirección General de Tráfico.",
} as const;

/**
 * Deploying under a sub-path (GitHub Pages project site) needs every public
 * asset URL to be prefixed. Next.js handles `next/link` and `next/image`
 * automatically; raw `<img>` tags must go through `publicUrl`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url.replace(/\/$/, "")}${BASE_PATH}${clean}`;
}

export const NAV_ITEMS = [
  { href: "/temario", label: "Temario" },
  { href: "/senales", label: "Señales" },
  { href: "/examen", label: "Examen" },
  { href: "/practico", label: "Práctico" },
  { href: "/recursos", label: "Recursos" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Guía",
    links: [
      { href: "/temario", label: "Temario de 17 temas" },
      { href: "/examen", label: "El examen teórico" },
      { href: "/practico", label: "El examen práctico" },
      { href: "/progreso", label: "Mi progreso" },
    ],
  },
  {
    title: "Señales",
    links: [
      { href: "/senales", label: "Catálogo de señales" },
      { href: "/senales?family=peligro", label: "Señales de peligro" },
      { href: "/senales?family=reglamentacion", label: "Reglamentación" },
      { href: "/senales?family=indicacion", label: "Indicación" },
    ],
  },
  {
    title: "Estudio",
    links: [
      { href: "/recursos", label: "Recursos y fuentes" },
      { href: "/glosario", label: "Glosario" },
      { href: "/buscar", label: "Buscar" },
      { href: "/creditos", label: "Créditos y aviso legal" },
    ],
  },
] as const;

export const EXAM_FACTS = [
  { label: "Preguntas", value: "30", detail: "Todas con tres opciones de respuesta." },
  { label: "Tiempo", value: "30 min", detail: "Un minuto por pregunta, sin penalización por fallo." },
  { label: "Fallos máximos", value: "3", detail: "Con 4 fallos el examen queda suspenso." },
  { label: "Validez", value: "2 años", detail: "El aprobado del teórico se conserva dos años." },
] as const;

export type ChangelogStatus = "vigente" | "tramitacion";

export const NORMATIVE_CHANGELOG: ReadonlyArray<{
  date: string;
  title: string;
  description: string;
  status: ChangelogStatus;
}> = [
  {
    date: "2027-10-01",
    title: "Obligaciones aplazadas",
    description:
      "Alumbrado diurno para VMP y casco homologado para ciclomotores. Aún no exigibles a fecha de corte.",
    status: "vigente",
  },
  {
    date: "2026-10-01",
    title: "RD 518/2026: usuarios vulnerables",
    description:
      "Nuevas reglas de protección a peatones, ciclistas y motoristas, incluida la separación lateral de 1,5 m.",
    status: "vigente",
  },
  {
    date: "2026-01-01",
    title: "V16 conectado obligatorio",
    description:
      "El dispositivo V16 es el único medio legal de preseñalización; sustituye a los triángulos.",
    status: "vigente",
  },
  {
    date: "2025-10-01",
    title: "Nuevas señales en el examen",
    description: "El catálogo actualizado puede aparecer en las preguntas del teórico desde esta fecha.",
    status: "vigente",
  },
  {
    date: "2025-07-01",
    title: "RD 465/2025: nuevo catálogo de señales",
    description: "Entra en vigor la actualización del catálogo oficial de señales verticales y marcas viales.",
    status: "vigente",
  },
  {
    date: "en tramitación",
    title: "Alcohol 0,2 g/l y vídeos de percepción",
    description:
      "La rebaja de la tasa de alcohol y los vídeos de percepción del riesgo no están aprobados. No se estudian como vigentes.",
    status: "tramitacion",
  },
];

export const STUDY_BLOCKS = ["fundamentos", "normativa", "administrativo", "seguridad", "vehiculo"] as const;

export const BLOCK_LABELS: Record<(typeof STUDY_BLOCKS)[number], string> = {
  fundamentos: "Fundamentos",
  normativa: "Normativa",
  administrativo: "Administrativo",
  seguridad: "Seguridad",
  vehiculo: "Vehículo",
};

export const EXAM_WEIGHT_LABELS: Record<"muy-alta" | "alta" | "media" | "baja", string> = {
  "muy-alta": "Muy alta",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const SUBFAMILY_LABELS: Record<string, string> = {
  advertencia: "Advertencia de peligro",
  prioridad: "Prioridad",
  "prohibicion-de-entrada": "Prohibición de entrada",
  "restriccion-de-paso": "Restricción de paso",
  obligacion: "Obligación",
  "indicaciones-generales": "Indicaciones generales",
  carriles: "Carriles",
  servicio: "Servicio",
  localizacion: "Localización",
  presenalizacion: "Preseñalización",
  confirmacion: "Confirmación",
  "identificacion-carreteras": "Identificación de carreteras",
  "uso-especifico-poblado": "Uso específico en poblado",
  otras: "Otras",
};

export const SHAPE_LABELS: Record<string, string> = {
  circulo: "Círculo",
  triangulo: "Triángulo",
  "triangulo-invertido": "Triángulo invertido",
  octogono: "Octógono",
  cuadrado: "Cuadrado",
  rectangulo: "Rectángulo",
  rombo: "Rombo",
  panel: "Panel",
};

export const FAMILY_LABELS: Record<
  "peligro" | "reglamentacion" | "indicacion" | "marca" | "balizamiento" | "semaforo" | "agente" | "vehiculo",
  string
> = {
  peligro: "Peligro",
  reglamentacion: "Reglamentación",
  indicacion: "Indicación",
  marca: "Marcas viales",
  balizamiento: "Balizamiento",
  semaforo: "Semáforos",
  agente: "Agentes",
  vehiculo: "Señales de vehículo",
};
