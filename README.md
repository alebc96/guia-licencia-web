# Guía B — web del teórico del permiso B

Guía de estudio **estática** del teórico del permiso B (España): 17 temas,
catálogo de señales, examen, práctico, recursos, glosario y progreso local.
Sin backend, sin cuentas, sin cookies y sin analítica.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · exportación estática
- **Contenido:** Markdown + Zod como fuente de verdad
- **Búsqueda:** Pagefind (índice generado tras el build)
- **Pruebas:** Vitest + checks de contenido
- **Distribución:** GitHub Pages e imagen Docker con nginx

## Empezar

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npm test              # suite de Vitest
npm run check:content # contenido, imágenes y enlaces internos
npm run check:signs   # fichas y SVG sincronizados con data/senales.txt
npm run verify        # test + check:signs + check:content
npm run build         # HTML estático en out/ + índice de Pagefind
npm run start         # sirve out/ en http://localhost:3000
```

> La búsqueda de `/buscar` solo funciona sobre el sitio compilado (`npm run build`),
> porque Pagefind indexa `out/`.

## Docker

```bash
docker compose up --build   # http://localhost:8080
```

La imagen es multi-etapa: compila con Node 22 y sirve `out/` con nginx en el
puerto 8080, con gzip, cachés por tipo de recurso, cabeceras de seguridad y
healthcheck en `/`.

```bash
docker build -t guia-licencia-web .
docker run --rm -p 8080:8080 guia-licencia-web
```

## Despliegue

### GitHub Pages (por defecto)

`.github/workflows/deploy-pages.yml` compila y publica en cada push a `main`.
Como es un *project site*, el sitio vive en `/<repositorio>/`, y eso se resuelve
con `NEXT_PUBLIC_BASE_PATH`:

```
NEXT_PUBLIC_BASE_PATH=/guia-licencia-web
NEXT_PUBLIC_SITE_URL=https://alebc96.github.io
```

Activa Pages en **Settings → Pages → Source: GitHub Actions**.

### Netlify o Vercel (alternativa)

El sitio es estático; basta con:

- Build command: `npm run build`
- Publish directory: `out`
- Node 22
- Sin variables de entorno (se sirve en la raíz del dominio)

### Cualquier servidor

Sube el contenido de `out/` a un servidor web. Todas las rutas usan
`trailingSlash: true`, así que cada ruta es un directorio con su `index.html`.

## Estructura

```
content/        temas, señales, recursos y glosario en Markdown
data/           data/senales.txt: tabla maestra del catálogo
public/         imágenes, favicon y SVG de señales generados
scripts/        generación de señales y checks de contenido
src/app/        rutas (App Router)
src/components/ layout, contenido, señales, progreso, glosario, búsqueda
src/lib/        esquemas Zod, cargadores, catálogo, markdown, SEO
tests/          Vitest
docs/           estado, tareas, deuda técnica, fuentes, diseño, cobertura
odd/tasks/      documento ODD de la feature
PLAN.md         plan original de investigación y diseño
MEMORY.md       memoria de trabajo del proyecto
```

## Autoría de contenido

- **Temas:** se editan a mano en `content/temas/*.md`. El frontmatter se valida
  con Zod al cargar y con `npm run check:content`.
- **Señales:** se editan en `data/senales.txt` y se regeneran con
  `npm run generate:signs`. Editar `content/senales/*.md` a mano se pierde.
- **Regla editorial:** ningún código, nombre o significado se inventa. Si un dato
  no está verificado, la ficha queda con `verified: false` y la web lo muestra.

## Estado y trabajo pendiente

- Estado de la última iteración: `docs/estado.md`
- Backlog: `docs/tareas.md`
- Deuda técnica aceptada: `docs/deuda-tecnica.md`
- Fuentes y datos por verificar: `docs/fuentes.md`
- Cobertura del catálogo: `docs/cobertura-senales.md`
- Sistema de diseño: `docs/diseno.md`
- Memoria del proyecto: `MEMORY.md`

## Aviso

Guía independiente. No es una publicación oficial de la Dirección General de
Tráfico y no sustituye a la formación de una autoescuela.
