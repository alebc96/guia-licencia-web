# Guía web del permiso B — Plan de investigación e implementación

> **Estado:** planificación. No se ha creado todavía la web.
> **Decisiones confirmadas:** Next.js + React · catálogo completo de señales (315 verticales + marcas) · sin tests.
> **Estructura de referencia:** Vialtest, 17 temas (adaptada y actualizada con BOE/DGT).
> **Fecha de corte normativo:** 11/11/2026.
> **Ubicación prevista:** carpeta local del proyecto (el repositorio no publica rutas del sistema)
> **Idioma:** español de España.
> **Diseño:** sistema Apple descrito por el usuario (tiles full-bleed, tipografía SF Pro, azul único, sin sombras salvo producto).

---

## 1. Objetivo y alcance

Crear una guía de estudio web, responsive y visual, para el **teórico del permiso B** en España, basada en fuentes oficiales (DGT, BOE, Reglamento General de Circulación) y en guías de autoescuela contrastadas.

La web debe:

1. Organizar el temario **por temas**, con una ruta de estudio clara.
2. Incluir el **catálogo completo de señales de tráfico de España**: 315 señales verticales + marcas viales, explicando qué significa cada una, qué hacer y en qué se falla.
3. Estar **toda la información en Markdown** como fuente de verdad, renderizada a HTML estático.
4. Ser **responsive** (360 px → 1440 px) y accesible (WCAG AA).
5. Usar el **lenguaje visual Apple** indicado: blanco/pergamino/negro, un solo azul, tipografía ajustada, botones pill, tiles alternos, sin gradientes ni sombras decorativas.
6. Incluir **enlaces a ejemplos** (DGT, BOE, artículos, vídeos, recursos) para ampliar cada punto.
7. Dejar claro que es una guía independiente, no oficial, con fecha de actualización y aviso legal.

**Fuera de alcance:** backend, cuentas de usuario, base de datos, app nativa, traducciones, banco de preguntas, tests, simulacros y vídeos propios.

---

## 2. Decisiones y supuestos

| Decisión | Elección | Implicación |
|---|---|---|
| Framework | **Next.js 16 (App Router) + React 19 + TypeScript** | Rutas estáticas con `generateStaticParams`, `output: 'export'`, componentes de servidor por defecto. |
| Estilos | **CSS Modules + custom properties** | Control exacto de tokens Apple; sin Tailwind para no diluir el sistema. |
| Contenido | **Markdown puro (`.md`) + frontmatter YAML + Zod** | El usuario puede editar todo sin tocar React. Render con `next-mdx-remote/rsc` o `remark`/`rehype`. |
| Señales | **Catálogo completo**: 315 verticales (P, R, S) + ~126 marcas + semáforos, agentes, balizamiento y señales de vehículos | Pipeline de importación + curaduría por niveles. |
| Tests | **No** | No hay quiz, simulacro ni banco de preguntas. La página `/examen` solo explica el formato. |
| Progreso | **localStorage** (opcional) | Marcar temas leídos y señales vistas; sin cuentas. |
| Búsqueda | **Pagefind** sobre el HTML estático | Búsqueda full-text sin backend. |
| Hosting | Estático (`out/`) | GitHub Pages / Netlify / Vercel / cualquier CDN. |
| Imágenes | **SVG locales** de Wikimedia Commons + SVG propios para marcas | Sin dependencia externa en runtime; créditos obligatorios. |
| Fotografía | 1–2 fotos editoriales de carretera (Unsplash, descargadas) | Aire Apple; optimizadas a WebP/AVIF. |
| Fuente | `system-ui` + **Inter variable** self-hosted | SF Pro no es redistribuible; Inter es el sustituto más cercano. |
| Estructura de temas | **17 temas**, inspirada en Vialtest y ampliada con RD 518/2026 | Secuencia probada de autoescuela; incluye transporte, ADAS y mantenimiento. |

### Versiones de referencia (verificadas)

- `next@16.4.6`
- `next-mdx-remote@6.0.0`
- `pagefind@1.6.0`
- `zod@4.6.7`

---

## 3. Fuentes oficiales y estado normativo

### 3.1. Normativa vigente (corte 11/11/2026)

| Norma | Qué aporta | Enlace |
|---|---|---|
| **Reglamento General de Circulación (RGC)**, RD 1428/2003, texto consolidado | Normas de circulación, señales, velocidades, maniobras, alumbrado | https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514 |
| **RD 465/2025**, de 10 de junio | Nuevo catálogo oficial de señales y marcas viales; en vigor desde 01/07/2025 | https://www.boe.es/buscar/act.php?id=BOE-A-2025-12199 |
| **RD 518/2026**, de 24 de junio | Reforma de protección de usuarios vulnerables; en vigor 01/10/2026 | https://www.boe.es/buscar/act.php?id=BOE-A-2026-13889 |
| **Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial** (RDL 6/2015) | Infracciones, sanciones, puntos | https://www.boe.es/buscar/act.php?id=BOE-A-2015-11786 |
| **Reglamento General de Conductores** (RD 818/2009) | Permisos, requisitos, vigencia, centros de reconocimiento | https://www.boe.es/buscar/act.php?id=BOE-A-2009-17431 |

### 3.2. Páginas DGT de referencia

| Recurso | Enlace |
|---|---|
| Requisitos, preparación y presentación a examen | https://www.dgt.es/nuestros-servicios/permisos-de-conducir/obtener-un-nuevo-permiso-de-conducir/requisitos-preparacion-y-presentacion-a-examen |
| Clases de permisos de conducir | https://www.dgt.es/nuestros-servicios/permisos-de-conducir/clases-de-permisos-de-conducir/ |
| Maniobras del permiso B | https://www.dgt.es/nuestros-servicios/permisos-de-conducir/maniobras-b |
| Permiso por puntos | https://www.dgt.es/nuestros-servicios/permisos-de-conducir/tus-puntos-y-tus-permisos/como-funciona-el-permiso-por-puntos/ |
| Accesibilidad y manual en Lectura Fácil | https://www.dgt.es/nuestros-servicios/permisos-de-conducir/accesibilidad/ |
| Normas básicas de circulación | https://www.dgt.es/muevete-con-seguridad/viaja-seguro/consejos-extranjeros/normas-basicas-de-circulacion |
| Consumo de alcohol | https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/consumo-de-alcohol/ |
| Consumo de drogas y medicación | https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/consumo-de-drogas-y-medicacion/ |
| Distracciones al conducir | https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/distracciones-al-conducir/ |
| Conducir con fatiga | https://www.dgt.es/muevete-con-seguridad/evita-conductas-de-riesgo/conducir-con-fatiga/ |
| Dispositivo V16 | https://www.dgt.es/muevete-con-seguridad/tecnologia-e-innovacion-en-carretera/Dispositivos-de-presenalizacion-V16/ |
| ADAS | https://www.dgt.es/muevete-con-seguridad/sistemas-avanzados-ayuda-conduccion/Sistemas-avanzados-de-ayuda-a-la-conduccion-ADAS-/ |
| Glorietas | https://www.dgt.es/muevete-con-seguridad/conviertete-en-un-buen-conductor/consejos-generales/como-circular-rotondas/ |
| Autopistas y autovías | https://www.dgt.es/muevete-con-seguridad/conviertete-en-un-buen-conductor/consejos-generales/comunicacion_noticias_20241030-autopistas-y-autovias-las-normas-para-conducir-seguro_/ |
| Qué hacer ante un accidente | https://www.dgt.es/muevete-con-seguridad/que-hacer-ante-un-accidente-de-trafico/ |
| Nota de prensa RD 518/2026 | https://www.dgt.es/comunicacion/notas-de-prensa/20260930-reforma-del-reglamento-de-circulacion-usuarios-vulnerables/ |
| Nota de prensa nuevo catálogo de señales | https://www.dgt.es/comunicacion/notas-de-prensa/20250610-el-gobierno-aprueba-la-actualizacion-del-catalogo-oficial-de-senales-de-trafico |

