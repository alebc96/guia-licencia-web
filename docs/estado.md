# Estado del proyecto

Registro de qué se ha hecho, iteración por iteración. Lo que falta está en
`docs/tareas.md`; lo que está mal o es frágil, en `docs/deuda-tecnica.md`.

---

## Iteración 2 — 2026-11-11

**Objetivo:** dos cosas pedidas tras ver la iteración 1: quitar el ruido visual y
llenar de verdad el catálogo de señales.

### Catálogo completo desde el BOE

- Localizado el catálogo oficial en PDF (RD 465/2025, Tomo I) y extraído con
  `pdftotext` + `scripts/extract-catalog.mjs`: **394 señales** con código, nombre
  y definición literal del BOE en `data/catalogo-oficial.json`.
- `scripts/generate-signs.mjs` reescrito: ahora combina el catálogo oficial con
  la capa curada de `data/senales.txt` y genera una ficha por señal.
- `scripts/fetch-sign-images.mjs`: descarga los SVG de Wikimedia Commons con
  crédito (autor, licencia y página de origen) en `data/creditos.json`; usa `curl`
  espaciado porque `upload.wikimedia.org` responde 429 a las ráfagas.
- Cuando no hay imagen disponible se genera un pictograma esquemático propio, y
  la ficha lo declara.
- Wikimedia exige un User-Agent descriptivo con contacto: con uno genérico
  responde 429 y el fichero descargado es una página de error HTML. El script
  valida que el contenido empiece por `<svg`/`<?xml` y borra lo que no lo cumpla.
- Resultado del arte: **286 fichas con SVG de Wikimedia Commons** (autor y licencia
  en `data/creditos.json`) y **108 con pictograma esquemático propio**. El
  catálogo de `/senales` pagina de 48 en 48 para no pedir 394 imágenes de golpe.
- El esquema Zod hace opcionales `action`, `where` y `mistake`: una ficha sin nota
  curada enseña solo lo que dice la norma, sin relleno inventado.

**Corrección importante detectada al cruzar la capa curada con el catálogo
oficial:** seis fichas curadas apuntaban a códigos equivocados.

| Código | Lo que decía la ficha curada | Nombre oficial |
|---|---|---|
| P-1 | «Cruce de vías» | Intersección con prioridad |
| R-108 | «Entrada prohibida a bicicletas» | Mercancías peligrosas |
| S-3 | «Entrada a autovía» | Vía reservada para automóviles |
| S-4 | «Fin de autovía» | Fin de vía reservada para automóviles |
| S-7 | «Entrada a poblado» | Velocidad máxima aconsejada |
| S-8 | «Fin de poblado» | Fin de velocidad máxima aconsejada |

Se reancló la capa curada a los códigos correctos (P-2, R-114, R-118, S-1a, S-2a,
S-500, S-510) y se documentó la trampa en `MEMORY.md`: **nunca curar una fila sin
comprobar el nombre oficial**.

### Limpieza de diseño

Pedido textual: los subtítulos de sección, los contadores y la fila de etiquetas
bajo el título sobran.

- Fuera el `eyebrow` de todas las secciones (solo queda la línea de identidad del
  hero).
- Fuera contadores («20 enlaces», «Fichas por familia», «12 fichas publicadas»).
- Fuera la fila de etiquetas del tema; en su lugar una línea de texto pequeño con
  «Tema 10 de 17 · 11 min de lectura».
- Fuera las etiquetas del catálogo y del práctico.
- Fuera el botón «Tema 8» de la cabecera de `/senales`.
- Las tarjetas de tema dejan de mostrar «Fundamentos · 12 min · Peso Media».

---

## Iteración 1 — 2026-11-11

**Objetivo:** aplicación completa sobre Next.js con el sistema de diseño de
`PLAN.md`, contenido de los 17 temas, catálogo inicial de señales, pruebas,
Docker y despliegue público.

### Cambios hechos

**Infraestructura y configuración**
- Proyecto Next.js 16.4.6 + React 19.3.1 + TypeScript estricto con
  `output: "export"`, `trailingSlash: true` y soporte de `NEXT_PUBLIC_BASE_PATH`
  para desplegar bajo un sub-path (GitHub Pages).
- `tsconfig.json` (estricto, `noUncheckedIndexedAccess`), `vitest.config.ts`,
  `.nvmrc`, `.gitignore`, `.dockerignore`.
- `package.json` con scripts `dev`, `build`, `build:search`, `test`,
  `check:content`, `check:links`, `generate:signs`, `check:signs` y `verify`.

**Sistema de diseño**
- `src/app/globals.css` (≈1.470 líneas): tokens de color, tipografía, espaciado,
  radios y sombra única; reset; escala tipográfica; botones; tiles; tarjetas;
  nav global y sub-nav; footer; prosa Markdown; callouts; key facts; TOC;
  tarjetas y fichas de señal; formularios; progreso; glosario y responsive
  (360 → 1440 px) con `prefers-reduced-motion`.
