# Tareas pendientes

Backlog vivo. Ordenado por impacto. Cada tarea dice qué falta, por qué importa y
cómo se sabe que está hecha. Las que están bloqueadas lleva la nota «(pendiente
de X)».

## Prioridad 1 — contenido del catálogo de señales

| ID | Tarea | Hecho cuando |
|---|---|---|
| ~~T-01~~ | ~~Auditar el anexo del catálogo oficial del BOE~~ | **Hecho en la iteración 2**: 394 señales verticales extraídas del PDF del RD 465/2025 a `data/catalogo-oficial.json`. Las marcas viales siguen fuera (T-01b) |
| T-01b | Volcar el catálogo de marcas viales (documento aparte del BOE) | Códigos `M-x.y` con nombre y definición, y su propio dibujo esquemático |
| ~~T-02~~ | ~~Conseguir SVG con licencia y crédito~~ | **Hecho en la iteración 2**: `scripts/fetch-sign-images.mjs` descarga de Commons lo que existe y guarda autor y licencia en `data/creditos.json`. Queda T-02b |
| T-02b | Cotejar los SVG descargados con la edición 2025 del catálogo | Las señales rediseñadas usan el dibujo nuevo; las que no, lo indican |
| T-03 | Subir a nivel A las 80 señales más preguntadas (acción, error típico, relacionadas) | 80 fichas con nota curada; hoy hay 20 |
| T-04 | Añadir semáforos, agentes y balizamiento como entradas propias | Existen fichas de las tres categorías en `/senales` |

## Prioridad 2 — verificación editorial del temario

| ID | Tarea | Hecho cuando |
|---|---|---|
| T-05 | Revisar los 17 temas contra BOE/DGT y marcar `verified: true` | Los 17 tienen `verified: true` y `docs/fuentes.md` refleja la fecha de revisión |
| T-06 | Verificar las cifras que no están en `PLAN.md` y que escribieron los redactores (sanciones, puntos por infracción, intervalo de ITV, ratios de RCP, distancias de frenada) | Cada cifra tiene fuente citada en el tema o se ha eliminado |
| T-07 | Revisar el alcance exacto de la regla de 5 m a ciclistas en vía urbana y el régimen del carril de emergencia | Texto ajustado a la redacción del reglamento, sin paráfrasis dudosas |
| T-08 | Confirmar la numeración del título urbano del RD 518/2026 | La referencia es literal o no se cita |

## Prioridad 3 — calidad técnica

| ID | Tarea | Hecho cuando |
|---|---|---|
| T-09 | Añadir Playwright con el recorrido completo (inicio → tema → señal → progreso → búsqueda) | `npm run test:e2e` recorre el flujo en CI |
| T-10 | Medir Lighthouse y dejarlo ≥ 95/95/95/95 | Informe adjunto en `docs/estado.md` |
| T-11 | Añadir `npm run check:links` a la CI semanal | Workflow con `schedule` que falla si un enlace oficial desaparece |
| T-12 | Comprimir las imágenes y servir AVIF/WebP donde aplique | Hero con `srcset` y peso < 100 KB |
| T-13 | Incluir la auditoría del HTML construido en los checks | `scripts/check-build.mjs` verifica un solo `h1` por página, ausencia de `undefined`/`NaN` y que no haya enlaces internos muertos en `out/` (la comprobación se hizo a mano en la iteración 1 con 49 páginas y 0 problemas) |

## Prioridad 4 — producto

| ID | Tarea | Hecho cuando |
|---|---|---|
| T-14 | Exportar e importar el progreso en JSON | Botón que descarga y restaura el estado local |
| T-15 | Página «Novedades» con el changelog normativo completo | `/novedades` enlazada desde el footer |
| T-16 | Reducir la duplicación de cabeceras de sección en las páginas de contenido | Componente `SectionHeader` único |
| T-17 | Valorar Netlify/Vercel como despliegue alternativo documentado | Una sección del README con los pasos exactos |

## Pendiente de decisión del usuario

- Dominio propio (hoy se publica en GitHub Pages).
- Si se quiere alguna foto editorial real en la portada (hoy es ilustración propia
  para no arrastrar licencias).