### 3.3. Fuentes secundarias y política de uso

| Fuente | Uso | Enlace |
|---|---|---|
| **Vialtest — Temario permiso B** | Estructura de 17 temas, secuencia didáctica y detección de lagunas | https://vialtest.com/manual-del-conductor/permiso-B |
| PracticaTest | Contraste de temario y enfoque de examen | https://practicatest.com/temario/permiso-B |
| SacaCarnet | Ruta de 7 bloques y explicaciones breves | https://www.sacacarnet.com/temario |
| MyDGTTest | Formato de examen y consejos | https://mydgttest.com/examen-teorico-dgt |
| DGT Exam | Simulacros externos (solo enlace) | https://dgtexam.es/permisos/b/ |
| Teoriko | Guía del formato del examen | https://teoriko.com/guias/formato-completo-examen-teorico |

**Política editorial y derechos de autor:**

1. **No se copia texto, tabla, imagen ni estructura literal** de Vialtest ni de otras webs.
2. Se usan como **referencia de estructura y detección de temas**, no como fuente de autoridad.
3. Todo dato se **contrasta con BOE/DGT** y se redacta de nuevo.
4. Se enlaza a la fuente original en `/recursos` y en “Para profundizar”.
5. Las tablas y explicaciones propias se construyen desde la norma, no desde el manual de terceros.
6. Si se detecta una simplificación o error en una fuente secundaria, se corrige y se documenta en `docs/fuentes.md`.
7. Las imágenes de señales se obtienen de Wikimedia Commons con licencia y crédito, o se dibujan propias.

**Ejemplo de matiz detectado en Vialtest:** su resumen del permiso B dice que se puede llevar un remolque de más de 750 kg si la suma de MMAs no supera 4.250 kg. Es una simplificación: para un conjunto de 3.500–4.250 kg con remolque pesado se necesita la **autorización B-96**; el permiso B estándar cubre remolque ≤750 kg o conjunto ≤3.500 kg. La guía explicará B, B-96 y B+E por separado.

### 3.4. Datos que deben verificarse siempre contra la fuente primaria

- Formato del examen: **30 preguntas, 3 opciones, 30 minutos, máximo 3 fallos** (27 aciertos). El aprobado del teórico vale **2 años**.
- La DGT estudia incorporar **vídeos de percepción del riesgo**, pero a fecha de corte **no hay cambio aprobado** ni fecha de entrada en vigor. No presentarlo como vigente.
- Alcohol: general **0,25 mg/l aire / 0,5 g/l sangre**; noveles y profesionales **0,15 / 0,3**; menores **0,0**. La rebaja a 0,2 g/l está en tramitación, **no vigente**.
- Puntos: **12 iniciales**, **8 para noveles**, máximo **15** (14 a los 3 años sin infracciones, 15 a los 6).
- V16: **único dispositivo legal de preseñalización desde 01/01/2026**; sustituye a los triángulos.
- Velocidades urbanas: **20 / 30 / 50 km/h** según plataforma única, un carril por sentido o dos o más carriles por sentido. Interurbanas: **90** convencional y **120** autopista/autovía. Mínima en autopista/autovía: **60 km/h**.
- Nuevas reglas de ciclistas (RD 518/2026): **1,5 m** de separación, **reducir 20 km/h** fuera de poblado, **5 m** de distancia en vías urbanas.
- Nuevo catálogo de señales: **en vigor desde 01/07/2025**; las nuevas señales entran en el examen desde **01/10/2025**.

> **Regla editorial:** ningún código, nombre o significado de señal se inventa. Se extrae del catálogo oficial del RD 465/2025 y se contrasta con la DGT. Si hay duda, se marca como “pendiente de verificar” y no se publica.

---

## 4. Arquitectura de información

```
/                           Inicio
/temario                    Índice de los 17 temas
/temario/[slug]             Tema (contenido + lo esencial + fuentes)
/senales                    Catálogo completo con búsqueda y filtros
/senales/[slug]             Ficha de señal o marca vial
/examen                     Formato, día del examen, consejos, FAQ
/practico                   Examen práctico y maniobras
/recursos                   Fuentes oficiales, vídeos, lecturas, tests externos
/glosario                   Términos A–Z
/progreso                   Mi progreso (localStorage)
/buscar                     Búsqueda full-text (Pagefind)
/creditos                   Créditos de imágenes, licencias y aviso legal
```

### Navegación

- **Global nav** negra de 44 px: marca “Guía B”, enlaces Temario / Señales / Examen / Práctico / Recursos, icono de búsqueda y anillo de progreso.
- **Sub-nav frosted** de 52 px en secciones: nombre de la sección a la izquierda; enlaces contextuales y CTA pill “Empezar” a la derecha.
- **Móvil ≤833 px:** hamburguesa + logo centrado + progreso. Overlay negro a pantalla completa con enlaces grandes.
- **Footer** pergamino: columnas Guía / Señales / Práctica / Fuentes; fila legal con aviso “Guía independiente, no oficial de la DGT”, fecha de actualización y enlaces a BOE.

### Home (secuencia de tiles)

1. **Hero claro/pergamino:** eyebrow “Permiso B · Actualizado a la normativa de 2026”, H1 “Todo el teórico. Bien explicado.”, tagline, dos pills (“Empezar por el tema 1” / “Explorar señales”) y fotografía editorial de carretera.
2. **El examen en 30 segundos:** 4 tarjetas utilitarias (30 preguntas, 30 minutos, 3 fallos, 2 años de validez).
3. **Tu ruta de estudio:** grid de 17 temas con progreso.
4. **Tile oscuro de señales:** “315 señales. Todas explicadas.” + 6 SVGs + CTA al catálogo.
5. **Tile de práctica:** checklist del examen práctico y enlaces.
6. **Actualizado:** changelog normativo (RD 465/2025, RD 518/2026, V16, alcohol en tramitación).
7. **Footer**.

---

## 5. Sistema de diseño (Apple adaptado)

### 5.1. Tokens

```css
:root {
  /* Color */
  --color-primary: #0066cc;
  --color-primary-focus: #0071e3;
  --color-primary-on-dark: #2997ff;
  --color-canvas: #ffffff;
  --color-parchment: #f5f5f7;
  --color-pearl: #fafafc;
  --color-ink: #1d1d1f;
  --color-body: #1d1d1f;
  --color-body-on-dark: #ffffff;
  --color-body-muted: #cccccc;
  --color-ink-muted-80: #333333;
  --color-ink-muted-48: #7a7a7a;
  --color-divider-soft: #f0f0f0;
  --color-hairline: #e0e0e0;
  --color-tile-1: #272729;
  --color-tile-2: #2a2a2c;
  --color-tile-3: #252527;
  --color-black: #000000;
  --color-chip-translucent: rgba(210, 210, 215, 0.64);

  /* Tipografía */
  --font-display: "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  --font-text: "SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;

  /* Espaciado */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 17px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
  --space-section: 80px;

  /* Radios */
  --radius-xs: 5px;
  --radius-sm: 8px;
  --radius-md: 11px;
  --radius-lg: 18px;
  --radius-pill: 9999px;

  /* Sombra única (solo imágenes de producto/señal) */
  --shadow-product: 3px 5px 30px 0 rgba(0, 0, 0, 0.22);

  /* Señales: colores de contenido, no de UI */
  --sign-red: #c8102e;
  --sign-blue: #0055a4;
  --sign-yellow: #f2c200;
  --sign-black: #111111;
  --sign-white: #ffffff;
}
```

### 5.2. Tipografía