- Tipografía Inter con `next/font/google` y fallback a `-apple-system` (SF Pro en
  Apple), `system-ui` en el resto.

**Shell y navegación**
- `RootLayout` con `lang="es"`, skip link, landmarks, `ProgressProvider` y footer.
- `GlobalNav` de 44 px negro con marca, enlaces de sección, buscador, anillo de
  progreso y menú móvil.
- `MobileMenu` accesible: cierra con Escape, bloquea el scroll de fondo y se
  cierra al cambiar de ruta.
- `SubNav` frosted de 52 px por sección.
- `Footer` pergamino con columnas, aviso de guía independiente y fecha.

**Modelo de contenido**
- `src/lib/schemas.ts`: esquemas Zod de tema, señal, recurso y glosario, con
  validación de slug, fechas ISO, URLs absolutas y códigos de señal.
- `src/lib/content.ts`: cargadores memoizados con errores que indican archivo y
  campo.
- `src/lib/markdown.ts`: extracción de encabezados y slugs para el TOC.
- `src/lib/catalog.ts`: normalización sin acentos, filtros, orden por familia y
  código, conteos y señales relacionadas.
- `src/lib/seo.ts`: metadatos con canonical, Open Graph y Twitter.

**Páginas**
- `/` con siete bloques: hero, el examen en 30 segundos, ruta de 17 temas,
  catálogo de señales, práctico, changelog normativo y cierre.
- `/temario` y `/temario/[slug]` (17 temas con TOC con scroll spy, key facts,
  errores típicos, fuentes, navegación anterior/siguiente y marca de leído).
- `/senales` (jerarquía de señales, filtros y buscador cliente) y
  `/senales/[slug]` (ficha con datos, ficha técnica, relacionadas y repaso).
- `/examen` (formato, día del examen, FAQ, normativa), `/practico` (12 maniobras y
  puntuación), `/recursos`, `/glosario` (buscador), `/progreso`, `/buscar`,
  `/creditos` y `not-found`.
- `sitemap.xml` y `robots.txt` generados en el build.

**Contenido**
- 17 temas completos (≈900–1000 palabras cada uno) con frontmatter validado,
  cinco secciones fijas, tabla comparativa, casos prácticos, errores típicos y
  fuentes oficiales.
- 19 fichas de señales generadas desde `data/senales.txt` con su SVG esquemático.
- 20 recursos (BOE, DGT, Cruz Roja, RACE) y 49 términos de glosario.

**Pruebas y verificación**
- `scripts/check-content.mjs`: cobertura de temas, secuencia de `order`, secciones
  obligatorias, códigos duplicados, imágenes existentes, recursos y enlaces
  internos.
- `scripts/generate-signs.mjs --check`: detecta fichas o SVG desincronizados con
  la tabla maestra.
- Suite de Vitest: contenido real, esquemas Zod, catálogo, markdown y componentes
  (progreso y explorador de señales).

**Distribución**
- `Dockerfile` multi-etapa (node → nginx), `docker/nginx.conf` con gzip, cachés y
  cabeceras de seguridad, `docker-compose.yml` con healthcheck en el puerto 8080.
- Workflow de GitHub Pages y workflow de imagen Docker en GHCR.

### Verificación observada

| Check | Resultado |
|---|---|
| `npx next build` | 50 páginas estáticas sin errores |
| `node scripts/generate-signs.mjs --check` | 19 señales sincronizadas |
| `node scripts/check-content.mjs` | 17 temas, 19 señales, 20 recursos, 49 términos |
| `npm test` | 6 archivos, 85 pruebas en verde |
| `docker compose up --build` | imagen nginx en el puerto 8080 con healthcheck |
| `gh run` (Pages) | despliegue publicado en https://alebc96.github.io/guia-licencia-web/ |

### Incidencia resuelta durante la iteración

`next/font/google` dejó de poder descargar Inter (`fonts.gstatic.com` daba
timeout) y todas las rutas del servidor de desarrollo respondían 500. Se vendorizó
la fuente en `src/fonts` con `next/font/local` y su licencia OFL, lo que además
cierra la deuda DT-06 y hace que build y dev funcionen sin red.

### Lo que no se hizo (y por qué)

- **Catálogo completo (441 fichas).** Requiere auditar el anexo del catálogo
  oficial señal por señal y resolver las imágenes con licencia. Publicar códigos
  sin verificar habría violado la regla editorial del plan. Ver
  `docs/cobertura-senales.md`.
- **Playwright y Lighthouse en CI.** Se añaden en la iteración 2, cuando el
  catálogo tenga volumen suficiente para que el recorrido aporte.
- **ESLint.** Se dejó fuera para no mezclar un cambio de tooling con la primera
  entrega funcional; queda como deuda DT-01.
