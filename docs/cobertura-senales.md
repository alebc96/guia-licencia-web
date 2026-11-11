# Cobertura del catálogo de señales

## Situación actual

| Métrica | Valor |
|---|---|
| Fichas publicadas | 19 |
| Objetivo del plan | 315 señales verticales + ~126 marcas viales (≈441) |
| Cobertura | ≈4 % |
| Fichas con nombre confirmado en el texto del BOE | 4 (P-18, R-301, R-411, S-17) |
| Pictogramas oficiales | 0 (los actuales son esquemáticos propios) |

Fichas publicadas: P-1, P-18, R-1, R-2, R-3, R-4, R-5, R-101, R-102, R-108,
R-301, R-411, S-1, S-2, S-3, S-4, S-7, S-8, S-17.

## Por qué no está completo

El catálogo oficial es el anexo del Reglamento General de Circulación, con
centenares de fichas gráficas. Volcarlo exige:

1. Leer el anexo y transcribir **código + nombre + familia** de cada señal.
2. Conseguir una imagen con licencia para cada una (Commons) o dibujarla.
3. Redactar significado, acción, alcance y error típico.

La regla editorial del proyecto prohíbe publicar un código que no se haya
contrastado con la fuente. Escribir 441 fichas «de memoria» habría producido
errores de nombre y de familia, que es exactamente el fallo que la guía quiere
evitar. Se publicó lo que se pudo afirmar con seguridad y el resto queda como
trabajo planificado (T-01 a T-04 en `docs/tareas.md`).

Comprobación hecha en la iteración 1: el texto consolidado del RGC en el BOE
menciona 57 códigos distintos, pero **no contiene el anexo gráfico completo**;
solo lo referencia en la prosa. Por eso las fichas publicadas no se marcan como
verificadas salvo las cuatro cuyo nombre aparece literalmente en ese texto.

## Cómo se amplía (pipeline ya funcionando)

1. Añadir filas a `data/senales.txt` (14 columnas separadas por `|`; el formato
   está documentado en la cabecera del propio archivo).
2. `npm run generate:signs` regenera `content/senales/*.md` y
   `public/senales/*.svg`.
3. `npm run check:signs` verifica que nada quede desincronizado.
4. `npm run check:content` comprueba que la imagen existe y que los enlaces
   internos resuelven.

Para imágenes reales, el cambio es de una línea por ficha: apuntar `image` a
`/senales/<codigo>.svg` servido desde `public/` con su crédito en `imageCredit`.

## Niveles de ficha

| Nivel | Qué contiene | Hoy |
|---|---|---|
| A | Significado, acción, alcance, error típico y relacionadas redactados | 12 fichas |
| B | Definición tomada del nombre oficial + acción básica | 7 fichas |
| C | Solo lo que el nombre oficial permite afirmar | 0 fichas |

## Incidencias conocidas

- Los pictogramas de P-1 (cruce), P-18 (obras), R-102 (vehículos a motor) y R-108
  (bicicletas) son abstracciones: se entiende la idea, no son el símbolo oficial.
- Las marcas viales no están representadas: el formato de código `M-x.y` no se ha
  validado todavía contra el anexo, así que no se publicó ninguna.