| Token | Tamaño | Peso | Interlineado | Tracking | Uso |
|---|---|---|---|---|---|
| `hero-display` | 56 px | 600 | 1.07 | -0.28 px | H1 del hero |
| `display-lg` | 40 px | 600 | 1.10 | 0 | Titulares de tile |
| `display-md` | 34 px | 600 | 1.47 | -0.374 px | Cabeceras de sección |
| `lead` | 28 px | 400 | 1.14 | 0.196 px | Subtítulo de tile |
| `lead-airy` | 24 px | 300 | 1.5 | 0 | Párrafos amplios |
| `tagline` | 21 px | 600 | 1.19 | 0.231 px | Tagline / sub-nav |
| `body-strong` | 17 px | 600 | 1.24 | -0.374 px | Énfasis |
| `body` | 17 px | 400 | 1.47 | -0.374 px | Texto principal |
| `dense-link` | 17 px | 400 | 2.41 | 0 | Footer |
| `caption` | 14 px | 400 | 1.43 | -0.224 px | Botones, captions |
| `caption-strong` | 14 px | 600 | 1.29 | -0.224 px | Cabeceras de footer |
| `fine-print` | 12 px | 400 | 1.0 | -0.12 px | Legal |
| `micro-legal` | 10 px | 400 | 1.3 | -0.08 px | Micro legal |

**Reglas:** body 17 px (no 16), titulares 600 (no 700), weight 500 ausente, tracking negativo solo ≥17 px, medida de lectura 680–760 px en artículos (aunque el contenedor sea 980/1440).

### 5.3. Componentes

- `global-nav` 44 px negro, links 12 px, iconos 44×44.
- `sub-nav-frosted` 52 px, `backdrop-filter: saturate(180%) blur(20px)`, fondo pergamino 80 %.
- `button-primary`: pill azul, 11×22 px, body 17 px, `active: scale(.95)`.
- `button-secondary-pill`: ghost pill, borde azul 1 px.
- `button-dark-utility`: ink #1d1d1f, radio 8 px, 8×15 px.
- `button-pearl-capsule`: pearl #fafafc, borde 3 px divider-soft, radio 11 px.
- `button-icon-circular`: 44×44, chip translúcido.
- `product-tile-light/parchment/dark`: full-bleed, padding 80 px, sin radio.
- `store-utility-card`: blanco, hairline, radio 18 px, padding 24 px, sin sombra.
- `signal-card`: superficie pergamino, SVG centrado, radio 18 px, hairline; la sombra solo en el SVG si se quiere “peso”.
- `configurator-option-chip`: pill, seleccionado con borde 2 px azul.
- `search-input`: pill 44 px, hairline.
- `footer`: pergamino, links 17/2.41, legal 12 px.
- `callout-exam`: superficie pergamino + etiqueta “En el examen” + regla azul de 3 px (funcional, no decorativa).
- `progress-bar`: 2 px azul, sin gradiente.

### 5.4. Responsive

| Breakpoint | Cambios |
|---|---|
| ≤419 px | 1 columna; hero 28 px; padding 48 px; sub-nav solo CTA |
| 420–640 px | 1 columna; hero 34 px; imágenes 80 % |
| 641–735 px | padding 48 px; footer apilado |
| 736–833 px | nav hamburguesa; sub-nav sin chips |
| 834–1023 px | nav completa; grids 3→2 columnas |
| 1024–1068 px | tiles 2/3 con márgenes; hero 40 px |
| 1069–1440 px | layout completo; grids 4–5 columnas; contenido 1440 px |
| ≥1441 px | contenido bloqueado a 1440 px |

**Objetivos táctiles:** mínimo 44×44 px. **Nunca** scroll horizontal.

### 5.5. Accesibilidad (añadidos sobre el sistema)

- `lang="es"`, skip link, landmarks (`header`, `nav`, `main`, `footer`), un solo H1 por página.
- `:focus-visible` con outline 2 px `--color-primary-focus` y offset 2 px.
- Contraste AA: el azul #0066cc sobre blanco cumple; el texto muted #7a7a7a solo para texto grande/legal con contraste revisado.
- `prefers-reduced-motion`: desactivar transiciones; mantener `scale(.95)` instantáneo.
- SVGs de señales con `role="img"` y `aria-label` completo (“Señal R-301, velocidad máxima 50 km/h”).
- Tablas con `<caption>` y `<th scope>`.
- Acordeones con `<details>/<summary>` nativos.
- No usar solo color para estados (añadir icono/texto).
- Navegación por teclado en menú móvil, filtros y búsqueda.

### 5.6. Do / Don’t

**Do:** un solo azul para acciones; tiles alternos como separador; sombra solo en imágenes; body 17 px; pills para acciones; `scale(.95)` al pulsar; nav negra.

**Don’t:** segundo color de marca; sombras en tarjetas/botones/texto; gradientes decorativos; weight 500; redondear tiles full-bleed; mezclar radios; usar azul cielo sobre fondo claro.

> **Excepción documentada:** los colores rojo/azul/amarillo de las señales son **contenido**, no acentos de interfaz. Se aíslan en tokens `--sign-*` y no se usan en botones, enlaces ni estados.

---

## 6. Modelo de contenido (todo en `.md`)

### 6.1. Tema (`content/temas/*.md`)

```yaml
---
title: "Velocidad y distancia de seguridad"
slug: "velocidad-distancia"
order: 3
block: "Normativa"
description: "Límites, velocidad adecuada, distancia de seguridad y frenada."
icon: "speed"
readingTime: 12
updated: 2026-11-11
examWeight: "Alta"
keyFacts:
  - label: "Urbana, 2+ carriles por sentido"
    value: "50 km/h"
  - label: "Carretera convencional"
    value: "90 km/h"
  - label: "Autopista / autovía"
    value: "120 km/h"
mistakes:
  - "Confundir el límite de la vía con la velocidad adecuada a las condiciones."
  - "Olvidar que la distancia de seguridad también depende del estado del firme."
sources:
  - label: "RGC, arts. 48–52"
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514"
  - label: "DGT — Normas básicas de circulación"
    url: "https://www.dgt.es/muevete-con-seguridad/viaja-seguro/consejos-extranjeros/normas-basicas-de-circulacion"
---
```

Cuerpo en Markdown: `## Lo esencial`, `## Explicado`, `## Casos prácticos`, `## Errores típicos`, `## Para profundizar`.

> Sin campo `quiz`. No hay tests en la web.

### 6.2. Señal (`content/senales/*.md`)

```yaml
---
code: "R-301"
name: "Velocidad máxima"
family: "reglamentacion"
subfamily: "prohibicion"
shape: "circulo"
colors: ["blanco", "rojo", "negro"]
meaning: "Prohíbe circular a más de la velocidad indicada."
action: "Reduce la velocidad antes de pasar la señal."
where: "En cualquier vía; la cifra indica km/h."
mistake: "Creer que la prohibición termina en la próxima intersección: la velocidad máxima sigue vigente hasta otra señal o fin de prohibición."
related: ["R-500"]
image: "/senales/r-301-50.svg"
imageAlt: "Señal circular blanca con borde rojo y el número 50 en negro"
imageCredit: "Wikimedia Commons — autor, licencia"
officialSource: "RD 465/2025, anexo I"
tier: "A" # A curada | B oficial | C marca
new: false
updated: 2026-11-11
---
```

Cuerpo opcional: explicación ampliada, ejemplo real, enlace al BOE.

### 6.3. Marca vial (`content/senales/m-*.md`)

Mismo esquema, con `family: "marca"`, `subfamily` (longitudinal, transversal, flecha, inscripción, cebreado, otra) y `image` en `/marcas/`.

### 6.4. Recurso (`content/recursos/*.md`)

```yaml
---
title: "Cómo circular por una glorieta"
url: "https://www.dgt.es/..."
type: "oficial" # oficial | didactico | test | video | legal
topics: ["prioridad", "maniobras"]
description: "Explicación paso a paso de la DGT."
free: true
language: "es"
---
```

### 6.5. Glosario (`content/glosario/*.md`)

```yaml
---
term: "MMTA"
definition: "Masa máxima técnicamente admisible..."
related: ["MMA", "tara"]
---
```

### 6.6. Validación

- Esquemas Zod en `src/lib/schemas.ts`.
- Códigos únicos, slugs únicos, campos obligatorios.
- `npm run check:content` falla si falta `imageAlt`, `meaning`, `officialSource` o `updated`.
- Verificación de que cada `image` existe en `public/`.
- Enlaces internos validados con script.

