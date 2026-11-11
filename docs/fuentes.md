# Fuentes y estado de verificación

Fecha de corte normativo: **2026-11-11**.

## Normativa

| Norma | Uso en la guía | Estado |
|---|---|---|
| Reglamento General de Circulación, RD 1428/2003 (texto consolidado) | Normas de circulación, señales, velocidades, maniobras, alumbrado | Citado; texto consultado |
| Ley de Tráfico y Seguridad Vial, RDL 6/2015 | Infracciones, sanciones, permiso por puntos | Citado; pendiente de cotejo cifra a cifra |
| Reglamento General de Conductores, RD 818/2009 | Permisos, vigencia, centros de reconocimiento | Citado; pendiente de cotejo |
| RD 465/2025 (nuevo catálogo de señales) | Catálogo de señales | **Auditado**: catálogo de señales verticales (Tomo I) extraído del PDF del BOE a `data/catalogo-oficial.json` con 394 códigos, nombres y definiciones. El PDF no se versiona; el script `extract-catalog.mjs` lo regenera |
| RD 518/2026 (usuarios vulnerables) | Tema 11 y normas urbanas | Referenciado desde `PLAN.md`; falta contrastar la numeración del título urbano |

## Catálogo oficial de señales

- Documento: Catálogo de señales verticales de circulación, Tomo I. Definición de
  las señales, publicado con el RD 465/2025 (BOE núm. 145, 17/06/2025).
- Enlace: <https://www.boe.es/eli/es/rd/2025/06/10/465>
- Extracción: `pdftotext -layout` + `scripts/extract-catalog.mjs`.
- Arte: los SVG se descargan de Wikimedia Commons con autor y licencia en
  `data/creditos.json`.

## Páginas oficiales de la DGT

Se enlazan desde cada tema y desde `/recursos`. Lista completa en
`content/recursos/*.md` (20 entradas). Todas se comprobaron al escribirlas; la
comprobación automática de enlaces queda como tarea T-11.

## Datos que deben verificarse antes de marcar un tema como `verified: true`

Estos puntos salieron de la redacción de la iteración 1 y **no** están en
`PLAN.md`, así que necesitan fuente primaria:

1. **Sanciones y puntos**: alcohol (500 € / 4 puntos y 1.000 € / 6 puntos por
   encima del doble de la tasa), móvil (200 € / 6 puntos), cinturón y casco
   (200 € / 4 puntos).
2. **SRI**: altura de referencia de 135 cm.
3. **eCall**: obligatorio en vehículos nuevos desde marzo de 2018.
4. **ZBE**: obligatorias en municipios de más de 50.000 habitantes.
5. **RCP**: relación 30:2, 5–6 cm de profundidad, 100–120 compresiones por minuto.
6. **ITV**: 4 / 2 / anual según antigüedad; vigencia del permiso 10 años y
   renovación cada 5 desde los 65.
7. **Distancias de frenado**: la tabla del tema 3 es orientativa (1 s de reacción,
   coeficiente ≈ 0,8) y así está marcada en el texto.
8. **Alcance del alumbrado**: cruce ≈ 40 m, carretera ≈ 100 m; umbral de uso del
   antiniebla trasero con visibilidad < 50 m.
9. **Regla de 5 m a ciclistas en vía urbana**: alcance exacto de la redacción del
   RD 518/2026.
10. **Carril de emergencia en retenciones**: quién puede usarlo y bajo qué
    condiciones.

## Política editorial

- No se copia texto, tabla ni imagen de Vialtest, PracticaTest, SacaCarnet y
  similares: se usan solo como referencia de estructura.
- Toda afirmación numérica debe poder rastrearse hasta el BOE o la DGT.
- Si una fuente secundaria contradice a la primaria, gana la primaria y la
  corrección se anota aquí.

## Correcciones registradas

Ninguna todavía en esta iteración.
