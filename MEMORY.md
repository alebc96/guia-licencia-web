# MEMORY.md

Memoria de trabajo de **Guía B**, la guía web del teórico del permiso B.
Este archivo es lo primero que hay que leer al retomar el proyecto. Lo demás
vive en `docs/` (estado, tareas, deuda técnica, fuentes, diseño, cobertura del
catálogo) y el plan original está en `PLAN.md`.

- **Última actualización:** 2026-11-22
- **Iteración actual:** 4 (producción en https://autoescuelaguide.com con Dokploy, progreso entre dispositivos, páginas legales y GA con consentimiento)
- **Documento de trabajo ODD:** `odd/tasks/guia-licencia-web.md`

---

## 1. Qué es y qué no es

Una web **estática** de estudio del teórico del permiso B (España): 17 temas,
catálogo de señales, páginas de examen y práctico, recursos, glosario y progreso
local. Todo el contenido vive en Markdown; no hay base de datos.

**No tiene**: backend, cuentas, simulacros, banco de preguntas ni traducciones.
La única cookie es la de Google Analytics, que solo se carga tras aceptar el
aviso de consentimiento (`src/lib/analytics.ts`, `NEXT_PUBLIC_GA_ID`). Cualquier petición de «login» o «resultados» queda
fuera de alcance por decisión del usuario.

---

## 2. Stack decidido (y por qué)

| Pieza | Decisión |
|---|---|
| Framework | Next.js 16.4.6, App Router, React 19.3.1, TypeScript estricto |
| Salida | `output: "export"` → `out/`, HTML estático, sin servidor Node en producción |
| Estilos | Un único `src/app/globals.css` con tokens + componentes (ver `docs/diseno.md`) |
| Contenido | Markdown + `gray-matter` + `next-mdx-remote/rsc` + Zod |
| Búsqueda | Pagefind, indexado después del build (`npm run build:search`) |
| Tests | Vitest 5 + Testing Library, más `npm run check:content` |
| Tipografía | Inter self-hosted en `src/fonts` (`next/font/local`); en Apple gana `-apple-system` (SF Pro) |
| Servidor de producción | Imagen Docker multi-etapa con nginx (puerto 8080) |
| Despliegue público | https://autoescuelaguide.com con Dokploy (autodeploy en push a `main`); GitHub Pages con GitHub Actions como copia secundaria |

El plan original (`PLAN.md`) pedía CSS Modules y «sin tests». Se cambió a un solo
archivo CSS global y a una suite real de pruebas porque el usuario pidió pruebas
por iteración. Las razones están en `docs/diseno.md` y en el Log del documento ODD.

---

## 3. Cómo se trabaja aquí

```bash
npm install          # una vez
npm run dev          # http://localhost:3000
npm test             # Vitest
npm run check:content # valida contenido, imágenes y enlaces internos
npm run check:signs   # detecta SVG/fichas desincronizados con data/senales.txt
npm run build         # build estático + índice de Pagefind en out/
```

Antes de cerrar cualquier cambio:

```bash
npm run verify        # test + check:signs + check:content
```

Docker:

```bash
docker compose up --build   # http://localhost:8080
```

### Regla de contenido

Todo dato se escribe desde la norma o desde una página oficial de BOE/DGT.
**Nunca se inventa un código, un nombre o un significado de señal.** Si un dato
no está verificado, la ficha se publica con `verified: false` y la web muestra
«Pendiente de verificar». Lo pendiente está en `docs/cobertura-senales.md`.

---

## 4. Mapa del repositorio

```
content/temas/      17 temas en Markdown (fuente de verdad del temario)
content/senales/    fichas de señales GENERADAS desde data/catalogo-oficial.json
content/recursos/   enlaces y fuentes
content/glosario/   términos
data/catalogo-oficial.json  catálogo del BOE (código, nombre, definición) — la fuente de verdad
data/senales.txt            capa curada: acción, error de examen y relacionadas (opcional, 14 columnas)
data/creditos.json          autor y licencia de cada SVG descargado de Commons
public/senales/     SVG esquemáticos GENERADOS
scripts/            extract-catalog, fetch-sign-images, generate-signs, check-content, check-links
src/app/            rutas (App Router)
src/components/     layout, contenido, señales, progreso, glosario, búsqueda
src/lib/            schemas (Zod), content (loaders), catalog, markdown, seo
tests/              Vitest: contenido, esquemas, catálogo, markdown, componentes
docs/               estado, tareas, deuda técnica, fuentes, diseño, cobertura
odd/tasks/          documento ODD de la feature
```

---

## 5. Trampas ya pagadas (no repetirlas)

1. **`next build` + `robots.ts`/`sitemap.ts`**: con `output: "export"` hay que
   declarar `export const dynamic = "force-static"` en esas rutas o el build
   falla al recolectar datos.
2. **Imágenes y despliegue en sub-path**: `NEXT_PUBLIC_BASE_PATH` se aplica a
   `next/link` automáticamente, pero **no** a `<img src>`. Todo `<img>` pasa por
   `publicUrl()` (`src/lib/constants.ts`).
3. **Pagefind solo existe después del build**. En `npm run dev` el buscador
   informa de que no hay índice; no es un bug.
4. **Las fichas de señales son generadas**: editar `content/senales/*.md` a mano
   se pierde en la siguiente ejecución de `npm run generate:signs`. Se edita
   `data/senales.txt` y se regenera.
5. **Progreso en `localStorage`**: el estado inicial es vacío y se hidrata en
   `useEffect`. No leer `localStorage` durante el render o la hidratación falla.
6. **Frontmatter con Zod**: los enums son en minúscula (`muy-alta`, `vehiculo`).
   El ejemplo de `PLAN.md` §6.1 está desactualizado.
7. **`next build` reescribe `tsconfig.json`** (jsx y el include de tipos). Es
   esperado; no revertirlo.
8. **Nunca volver a `next/font/google`**: `fonts.gstatic.com` da timeout en esta
   red y tumba todas las rutas de `dev` con un 500. Inter está vendorizada.
9. **Antes de cada push, `git status --short` tiene que estar vacío.** Los commits
   por superficie dejan fuera archivos de `src/` o `tests/` con facilidad; el CI
   corre los tests y un archivo sin commitear tumba el deploy entero (pasó dos
   veces: esquema Zod y test de contenido). El síntoma es Pages en 404.
10. **Dokploy no usa los `ARG` del `Dockerfile`**: construye por su cuenta y los
   valores por defecto no le llegan (por eso `canonical` y `sitemap.xml`
   apuntaron a `alebc96.github.io`). Cualquier valor de build necesario en
   producción debe tener fallback en el código o resolverse en runtime. Tras cada
   despliegue, comprobar el `canonical` y `/sitemap.xml`.
11. **`next dev` genera `AGENTS.md`** si no se desactiva; aquí está desactivado con
   `agentRules: false` porque la memoria del proyecto es `MEMORY.md`.

---

## 6. Estado real hoy

- Aplicación completa navegable: inicio, temario (17 temas), señales (catálogo completo del BOE),
  examen, práctico, recursos, glosario (49 términos), progreso, búsqueda, créditos, 404, y las
  páginas de acerca de, contacto, aviso legal, privacidad y cookies.
- 426 URL en el sitemap (páginas fijas, 17 temas y 394 señales), todas generadas como HTML estático.
- Catálogo de señales verticales **completo** desde el PDF oficial del BOE (RD
  465/2025, Tomo I): código, nombre y definición de cada señal. Las marcas viales
  y los paneles de orientación grandes quedan fuera de esta entrega.
- Progreso en `localStorage`, con enlace para llevarlo a otro dispositivo y botón
  «Seguir» hacia el último tema abierto.
- Google Analytics 4 solo tras aceptar el aviso de consentimiento.
- Suite de pruebas y checks de contenido en `npm run verify`.
- Producción: https://autoescuelaguide.com (Dokploy, despliegue automático al
  hacer push a `main`). Copia secundaria en GitHub Pages:
  https://alebc96.github.io/guia-licencia-web/
- `npm run dev` en http://localhost:3000.

## 7. Lo siguiente, en orden

1. Curar (nivel A) las señales más preguntadas: hoy solo 20 tienen nota de estudio.
2. Completar las imágenes: las que no tienen SVG en Commons usan pictograma propio.
3. Revisión editorial de los 17 temas contra BOE/DGT (`verified: true`).
4. Playwright para el recorrido completo y Lighthouse en CI.
5. Antes de activar AdSense: NIF y domicilio en el aviso legal, CMP de Google y
   quitar el lema «sin anuncios» (T-20 a T-22 en `docs/tareas.md`).
6. Revisión normativa semestral.