---

## 7. Temario: 17 temas

| # | Tema | Bloque | Peso en examen | Contenidos clave |
|---|---|---|---|---|
| 1 | Tipos de vehículos y conceptos básicos | Fundamentos | Medio | Vehículos, masas, vías, usuarios, usuario vulnerable |
| 2 | Uso de las vías públicas | Normativa | Alto | Sentido, carriles, arcén, BUS-VAO, carril de emergencia |
| 3 | Velocidad y distancia de seguridad | Normativa | Alto | 20/30/50, 90/120, mínima, 2 segundos, frenada |
| 4 | Maniobras | Normativa | Muy alto | Incorporación, adelantamiento, giros, parada, estacionamiento |
| 5 | Prioridad de paso | Normativa | Muy alto | Intersecciones, glorietas, STOP/ceda, peatones, ciclistas |
| 6 | Transporte de personas y mercancías | Normativa | Medio | Ocupantes, SRI, carga, dimensiones, remolques |
| 7 | Alumbrado y señalización óptica | Normativa | Alto | Luces, cuándo usarlas, V16, deslumbramiento |
| 8 | Señales de circulación | Normativa | Muy alto | Agentes, semáforos, verticales, marcas, balizamiento |
| 9 | El permiso de conducir, documentación y seguro | Administrativo | Alto | Permiso B, B-96, B+E, vigencia, ITV, seguro, puntos |
| 10 | Estado físico del conductor | Seguridad | Alto | Alcohol, drogas, fatiga, distracciones, reacción |
| 11 | Los demás usuarios y usuarios vulnerables | Seguridad | Alto | Peatones, ciclistas, motoristas, VMP, RD 518/2026 |
| 12 | Visibilidad, condiciones adversas y peligros de la vía | Seguridad | Medio | Lluvia, niebla, hielo, viento, noche, túneles |
| 13 | Adherencia, neumáticos y frenos | Vehículo | Medio | Aquaplaning, ABS, presión, dibujo, frenada |
| 14 | Seguridad y conducción económica | Vehículo | Medio | Cinturón, SRI, airbag, eficiencia, emisiones |
| 15 | Sistemas ADAS | Vehículo | Medio | ACC, AEB, mantenimiento de carril, eCall |
| 16 | Accidentes y primeros auxilios | Seguridad | Medio | PAS, protección, 112, RCP, heridos |
| 17 | Mantenimiento del automóvil | Vehículo | Bajo | Revisiones, líquidos, batería, testigos, ITV |

### 7.1. Detalle por tema

#### Tema 1 — Tipos de vehículos y conceptos básicos
- Vehículo a motor, ciclomotor, VMP, remolque, semirremolque, conjunto.
- Tara, masa en carga, MMA, masa máxima técnicamente admisible.
- Autopista, autovía, carretera convencional, vía urbana, travesía, calzada, carril, arcén, plataforma, acera, zona peatonal, carril bici.
- Definición de **usuario vulnerable** (RD 518/2026): peatones, ciclistas, motoristas, usuarios de VMP.
- Permiso B: ≤3.500 kg MMA, 9 plazas incluido el conductor; remolque ≤750 kg; conjunto ≤3.500 kg con remolque >750 kg; **B-96** para conjuntos de 3.500–4.250 kg; B+E para más.
- B→A1 a los 3 años.
- **Errores típicos:** confundir tara con MMA; creer que el arcén es un carril; confundir autopista y autovía; creer que el permiso B cubre sin más un conjunto de 4.250 kg.
- **Ejemplos:** DGT “Clases de permisos”, RGC arts. 2–4, vídeo “Tipos de vías”.

#### Tema 2 — Uso de las vías públicas
- Circulación por la derecha; carril derecho como norma; uso de otros carriles para adelantar, girar o por densidad.
- Arcén: no circular por él salvo excepciones; carril de emergencia en retenciones (RD 518/2026).
- BUS-VAO, carriles bici, zonas peatonales, plataforma única.
- Prioridad de vehículos de emergencia; convoyes; obras.
- Nuevo título VI urbano: zonas de prioridad residencial, caminos escolares, coexistencia.
- **Errores típicos:** circular por el carril central “por comodidad”; usar el arcén para adelantar por la derecha.
- **Ejemplos:** DGT “Normas básicas”, “Conducir por ciudad”, RGC arts. 11–38.

#### Tema 3 — Velocidad y distancia de seguridad
- Límites: 20/30/50 urbano; 90 convencional; 120 autopista/autovía; mínima 60 en alta capacidad; nunca por debajo de la mitad del máximo.
- Velocidad adecuada: visibilidad, firme, tráfico, carga, meteorología.
- Distancia: 2 segundos; ampliar en túneles, lluvia, noche; 1,5 m a ciclistas; 5 m urbano (RD 518/2026).
- Frenada: distancia de reacción + frenada; crece con el cuadrado de la velocidad; el estado del firme la multiplica.
- **Errores típicos:** confundir límite con velocidad segura; no aumentar la distancia con lluvia.
- **Ejemplos:** DGT “Exceso de velocidad”, RGC arts. 48–52, vídeo “Distancia de seguridad”.

#### Tema 4 — Maniobras
- Incorporación: espejo, señal, ceder, acelerar a la velocidad del tráfico.
- Adelantamiento: por la izquierda, con visibilidad y espacio, 1,5 m a ciclistas, reducir 20 km/h fuera de poblado; prohibiciones; vuelta a la derecha.
- Cambio de dirección: antelación, señal, espejos, ángulo muerto, ceder.
- Parada y estacionamiento: definiciones; prohibiciones; zonas azul/naranja; garajes; no obstaculizar.
- Marcha atrás, giro en U, cambio de sentido.
- **Errores típicos:** adelantar sin volver a la derecha; no señalizar la salida de glorieta; estacionar en paso de peatones.
- **Ejemplos:** RGC arts. 73–94, DGT “Maniobras B”.

#### Tema 5 — Prioridad de paso
- Orden: agentes > señalización circunstancial > semáforos > verticales > marcas.
- Intersecciones sin señalizar: ceder al que viene por la derecha.
- STOP: detención total y ceder; Ceda: reducir y ceder sin detenerse si no hay tráfico.
- Glorietas: prioridad de quien ya circula dentro; entrada por la derecha; señalizar salida.
- Peatones: prioridad en pasos y en plataforma única; ciclistas y VMP.
- Vehículos de emergencia: facilitar el paso.
- **Errores típicos:** entrar en glorieta sin ceder; detenerse en un ceda cuando no es necesario; confundir prioridad de derecha con preferencia.
- **Ejemplos:** DGT “Glorietas”, RGC arts. 56–72.

#### Tema 6 — Transporte de personas y mercancías
- Ocupantes: plazas homologadas, cinturón, SRI hasta 135 cm, airbag, asientos traseros.
- Mascotas: sujeción, no en el asiento del conductor, transporte seguro.
- Carga: reparto, sujeción, MMA, dimensiones, visibilidad, luces de gálibo.
- Carga que sobresale: límites, señalización, autorizaciones.
- Remolques y caravanas: MMA, B/B-96/B+E, matrícula, seguro, ITV.
- Mercancías peligrosas: nociones básicas, ADR, prohibiciones.
- **Errores típicos:** llevar carga suelta; superar la MMA; no señalizar un voladizo.
- **Ejemplos:** RGC arts. 9–14 y 19–23, DGT “Con caravana, remolque o autocaravana”.

#### Tema 7 — Alumbrado y señalización óptica
- Luces de posición, cruce, carretera, antiniebla, emergencia, freno, intermitentes, marcha atrás.
- Cuándo: noche, túneles, visibilidad reducida; día para motos; VMP desde 01/10/2027.
- No deslumbrar; antiniebla solo con niebla/lluvia intensa/nieve.
- V16: obligatorio desde 01/01/2026, en techo, conectado, 360°, 30 min.
- **Errores típicos:** usar antiniebla traseros sin necesidad; no encender luces en túnel; confundir emergencia con posición.
- **Ejemplos:** RGC arts. 95–106, DGT V16.

