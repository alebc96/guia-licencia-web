# Cobertura del catálogo de señales

## Situación actual

| Métrica | Valor |
|---|---|
| Fichas publicadas | **394** |
| Fuente de códigos, nombres y definiciones | Catálogo oficial de señales verticales de circulación, RD 465/2025 (BOE, 17/06/2025), Tomo I |
| Fichas con nota de estudio curada (tier A) | 20 |
| Fichas con la definición oficial (tier B) | 374 |
| Pictogramas oficiales descargados | ver `data/creditos.json` |
| Marcas viales | 0 (catálogo aparte, pendiente) |

Familias cubiertas: peligro (58), reglamentación (86) e indicación (250).

## Cómo se construye

```
PDF del BOE ──pdftotext──▶ /tmp/tomo1.txt
                              │
                              ▼
              scripts/extract-catalog.mjs
                              │
                              ▼
                 data/catalogo-oficial.json      (394 señales: código, nombre, definición, párrafos)
                              │
        data/senales.txt ─────┤  capa curada: acción, error de examen, relacionadas (opcional)
                              │
        data/creditos.json ───┤  autor y licencia de cada SVG
                              │
                              ▼
              scripts/generate-signs.mjs
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
   content/senales/*.md              public/senales/*.svg
   (una ficha por señal)       (el de Commons o uno esquemático)
```

Comandos:

```bash
# 1. Extraer el catálogo (una vez por edición del BOE)
pdftotext -layout 5-SENALES-VERTICALES-DE-CIRCULACION.pdf /tmp/tomo1.txt
node scripts/extract-catalog.mjs /tmp/tomo1.txt

# 2. Descargar las imágenes que falten (necesita red; luego se versionan)
node scripts/fetch-sign-images.mjs

# 3. Regenerar fichas y SVG de reserva
npm run generate:signs

# 4. Verificar que nada se ha desincronizado
npm run check:signs && npm run check:content
```

PDF de origen: <https://www.boe.es/eli/es/rd/2025/06/10/465>. El fichero no se
versiona (14 MB); sí se versiona el JSON extraído, que es el artefacto que consume
el generador.

## Niveles de ficha

| Nivel | Qué contiene | Hoy |
|---|---|---|
| A | Definición oficial + acción, error típico y señales relacionadas, revisados a mano | 20 |
| B | Definición oficial íntegra del BOE | 374 |
| C | Nombre oficial sin definición utilizable | 0 |

El esquema de contenido hace **opcionales** `action`, `where` y `mistake`
precisamente para no rellenarlos con texto inventado: una ficha B enseña solo lo
que la norma dice.

## Imágenes

- Se descargan de Wikimedia Commons con `scripts/fetch-sign-images.mjs`, que
  rechaza ficheros no oficiales (históricos, regionales, prototipos).
- Cada descarga guarda autor, licencia y página de origen en `data/creditos.json`,
  y el crédito se muestra en la ficha y en `/creditos`.
- Cuando no hay SVG en Commons se genera un pictograma esquemático propio: forma
  y colores correctos, sin reproducir el símbolo oficial. La ficha lo indica.
- Wikimedia devuelve HTTP 429 a clientes que descargan en ráfaga; el script usa
  `curl`, 250 ms de espera entre ficheros y un User-Agent descriptivo.

## Qué falta

| Tarea | Detalle |
|---|---|
| Curar nivel A | Las ~80 señales más preguntadas necesitan acción y error típico redactados |
| Marcas viales | El catálogo de marcas viales es un documento aparte (códigos `M-x.y`); no se ha volcado |
| Paneles de orientación | Los carteles grandes (S-4xx, S-5xx, S-6xx) tienen definición pero no un dibujo útil: se muestran con pictograma propio |
| Revisión de pictogramas | Algunos SVG de Commons son de la edición anterior del catálogo; hay que cotejarlos con la nueva |
| Semáforos y agentes | No están en el catálogo de señales verticales; faltan como contenido propio |
