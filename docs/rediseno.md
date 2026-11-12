# Rediseño «Estudio» — sistema de estilos v2

Sustituye a `src/app/globals.css` por SCSS modular en `src/styles/`. **Todos los
nombres de clase anteriores se conservan**: el JSX existente funciona sin cambios.

## Principios

1. **La página es para estudiar.** La marca vive en cabeceras, botones y tarjetas;
   la prosa del tema está quieta, ancha de interlineado y sin animaciones.
2. **Accesible por defecto.** Cuerpo AAA (≥ 7:1) en los tres temas, secundarios AA,
   bordes de control ≥ 3:1. Lo comprueba `npm run check:contrast`.
3. **Movimiento con propósito.** Animaciones cortas, curva *expo out*, recorridos
   ≤ 24 px. Se apagan con `prefers-reduced-motion` y en el modo Lectura.
4. **CSS antes que JS.** Scroll, barra de lectura, sombras de la nav, estado
   "leído" de las tarjetas y pastilla del selector: todo CSS nativo.

## Estructura

```
src/styles/
  main.scss                 punto de entrada (importado en layout.tsx)
  abstracts/_tokens.scss    escala tipográfica, espacios, radios, sombras, curvas
  abstracts/_mixins.scss    up()/down(), motion-ok, scroll-reveal, focus-ring, glass…
  themes/_palettes.scss     colores de claro / oscuro / lectura (mapas Sass)
  themes/_themes.scss       custom properties, data-theme, tamaño de texto
  base/                     reset, tipografía, accesibilidad (forced-colors, print)
  layout/                   contenedores, bandas, hero, nav, sub-nav, pie
  components/               botones, tarjetas, prosa, controles, señales, ajustes
  motion/_keyframes.scss    biblioteca de animaciones
```

## Tipografía

| Uso | Fuente | Por qué |
|---|---|---|
| Titulares, cifras, UI | Inter (ya vendorizada) | Compacta y neutra, lectura "Apple" |
| Texto | **Atkinson Hyperlegible Next** | Diseñada por el Braille Institute para baja visión: I/l/1 y O/0 inconfundibles (el 0 lleva barra a propósito) |
| Modo Lectura | **Literata** | Serif de pantalla para sesiones largas; no se precarga |

Las tres son SIL OFL 1.1 (uso comercial libre). Licencias en `src/fonts/`.

- Escala fluida en `rem` (respeta el tamaño de letra del navegador; antes era px).
- Cuerpo 17→19 px, prosa con interlineado 1.78 (1.85 en Lectura), medida 68 ch
  (62 ch en Lectura), separación entre párrafos 1.15 em, tracking +0.006 em.
- Nada por debajo de 13 px. Titulares con `text-wrap: balance`, párrafos `pretty`.
- En la prosa, `strong` lleva subrayado de rotulador amarillo: "esto cae en el examen".

## Temas

`<html data-theme="light|dark|reading">`. Sin atributo, sigue al sistema.
`<html data-text-size="s|l|xl">` escala todo el texto (0.92 / 1.12 / 1.25).
Un script en `<head>` aplica la preferencia guardada antes del primer pintado.

- **Claro:** blanco + gris niebla, azul señal `#0a57c9`, amarillo carril `#ffc629`.
- **Oscuro:** `#0d0f13` (no negro puro), texto `#eceef1`, peso óptico −20.
- **Lectura:** papel `#f6efe0`, tinta `#2b251c`, enlaces sepia, Literata, sin animaciones.

El amarillo nunca se usa como color de texto en claro: para texto de marca existe
`--accent-ink`.

## Movimiento

| Efecto | Técnica |
|---|---|
| Tarjetas y titulares entran al hacer scroll | `animation-timeline: view()` |
| Barra de progreso de lectura | `animation-timeline: scroll(root)` en `.reading-progress` |
| La nav gana filo y sombra al bajar | `scroll(root)` con rango 0–120 px |
| Línea de carril de la cabecera avanza | `scroll(root)` sobre `background-position` |
| Botones: elevación, brillo, flecha, pulsación | transiciones + `::before` |
| "Marcar como leído": relleno + check dibujado | `stroke-dashoffset` + keyframe `pop` |
| Cambio de tema: revelado circular | View Transitions API |
| Panel de ajustes | API Popover + `@starting-style` |

Todo es mejora progresiva: sin soporte, el contenido aparece en su estado final.

## Iconos

Recomendación: **Lucide** (licencia ISC, uso comercial sin atribución, mismo trazo
24 px que los iconos actuales). Para usarlo como dependencia: `npm i lucide-react`
y sustituir `src/components/ui/icons.tsx` por imports
(`import { Sun } from "lucide-react"`); solo se empaquetan los iconos importados.
De momento los cuatro iconos nuevos están copiados como SVG en `icons.tsx`.

## Para ponerlo en marcha

```bash
npm i -D sass        # ya está en package.json; falta instalarlo
npm run dev
npm run check:contrast
```

## Cambios respecto a docs/diseno.md

- Se admite un segundo color (amarillo de marca), solo para progreso y detalles.
- Se admiten sombras, solo en estados (hover, panel flotante), tintadas por tema.
- La barra global deja de ser negra: cristal del color del tema.
- Etiquetas en versalitas solo para numeración y datos clave, no como eyebrow.