#### Tema 8 — Señales de circulación
- Jerarquía y tipos; formas y colores; señales de peligro, reglamentación, indicación, marcas, balizamiento, semáforos, agentes.
- Señales nuevas del RD 465/2025.
- Enlaza a `/senales` para el catálogo completo.
- **Errores típicos:** creer que una marca vial prevalece sobre un semáforo; olvidar que la señal más restrictiva prevalece dentro del mismo tipo.
- **Ejemplos:** RD 465/2025, catálogo DGT, DGT “Flechas en señales”.

#### Tema 9 — El permiso de conducir, documentación y seguro
- Requisitos: 18 años, residencia, aptitud psicofísica (CRC), no privación.
- Permiso B, B-96, B+E: qué autoriza cada uno.
- Documentos: permiso de conducir, permiso de circulación, ficha técnica/ITV, seguro obligatorio; documentación digital en miDGT (verificar vigencia).
- ITV: primera a los 4 años; cada 2 años hasta los 10; anual después.
- Seguro: RC obligatorio; recargo por no asegurar; asistencia y defensa.
- Vigencia del permiso B y renovaciones; teórico válido 2 años.
- Noveles: 8 puntos, tasa 0,15.
- Infracciones, sanciones y puntos: leves/graves/muy graves; 2/3/4/6 puntos; 12/8 iniciales; máximo 15; recuperación.
- **Errores típicos:** creer que la ITV es anual desde el primer año; pensar que el seguro a todo riesgo es obligatorio; confundir B, B-96 y B+E.
- **Ejemplos:** DGT “Documentación de un vehículo”, “Permiso por puntos”, Reglamento General de Conductores.

#### Tema 10 — Estado físico del conductor
- Alcohol: límites, efectos, sanciones, delito desde 0,60 mg/l.
- Drogas: prohibición total; medicamentos; combinación.
- Fatiga/sueño: señales, pausas cada 2 horas, café, siesta.
- Distracciones: móvil, GPS, pantallas, pasajeros.
- Tiempo de reacción; estrés; edad; experiencia.
- **Errores típicos:** “con dos cervezas se conduce bien”; confiar en el café; mirar el móvil en un semáforo.
- **Ejemplos:** DGT alcohol/drogas/fatiga/distracciones, RGC art. 20, Cruz Roja.

#### Tema 11 — Los demás usuarios y usuarios vulnerables
- Definición y colectivos: peatones, ciclistas, motoristas, VMP.
- RD 518/2026: prioridad peatonal en plataforma única; 5 m de distancia urbana; 1,5 m y −20 km/h al adelantar ciclistas; VMP (15 años, casco, luces, no autopistas); ciclomotores; motos.
- Zonas 20/30, prioridad residencial, caminos escolares.
- **Errores típicos:** adelantar a un ciclista sin espacio; no ceder en plataforma única; confundir VMP con ciclomotor.
- **Ejemplos:** RD 518/2026, nota DGT, guía de la reforma.

#### Tema 12 — Visibilidad, condiciones adversas y peligros de la vía
- Lluvia: aquaplaning, distancia, luces, frenada suave.
- Niebla: antiniebla, velocidad, no adelantar.
- Nieve/hielo: cadenas, neumáticos de invierno, suavidad.
- Viento: agarre, camiones, túneles.
- Noche: deslumbramiento, fatiga, visibilidad.
- Autopista/autovía y túneles: entrada, salida, arcén, prohibiciones, mínima 60.
- **Errores típicos:** frenar bruscamente en aquaplaning; usar largas con niebla.
- **Ejemplos:** DGT “Conducir con lluvia/niebla/hielo”, RGC.

#### Tema 13 — Adherencia, neumáticos y frenos
- Adherencia: firme, dibujo, presión, temperatura, carga.
- Neumáticos: 1,6 mm mínimo, desgaste irregular, presión en frío, válvulas, rueda de repuesto.
- Frenos: discos, pastillas, líquido, ABS, reparto de frenada.
- Aquaplaning y derrapes: qué hacer y qué no.
- **Errores típicos:** creer que el ABS acorta siempre la frenada; no revisar la presión en frío.
- **Ejemplos:** DGT, RACE, Fundación Mapfre.

#### Tema 14 — Seguridad y conducción económica
- Cinturón, SRI, airbag, reposacabezas, ISOFIX.
- Conducción eficiente: suavidad, anticipación, presión, carga, aire acondicionado.
- Emisiones, etiquetas ambientales, ZBE, eléctricos/híbridos.
- **Errores típicos:** acelerar y frenar bruscamente; llevar carga innecesaria; no ajustar el reposacabezas.
- **Ejemplos:** DGT “Conducción eficiente”, IDAE.

#### Tema 15 — Sistemas ADAS
- ACC, AEB, mantenimiento de carril, reconocimiento de señales, cámara trasera, sensores.
- eCall, ABS, ESP, control de crucero.
- Limitaciones: no sustituyen al conductor; condiciones meteorológicas; calibración.
- **Errores típicos:** confiar ciegamente en el ADAS; no saber qué hace cada testigo.
- **Ejemplos:** DGT ADAS, manual del vehículo.

#### Tema 16 — Accidentes y primeros auxilios
- PAS: Proteger, Avisar (112), Socorrer.
- Protección: V16, chaleco, salir por el lado seguro; no triángulos.
- Heridos: no mover salvo peligro; hemorragias, fracturas, quemaduras, inconsciente, RCP 30:2, posición lateral de seguridad.
- Accidentes en túnel, autopista; avisar y facilitar acceso.
- **Errores típicos:** mover a un herido sin necesidad; no protegerse antes de auxiliar.
- **Ejemplos:** DGT “Qué hacer ante un accidente”, Cruz Roja, 112.

#### Tema 17 — Mantenimiento del automóvil
- Revisiones periódicas, aceite, refrigerante, frenos, batería, filtros, correa/cadena.
- Testigos del cuadro: qué significan y qué hacer.
- Averías: luces, neumático, batería, sobrecalentamiento.
- ITV y libro de mantenimiento.
- **Errores típicos:** ignorar un testigo rojo; mezclar líquidos; no revisar el nivel de aceite en frío.
- **Ejemplos:** RACE, Fundación Mapfre, manual del fabricante.

---

## 8. Sección de señales: catálogo completo

### 8.1. Jerarquía (explicada visualmente)

1. **Órdenes de los agentes** de la autoridad encargados de la vigilancia del tráfico.
2. **Señalización circunstancial** (obras, eventos) y **balizamiento**.
3. **Semáforos**.
4. **Señales verticales**.
5. **Marcas viales**.

> Si se contradicen señales del mismo tipo, prevalece la más restrictiva. Si son de tipos distintos, prevalece la de mayor prioridad. Las marcas viales no pueden contradecir una señal vertical; si ocurre, prevalece la vertical.

### 8.2. Familias y recuento

| Familia | Código | Forma / color | Nº objetivo | Tratamiento |
|---|---|---|---|---|
| Peligro | P- | Triángulo blanco, borde rojo, pictograma negro | ~50 | Ficha completa + definición oficial |
| Reglamentación | R- | Círculo; prohibición blanco/rojo; obligación azul/blanco; STOP octógono; Ceda triángulo invertido | ~73 | Ficha completa + definición oficial |
| Indicación | S- | Cuadrado/rectángulo, azul/verde/blanco, pictogramas | ~192 | Definición oficial + contexto |
| Marcas viales | M- | Pintura sobre calzada | ~126 variantes | SVG esquemático + definición |
| Semáforos | — | Rojo/ámbar/verde, flechas, carril | ~10 | Ficha explicativa |
| Agentes | — | Brazos, silbato, posición | ~6 | Ficha explicativa |
| Balizamiento | — | Hitos, conos, captafaros, paneles | ~8 | Ficha explicativa |
| Señales de vehículos | V- | V-16, V-2, V-10… | ~6 | Ficha explicativa |
| **Total** | | | **315 verticales + ~126 marcas + otros** | |

