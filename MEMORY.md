# MEMORY.md

Memoria de trabajo de **Guía B**, la guía web del teórico del permiso B.
Este archivo es lo primero que hay que leer al retomar el proyecto. Lo demás
vive en `docs/` (estado, tareas, deuda técnica, fuentes, diseño, cobertura del
catálogo) y el plan original está en `PLAN.md`.

- **Última actualización:** 2026-11-11
- **Iteración actual:** 1 (aplicación completa, catálogo inicial, Docker, despliegue)
- **Documento de trabajo ODD:** `odd/tasks/guia-licencia-web.md`

---

## 1. Qué es y qué no es

Una web **estática** de estudio del teórico del permiso B (España): 17 temas,
catálogo de señales, páginas de examen y práctico, recursos, glosario y progreso
local. Todo el contenido vive en Markdown; no hay base de datos.

**No tiene**: backend, cuentas, cookies, analítica, simulacros, banco de
preguntas ni traducciones. Cualquier petición de «login» o «resultados» queda
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
| Tipografía | Inter vía `next/font/google`; en Apple gana `-apple-system` (SF Pro) |
| Servidor de producción | Imagen Docker multi-etapa con nginx (puerto 8080) |
| Despliegue público | GitHub Pages con GitHub Actions (sin tokens extra) |

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
content/senales/    fichas de señales GENERADAS desde data/senales.txt
content/recursos/   enlaces y fuentes
content/glosario/   términos
data/senales.txt    tabla maestra de señales (14 columnas separadas por |)
public/senales/     SVG esquemáticos GENERADOS
scripts/            generate-signs.mjs, check-content.mjs, check-links.mjs
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

---

## 6. Estado real hoy

- Aplicación completa navegable: inicio, temario (17 temas), señales (19 fichas),
  examen, práctico, recursos, glosario (49 términos), progreso, búsqueda, créditos, 404.
- 50 páginas estáticas generadas correctamente.
- Catálogo **incompleto a propósito**: 19 de ~441 entradas. Es la parte que exige
  auditoría del catálogo oficial (`docs/cobertura-senales.md`).
- Suite de pruebas y checks de contenido en `npm run verify`.
- Imagen Docker y despliegue en GitHub Pages.

## 7. Lo siguiente, en orden

1. Ampliar el catálogo de señales con la auditoría del anexo del BOE (nivel A/B/C).
2. Sustituir los pictogramas esquemáticos por SVG con licencia y crédito.
3. Revisión editorial de los 17 temas contra BOE/DGT (`verified: true`).
4. Playwright para el recorrido completo y Lighthouse en CI.
5. Revisión normativa semestral.
