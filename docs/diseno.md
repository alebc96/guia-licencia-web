> Nota: `docs/rediseno.md` sustituye partes de este documento (estilos, tipografía, temas, movimiento).

# Sistema de diseño

Implementa `PLAN.md` §5 («Apple adaptado»). Todo vive en
`src/app/globals.css`: tokens en `:root`, componentes como clases planas
(`.tile`, `.btn`, `.card`, `.sign-card`…). No hay Tailwind y no hay estilos en
línea salvo medidas puntuales de una página concreta.

## Tokens

- **Color**: un solo azul (`--color-primary: #0066cc`), lienzo blanco, pergamino
  `#f5f5f7`, perla `#fafafc`, tinta `#1d1d1f` y tres negros de tile. Los colores
  rojo/azul/amarillo de las señales están aislados en `--sign-*` y **no** se usan
  como acento de interfaz.
- **Tipografía**: escala de 15 pasos (`t-hero` 56 px … `t-fine` 12 px), pesos 400
  y 600, sin 500. Body a 17 px, medida de lectura 720 px.
- **Espaciado**: `--space-xxs` 4 px a `--space-section` 80 px.
- **Radios**: 5 / 8 / 11 / 18 / pill.
- **Sombra**: una sola (`--shadow-product`), reservada a la imagen de la señal.

## Componentes

`global-nav` (44 px negro), `sub-nav` (52 px frosted), `mobile-menu` (pantalla
completa), `footer` pergamino, `btn` en cinco variantes, `tile` en cuatro fondos,
`card`, `callout`, `keyfacts`, `toc`, `sign-card`, `sign-figure`, `badge`, `chip`,
`search-input`, `progress-bar`, `progress-ring`, `progress-toggle`, `glossary`,
`search-results`.

## Responsive

| Rango | Cambios |
|---|---|
| ≤ 419 px | una columna, hero 28 px, key facts a una columna |
| 420–833 px | hero 40 px, grids a una columna, tiles con 48 px de padding, menú hamburguesa |
| ≥ 736 px | nav completa, tres columnas y footer de tres columnas |
| ≥ 834 px | hero a dos columnas, TOC sticky, ficha de señal a dos columnas |
| ≥ 1024 px | catálogo a cuatro columnas |
| ≥ 1441 px | el contenedor se queda en 1440 px |

Nunca hay scroll horizontal: las tablas de la prosa usan `display: block` con
`overflow-x: auto`.

## Accesibilidad

`lang="es"`, skip link, un solo `h1` por página, `:focus-visible` con outline de
2 px y offset 2 px, `aria-current="page"` en la navegación, `aria-pressed` en los
chips y toggles, `role="status"` con `aria-live="polite"` para los contadores de
resultados, `prefers-reduced-motion`, `aria-label` completo en cada SVG de señal y
`<caption>`/`<th scope>` en las tablas.

## Decisiones que se apartan de `PLAN.md`

| Plan | Implementado | Motivo |
|---|---|---|
| CSS Modules | Un único `globals.css` | 30 tokens compartidos: un archivo evita duplicarlos y mantiene una sola fuente de verdad. Ver DT-02 |
| «Sin tests» | Vitest + checks de contenido | El usuario pidió pruebas por iteración (S4) |
| Inter self-hosted | `next/font/google` | Menos archivos versionados; el build sigue necesitando red (DT-06) |
| Top nav con «anillo de progreso» separado | Anillo integrado en el enlace a `/progreso` | Menos ruido visual y un solo destino |
| Página `/buscar` con Ctrl+K | `/buscar` accesible desde la nav | El atajo global se pospone: hoy no hay componente de diálogo |

## Ajustes de la revisión de diseño (iteración 2)

El usuario rechazó tres patrones que se habían extendido por todas las páginas
porque abarataban el resultado:

1. **Eyebrow sobre cada titular** («Prueba de circulación», «Vocabulario»,
   «Catálogo»…). Fuera. El titular solo, sin subtítulo de relleno. La única
   excepción es la línea de identidad del hero.
2. **Contadores en las cabeceras de sección** («20 enlaces», «Fichas por
   familia: …»). Fuera: el número no aporta al lector y parece relleno.
3. **Fila de etiquetas bajo el título** («12 min de lectura», «Peso Media»,
   «Actualizado…», «Contenido pendiente de revisión»). Fuera. En la ficha del
   tema queda una sola línea en cuerpo pequeño: «Tema 10 de 17 · 11 min de
   lectura».

Regla general que se deriva de esto: **si un dato no cambia lo que el lector
hace, no se muestra**. Y si hay que mostrarlo, va en texto corrido, no en una
etiqueta.

## Reglas para futuras pantallas

1. No añadir un segundo color de marca: la jerarquía se hace con tipografía y
   espacio, no con color.
2. Nada de sombras en tarjetas, botones o texto.
3. Las acciones se expresan con pill; las utilidades densas con `btn-dark`.
4. Cualquier valor nuevo se convierte primero en token.
5. Cada componente nuevo entra con su clase en `globals.css`, no con estilos en
   línea.
6. Nada de `eyebrow` ni de `badge` decorativos: solo se admite el badge que
   comunica un estado real (por ejemplo, una norma en tramitación).