> Los recuentos exactos se confirman en la auditoría del catálogo (F3.1). No se publica un número que no cuadre con la fuente.

### 8.3. Estrategia de contenido por niveles

Escribir 441 fichas con el mismo nivel de detalle es inviable y produce texto de relleno. Se usan tres niveles, visibles en el frontmatter (`tier`):

| Nivel | Nº aprox. | Contenido | Criterio |
|---|---|---|---|
| **A — Curada** | 80 | Significado, qué hacer, dónde, error típico, relacionadas, ejemplo real, enlace | Señales más preguntadas y peligrosas |
| **B — Oficial** | ~235 | Definición oficial + qué hacer + familia + contexto + imagen | Resto de verticales |
| **C — Marca** | ~126 | Definición oficial + esquema SVG + qué indica + error típico común | Marcas viales |
| **D — Otros** | ~30 | Semáforos, agentes, balizamiento, vehículos | Explicación completa |

**Regla de calidad:** ninguna ficha se publica sin código, nombre, familia, significado, imagen y fuente. Las fichas B y C pueden tener menos prosa, pero no campos vacíos.

### 8.4. Pipeline de importación

1. **Auditoría de datos (F3.1):**
   - Extraer del BOE (RD 465/2025, anexo I) los códigos, nombres y definiciones.
   - Contrastar con el catálogo de la DGT y el “Manual I — Normas y señales”.
   - Crear `data/catalogo-senales.csv` y `data/catalogo-marcas.csv` con: código, nombre, familia, subfamilia, definición, forma, colores, archivo de imagen, fuente.
   - Revisar duplicados, códigos nuevos y códigos derogados.
2. **Imágenes (F3.2):**
   - Descargar SVG de Wikimedia Commons por código (≈747 archivos disponibles).
   - Para las señales sin SVG, dibujar un SVG propio simplificado (formas geométricas + pictograma básico) o usar un placeholder tipográfico con el código.
   - Para marcas viales, generar SVG esquemáticos propios (líneas, flechas, cebreado, inscripciones).
   - Generar `src/data/sign-credits.json` con autor, licencia y URL.
   - Informe de cobertura: `docs/cobertura-senales.md`.
3. **Generación de `.md` (F3.3):**
   - Script `scripts/import-catalog.mjs`: lee el CSV y genera `content/senales/{slug}.md` con frontmatter y cuerpo base.
   - No sobreescribe fichas con `curated: true`.
   - Normaliza slugs: `p-1`, `r-301`, `s-13`, `m-2-1`.
4. **Curaduría (F3.4–F3.5):**
   - 80 fichas A escritas a mano.
   - Revisión de las B/C generadas: significado claro, acción correcta, sin invenciones.
   - Añadir “errores típicos” y “relacionadas” en las familias con más confusiones.
5. **Índice y filtros (F3.6):**
   - `scripts/build-sign-index.mjs` genera `public/data/senales-index.json` con code, name, family, meaning, image, tier, new.
   - `/senales` usa un componente cliente `SignalExplorer` con búsqueda, chips de familia, filtro “nuevas 2025” y “cargar más” (60 por tanda).
   - Sin renderizar 441 tarjetas de golpe.
6. **Detalle (F3.7):**
   - 441 páginas estáticas con `generateStaticParams`.
   - Layout de dos columnas: SVG sticky + explicación.
   - “Qué debes hacer”, “Dónde”, “Error típico”, “Relacionadas”, “Fuente”.
7. **Extras (F3.8):**
   - Diagrama de jerarquía.
   - “Las 10 que más caen”.
   - “Nuevas señales 2025” con badge.
   - “Confusiones habituales” (pares de señales).
8. **QA (F3.9):**
   - 0 códigos duplicados.
   - 0 imágenes rotas.
   - 0 fichas sin significado.
   - Revisión aleatoria del 10 % de las B/C contra el BOE.

### 8.5. Plantilla de ficha

Cada señal debe responder a:

1. **Código y nombre oficial** (RD 465/2025).
2. **Familia, forma y colores.**
3. **Qué significa** en una frase.
4. **Qué debes hacer** al verla.
5. **Dónde aparece** y hasta dónde llega su efecto.
6. **Error típico de examen.**
7. **Señales relacionadas / confusiones.**
8. **Imagen SVG** con alt descriptivo y crédito.
9. **Fuente** (BOE / DGT).
10. **Micro-ejemplo** de situación real (nivel A).

### 8.6. Novedades del catálogo 2025

- Nuevas señales para **VMP** y usuarios vulnerables.
- Rediseño de pictogramas (ferrocarril, bicicleta, etc.).
- Nuevas señales de **carril** y **orientación**.
- Señales con **LED** para reforzar el mensaje.
- Marcas viales y señales de obra en **amarillo/naranja**.
- Entrada en el examen: **desde 01/10/2025**; cambio físico progresivo en carretera.

### 8.7. Imágenes y licencias

- **Fuente principal:** Wikimedia Commons, categorías de señales de tráfico de España.
- **Proceso:** `scripts/fetch-signs.mjs` consulta la API, descarga el SVG y guarda licencia/autor.
- **Alternativa:** SVG propios para las 25 señales más comunes y todas las marcas viales.
- **Página `/creditos`:** autor, licencia y enlace a cada archivo. Si una licencia exige compartir igual, se indica.
- **Nunca** usar capturas del PDF de la DGT como imágenes del sitio.

---

## 9. Páginas especiales

### 9.1. `/examen`
- Formato en 4 tarjetas: 30 preguntas, 30 min, 3 fallos, 2 años.
- Cómo es la pantalla, cómo se corrige, qué llevar, cómo pedir cita.
- Checklist del día anterior y del día del examen.
- FAQ: ¿puedo cambiar respuestas?, ¿qué pasa si suspendo?, ¿caduca el teórico?, ¿hay vídeos?
- Enlaces oficiales y aviso de que el formato puede cambiar.
- **Sin simulacro ni test propio.**

### 9.2. `/practico`
- Qué evalúa el examinador.
- 12 maniobras con checklist.
- Errores eliminatorios.
- Checklist del coche antes de salir.
- Enlaces a criterios oficiales y vídeos.

### 9.3. `/recursos`
- **Oficiales:** DGT, BOE, sede electrónica, manual en Lectura Fácil, fichas de seguimiento.
- **Didácticos:** Vialtest, PracticaTest, SacaCarnet, MyDGTTest, DGT Exam, Teoriko, Autoescuela Muzo.
- **Seguridad y primeros auxilios:** Cruz Roja, 112, RACE, Fundación Mapfre.
- **Tests externos:** se pueden enlazar, pero se marca claramente que no forman parte de la guía.
- Cada recurso con tipo, si es gratis, idioma y temas relacionados.
- Política: primero oficial; los independientes se marcan claramente; sin afiliados.

### 9.4. `/glosario`
- A–Z, buscador, definiciones breves, enlaces a temas.
- Ejemplos: MMA, tara, arcén, glorieta, aquaplaning, ADAS, VMP, SRI, ITV, eCall.

### 9.5. `/progreso`
- Temas completados y señales vistas.
- localStorage `permisoB.progress.v1`.
- Anillo de progreso en el nav.
- Botón “continuar”.
- Sin tests, sin puntuaciones.

### 9.6. `/buscar`
- Pagefind indexa temas, señales, glosario y recursos.
- Búsqueda instantánea, resultados con tipo y enlace.
- Atajo `Ctrl/Cmd + K`.

---

## 10. Arquitectura técnica

### 10.1. Stack

- **Next.js 16.4.6** (App Router, React 19, TypeScript estricto).
- **Static export** (`output: 'export'`) → `out/`.
- **CSS Modules + custom properties**.
- **Markdown** + `gray-matter` + `next-mdx-remote/rsc` + Zod.
- **Pagefind** para búsqueda.
- **Inter variable** self-hosted con `next/font/local`.
- **Sin Tailwind** (para mantener los tokens exactos).
- **Sin tests** (Vitest/Playwright solo para QA interno, no para el usuario).

