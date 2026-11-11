# Feature — Guía web del permiso B (Next.js)

Guía de estudio estática, responsive y accesible para el teórico del permiso B, construida con Next.js 16 y exportación estática, con contenido en Markdown como fuente de verdad.
Fuente de diseño y de contenido: `PLAN.md` (plan de investigación previo del usuario).
Estado: iteración 1 completada (aplicación, contenido, pruebas, Docker, despliegue). Iteración 2 = catálogo completo.
Sustitución de spec: la decisión «sin tests» de `PLAN.md` queda anulada por S4.

## Specs

- **S1.** «quiero seguir con el plan que tengo de hacer una web con next, con los estilos y todo»: implementar la web descrita en `PLAN.md` con Next.js 16 (App Router, TypeScript, exportación estática) y el sistema de diseño Apple adaptado de `PLAN.md` §5 (tokens, tipografía, componentes, responsive, accesibilidad).
- **S2.** «quiero que crees un MEMORY.md donde dejar registo de lo mas importante»: crear `MEMORY.md` en la raíz del repositorio con las decisiones, el estado, las trampas y lo que hay que saber para retomar el trabajo.
- **S3.** «me registras en documentos los cambios hechos, tareas por hacer, cosas pendientes, deudas tecicas»: dejar registrado en `docs/` el historial de cambios, las tareas pendientes, lo que queda bloqueado y la deuda técnica, actualizado al cerrar cada iteración.
- **S4.** «Importante debemos tener pruebas para cada iteracion como ya funciona con odd esto no sera problema»: cada iteración incluye pruebas automáticas ejecutables (`npm test`) y un check de contenido; ninguna tarea se marca hecha sin sus pruebas en verde. Esta spec sustituye la decisión «sin tests» de `PLAN.md`.
- **S5.** «la web es solo una guia no necesita credenciales ni nada, es solo un tmeario par aprender»: sin backend, sin cuentas, sin base de datos, sin cookies ni analítica; todo estático y el progreso se guarda solo en `localStorage`.
- **S6.** «quiero que crees un repo en mi github y lo subas todo ahi»: crear el repositorio en la cuenta de GitHub del usuario (`alebc96`), con el historial de commits y el contenido completo subido.
- **S7.** «quiero que lo pongas penado en desplegar en algun sitio como netlify o algo por el estilo»: dejar la web desplegada y accesible por URL pública, con despliegue automatizado desde el repositorio.
- **S8.** «monta tambien una imagen de docker con la web»: `Dockerfile` multi-etapa que construye y sirve la web, con `docker-compose.yml` y prueba de arranque del contenedor.
- **S9.** «no tomare decisiones te quedas en segundo plano»: el agente decide el alcance, el stack y las herramientas y ejecuta de punta a punta sin pedir aprobación intermedia.

## Tasks

| ID | Tarea | Specs | Ruta | Commit |
|---|---|---|---|---|
| T1 | Repositorio, scaffold Next.js 16 + TypeScript, configuración de exportación estática y arnés de pruebas | S1, S4 | inline | `a212d76` |
| T2 | Sistema de diseño: tokens, tipografía, base CSS, componentes UI | S1 | inline | `493caa0` |
| T3 | Shell: layout raíz, nav global, sub-nav, menú móvil, footer, 404 | S1 | inline | `493caa0` |
| T4 | Modelo de contenido: esquemas Zod, cargadores, SEO, tabla de contenidos | S1, S4 | inline | `b18710d` |
| T5 | Contenido de los 17 temas del temario | S1 | writer | `4e73f12` |
| T6 | Catálogo de señales: datos, generador de SVG, índice y fichas | S1 | inline | `0cb55e9` |
| T7 | Páginas especiales: /examen, /practico, /recursos, /glosario, /creditos | S1 | inline | `a4b31fe` |
| T8 | Progreso en localStorage y búsqueda con Pagefind | S1, S5 | inline | `a4b31fe` |
| T9 | Pruebas automáticas de cada unidad y check de contenido | S4 | inline | `026a631` |
| T10 | Documentación: MEMORY.md, estado, tareas, deuda técnica, fuentes, diseño | S2, S3 | inline | `18d691a` |
| T11 | Imagen Docker + compose + prueba de arranque | S8 | inline | `472de1c` |
| T12 | Repositorio en GitHub, push y despliegue público automatizado | S6, S7 | inline | `472de1c` |

## Log

- **L1.** «quiero seguir con el plan que tengo de hacer una web con next, con los estilos y todo, ademas quiero que crees un MEMORY.md donde dejar registo de lo mas importante. me registras en documentos los cambios hechos, tareas por hacer, cosas pendientes, deudas tecicas. Importante debemos tener pruebas para cada iteracion como ya funciona con odd esto no sera problema. Toma las deciciones tu totalmente, la web es solo una guia no necesita credenciales ni nada, es solo un tmeario par aprender, quiero que crees un repo en mi github y lo subas todo ahi, ademas quiero que lo pongas penado en desplegar en algun sitio como netlify o algo por el estilo»
- **L2 (corrección de alcance).** «no tomare decisiones te quedas en segundo plano, monta tambien una imagen de docker con la web» → añade S8 (Docker) y S9 (autonomía total).
- **L3 (corrección de alcance).** «la levantas en local» → la web debe quedar corriendo en local, no solo compilada.
- **Decisión D1 (derivada de S4).** `PLAN.md` decidía «sin tests». El usuario pide pruebas por iteración: Vitest para lógica, esquemas, catálogo y componentes, más `scripts/check-content.mjs` como check de contenido en cada iteración.
- **Decisión D2 (derivada de S7).** Destino de despliegue: **GitHub Pages** mediante GitHub Actions, porque `output: 'export'` ya produce un sitio estático y la cuenta de `gh` está autenticada: no hace falta ningún token nuevo. Netlify/Vercel quedan documentados como alternativa de una línea en el README. La imagen Docker cubre el despliegue autoalojado.
- **Decisión D3 (derivada de S1).** Versiones fijadas a las verificadas en `PLAN.md` §2: `next@16.4.6`, `next-mdx-remote@6.0.0`, `pagefind@1.6.0`, `zod@4.6.7`, React 19.
- **Decisión D4 (alcance de la iteración 1).** El catálogo completo (315 señales verticales + ~126 marcas, tarea F3 del plan) exige auditar el catálogo oficial y descargar/curar imágenes: es el mayor riesgo del proyecto. La iteración 1 entrega la infraestructura completa (datos → `.md` → SVG generado → páginas) y un conjunto curado de señales frecuentes; el resto queda como tarea pendiente con su pipeline ya probado.
- **Decisión D5 (derivada de S5).** Sin cookies, sin analítica, sin tipografías ni servicios externos en tiempo de ejecución: todo se sirve desde el propio dominio estático.