### 10.2. Árbol de archivos

```
guia-licencia-web/
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── content/
│   ├── temas/
│   │   ├── 01-tipos-de-vehiculos.md
│   │   ├── ...
│   │   └── 17-mantenimiento.md
│   ├── senales/
│   │   ├── p-1.md
│   │   ├── r-301.md
│   │   ├── m-2-1.md
│   │   └── ...
│   ├── recursos/
│   └── glosario/
├── data/
│   ├── catalogo-senales.csv
│   ├── catalogo-marcas.csv
│   └── creditos.json
├── public/
│   ├── favicon.svg
│   ├── img/
│   │   ├── hero-road.webp
│   │   └── car-detail.webp
│   ├── senales/
│   │   ├── p-1.svg
│   │   └── ...
│   ├── marcas/
│   │   └── m-2-1.svg
│   └── data/
│       └── senales-index.json
├── scripts/
│   ├── import-catalog.mjs
│   ├── fetch-signs.mjs
│   ├── build-sign-index.mjs
│   ├── check-content.mjs
│   └── check-links.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── temario/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── senales/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── examen/page.tsx
│   │   ├── practico/page.tsx
│   │   ├── recursos/page.tsx
│   │   ├── glosario/page.tsx
│   │   ├── progreso/page.tsx
│   │   ├── buscar/page.tsx
│   │   ├── creditos/page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GlobalNav.tsx
│   │   │   ├── SubNav.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tile.tsx
│   │   │   ├── Callout.tsx
│   │   │   ├── KeyFacts.tsx
│   │   │   └── TableOfContents.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── ExamFacts.tsx
│   │   │   ├── TopicGrid.tsx
│   │   │   └── SignalFeature.tsx
│   │   ├── senales/
│   │   │   ├── SignalExplorer.tsx
│   │   │   ├── SignalCard.tsx
│   │   │   ├── SignalGrid.tsx
│   │   │   └── SignalDetail.tsx
│   │   └── progress/
│   │       ├── ProgressProvider.tsx
│   │       └── ProgressRing.tsx
│   ├── lib/
│   │   ├── content.ts
│   │   ├── schemas.ts
│   │   ├── catalog.ts
│   │   ├── seo.ts
│   │   └── constants.ts
│   └── data/
│       └── sign-credits.json
└── docs/
    ├── contenido.md
    ├── fuentes.md
    ├── cobertura-senales.md
    └── diseno.md
```

### 10.3. Configuración de Next.js

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
```

- `generateStaticParams` en `/temario/[slug]` y `/senales/[slug]`.
- `generateMetadata` por página.
- Componentes cliente solo donde haga falta: menú móvil, filtros, progreso, búsqueda.
- `next/font/local` para Inter; el resto del stack usa `system-ui` para resolver SF Pro en Apple.

### 10.4. Render de Markdown

```ts
// src/lib/content.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
```

- Leer `.md`, parsear frontmatter con `gray-matter`, validar con Zod.
- Renderizar cuerpo con `MDXRemote` (acepta Markdown puro; no hay JSX en el contenido).
- Cachear lecturas con `cache()` de React.
- Componentes personalizados para `blockquote` (callout), tablas y enlaces externos.

### 10.5. Rendimiento y SEO

- HTML estático; JS de cliente mínimo.
- 441 páginas de señal + 17 temas + páginas especiales; build estimado 2–5 min.
- Índice de señales: JSON + filtro cliente + “cargar más”; no renderizar 441 tarjetas de golpe.
- SVGs optimizados con SVGO; `loading="lazy"` y `decoding="async"`.
- Imágenes `srcset`/`sizes`, WebP/AVIF; hero eager + preload.
- `sitemap.xml`, `robots.txt`, canonical, Open Graph, Twitter Card.
- Datos estructurados `Course`/`FAQPage`/`BreadcrumbList`.
- Lighthouse objetivo: ≥95 en Performance, Accessibility, Best Practices y SEO.

### 10.6. Contenido y mantenimiento

- `docs/fuentes.md`: tabla de fuentes con fecha de última verificación.
- `docs/contenido.md`: inventario de temas y estado (A/B/C).
- `docs/cobertura-senales.md`: cuántas señales tienen SVG, cuántas son A/B/C, incidencias.
- `npm run check:content`: Zod + imágenes + duplicados.
- `npm run check:links`: enlaces externos con allowlist DGT/BOE.
- `npm run build`: `next build` + `pagefind --site out`.
- Revisión normativa: al menos cada 6 meses y tras cada BOE relevante.

---

## 11. Plan de tareas

> Estimación en “sesiones” de trabajo (1 sesión ≈ 2–3 h). Total: **13–17 sesiones**.

### Fase 0 — Preparación (0,5 sesión)

| ID | Tarea | Entregable | Criterio de aceptación |
|---|---|---|---|
| F0.1 | Crear carpeta y repo | `Proyectos/guia-licencia-web`, `git init` | `npm run dev` funciona |
| F0.2 | Scaffold Next.js 16 + TS + App Router | `package.json`, `next.config.ts`, `tsconfig.json` | `next build` vacío correcto |
| F0.3 | Tokens, fuentes y globals | `globals.css`, Inter local | Variables y tipografía aplicadas |
| F0.4 | README y docs base | `README.md`, `docs/fuentes.md` | Instrucciones claras |

### Fase 1 — Shell y sistema de diseño (1,5 sesiones)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F1.1 | `RootLayout`, `GlobalNav`, `Footer` | Layout base | Nav negra 44 px, footer pergamino |
| F1.2 | `SubNav` frosted y menú móvil | Navegación responsive | 360–1440 px sin scroll horizontal |
| F1.3 | Botones, cards, tiles, callouts | Componentes UI | Tokens, sin sombras indebidas |
| F1.4 | Home con 7 tiles | `app/page.tsx` | Secuencia y ritmo visual |
| F1.5 | Página 404 y estados vacíos | `not-found.tsx` | Diseño coherente |

### Fase 2 — Contenido: 17 temas (3–4 sesiones)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F2.1 | Esquema Zod y loader de contenido | `schemas.ts`, `content.ts` | Validación de frontmatter |
| F2.2 | `TopicLayout` + TOC + key facts | Layout de tema | Renderiza todo el frontmatter |
| F2.3 | Temas 1–4 | 4 `.md` | Contenido revisado y con fuentes |
| F2.4 | Temas 5–8 | 4 `.md` | Ídem |
| F2.5 | Temas 9–12 | 4 `.md` | Ídem |
| F2.6 | Temas 13–17 | 5 `.md` | Ídem |
| F2.7 | Índice `/temario` con filtros y progreso | `temario/page.tsx` | Grid responsive |
| F2.8 | Enlaces “para profundizar” por tema | Recursos relacionados | Mínimo 2 enlaces por tema |

### Fase 3 — Catálogo completo de señales (5–6 sesiones)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F3.1 | Auditoría del catálogo oficial | `data/catalogo-senales.csv`, `catalogo-marcas.csv` | 315 + ~126 filas; códigos y nombres contrastados |
| F3.2 | Descarga y generación de SVG | `public/senales/`, `public/marcas/`, `creditos.json` | ≥95 % con imagen; créditos completos |
| F3.3 | Script de importación a `.md` | 441 `.md` generados | Frontmatter válido, sin duplicados |
| F3.4 | 80 fichas nivel A | `.md` curados | Significado, acción, error, relacionadas |
| F3.5 | Revisión de niveles B y C | Fichas oficiales | Sin campos vacíos, sin invenciones |
| F3.6 | `/senales` con búsqueda, filtros y paginación | `SignalExplorer` | 441 entradas filtrables sin lag |
| F3.7 | 441 fichas de detalle | `/senales/[slug]` | SSG, SVG, fuente, relacionadas |
| F3.8 | Jerarquía, top 10 y novedades 2025 | Secciones | Diagrama y badges |
| F3.9 | QA de catálogo | `cobertura-senales.md` | 0 imágenes rotas, 0 códigos duplicados |

### Fase 4 — Páginas especiales (1–1,5 sesiones)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F4.1 | `/examen` | Página completa | Datos y FAQ; sin simulacro |
| F4.2 | `/practico` | Página completa | 12 maniobras + checklist |
| F4.3 | `/recursos` | Directorio | Tipos y enlaces |
| F4.4 | `/glosario` | A–Z | Buscador |
| F4.5 | `/creditos` + aviso legal | Página | Licencias y disclaimer |

### Fase 5 — Progreso y búsqueda (1 sesión)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F5.1 | Progreso localStorage | `ProgressProvider` | Persiste y se refleja en nav |
| F5.2 | Búsqueda Pagefind | `/buscar` + Ctrl+K | Resultados relevantes |
| F5.3 | Filtros de señales | `SignalExplorer` | Sin recarga, accesible |
| F5.4 | TOC con scroll spy | `TableOfContents` | Activo correcto |

### Fase 6 — QA y publicación (1–1,5 sesiones)

| ID | Tarea | Entregable | Criterio |
|---|---|---|---|
| F6.1 | QA responsive | Capturas 360/390/768/1024/1440 | Sin solapamientos |
| F6.2 | Auditoría a11y | Lighthouse + teclado + lector | ≥95 |
| F6.3 | QA de contenido | Revisión cruzada con BOE/DGT | 0 datos sin fuente |
| F6.4 | Check de enlaces | `check-links` | 0 enlaces rotos |
| F6.5 | SEO y OG | Metadatos por página | Vista previa correcta |
| F6.6 | Deploy | `out/` publicado | URL funcionando |

---

## 12. QA y criterios de aceptación

### 12.1. Responsive
- [ ] 360, 390, 768, 1024, 1440 px sin scroll horizontal.
- [ ] Nav móvil accesible y cerrable con Escape.
- [ ] Grids 5→4→3→2→1 columnas.
- [ ] Tipografía del hero 56→40→34→28 px.
- [ ] Padding de tile 80→48 px en móvil.
- [ ] Tablas con scroll horizontal controlado o cards en móvil.
- [ ] Catálogo de 441 señales fluido en móvil (paginación/carga progresiva).

### 12.2. Accesibilidad
- [ ] Contraste AA en texto y UI.
- [ ] Foco visible en todos los interactivos.
- [ ] Skip link.
- [ ] Landmarks y jerarquía de encabezados.
- [ ] `aria-label` en iconos y señales.
- [ ] `prefers-reduced-motion`.
- [ ] Búsqueda con label.
- [ ] Filtros operables con teclado y sin depender del color.

### 12.3. Contenido
- [ ] 17 temas completos, sin lorem ipsum.
- [ ] Cada tema con key facts, errores, fuentes y enlaces.
- [ ] **315 señales verticales** + **~126 marcas** + semáforos/agentes/balizamiento/vehículos.
- [ ] Cada ficha con código, nombre, familia, significado, imagen y fuente.
- [ ] 80 fichas nivel A con acción, error típico y relacionadas.
- [ ] Jerarquía de señales explicada.
- [ ] Novedades 2025 y RD 518/2026.
- [ ] Fechas de actualización visibles.
- [ ] Aviso de guía independiente.
- [ ] **Sin tests ni simulacros.**

### 12.4. Técnico
- [ ] `npm run build` sin errores y genera `out/`.
- [ ] `npm run check:content` sin errores.
- [ ] Lighthouse ≥95/95/95/95.
- [ ] JS de cliente < 100 KB en páginas de contenido.
- [ ] Imágenes optimizadas y con `width`/`height`.
- [ ] Sitemap, robots, canonical.
- [ ] 404 personalizada.
- [ ] Pagefind indexa correctamente.

### 12.5. Legal
- [ ] Créditos de todas las imágenes.
- [ ] Enlaces a BOE/DGT.
- [ ] Disclaimer claro.
- [ ] Sin cookies ni analítica por defecto.
- [ ] Sin texto, tablas o imágenes copiadas de Vialtest u otras webs.

---

## 13. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Errores al extraer 315 señales del BOE | Contenido incorrecto | Auditoría F3.1, revisión del 10 %, contraste con DGT |
| Falta de SVG para algunas señales | Fichas incompletas | SVG propio/placeholder + informe de cobertura |
| 441 fichas con texto de relleno | Mala calidad | Niveles A/B/C; A curada a mano; B/C con definición oficial |
| Build lento por 441 páginas | Desarrollo incómodo | SSG, cache, build incremental; aceptar 2–5 min |
| Índice de 441 tarjetas pesado | Mala UX | JSON + filtro cliente + “cargar más” |
| Cambio normativo durante el desarrollo | Contenido desactualizado | Fecha de corte, `docs/fuentes.md`, revisión semestral |
| Licencias de imágenes | Problema legal | Commons + créditos; SVG propio |
| Copia involuntaria de fuentes secundarias | Plagio | Política editorial, redacción propia, revisión |
| Diseño Apple poco legible en textos largos | Mala experiencia | Medida 720 px, body 17 px, TOC, jerarquía clara |
| Sin backend | No hay cuentas | localStorage; exportar/importar progreso (opcional) |
| Enlaces externos rotos | Mala experiencia | Script de comprobación trimestral |

---

## 14. Próximos pasos

1. Cambiar a modo Build para crear la carpeta y ejecutar F0–F1.
2. Validar el diseño de la home con una primera maqueta funcional.
3. Ejecutar F3.1 (auditoría del catálogo) antes de escribir las 441 fichas: es el punto de mayor riesgo.
4. Escribir los temas 1–4 y las primeras 10 señales nivel A.
5. Revisar con el usuario el tono, la densidad y el nivel de detalle antes de escalar.

---

## Anexo A — Enlaces didácticos candidatos (verificar antes de publicar)

| Recurso | Tipo | Uso |
|---|---|---|
| https://vialtest.com/manual-del-conductor/permiso-B | Teoría externa | Estructura de 17 temas y contraste |
| https://practicatest.com/temario/permiso-B | Tests/teoría | Refuerzo externo por temas |
| https://www.sacacarnet.com/temario | Teoría | Ruta de 7 bloques |
| https://mydgttest.com/examen-teorico-dgt | Guía | Formato y consejos |
| https://dgtexam.es/permisos/b/ | Tests externos | Práctica opcional |
| https://teoriko.com/guias/formato-completo-examen-teorico | Guía | Formato del examen |
| https://www.youtube.com/@AutoescuelaMuzo | Vídeo | Explicaciones de maniobras |
| https://www.youtube.com/@DGTes | Vídeo | Campañas y seguridad vial |
| https://www.cruzroja.es | Primeros auxilios | RCP y emergencias |
| https://www.race.es | Seguridad vial | Neumáticos, frenos, mantenimiento |
| https://www.fundacionmapfre.org | Educación vial | Material didáctico |

> No enlazar a páginas con muros de pago como si fueran gratuitas. Marcar `free: false` cuando corresponda. Los tests externos se presentan como recursos opcionales, no como parte de la guía.

## Anexo B — Changelog normativo que debe verse en la web

- **01/07/2025:** entra en vigor el RD 465/2025 (nuevo catálogo de señales).
- **01/10/2025:** las nuevas señales pueden aparecer en el examen teórico.
- **01/01/2026:** el V16 conectado es el único dispositivo legal de preseñalización.
- **01/10/2026:** entra en vigor el RD 518/2026 (usuarios vulnerables, normas urbanas, ciclistas).
- **01/10/2027:** obligaciones aplazadas (alumbrado diurno de VMP, casco homologado para ciclomotores).
- **En tramitación:** rebaja de la tasa de alcohol a 0,2 g/l; vídeos de percepción del riesgo en el teórico. **No vigente.**
