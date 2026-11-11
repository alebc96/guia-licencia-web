# Deuda técnica

Deuda aceptada conscientemente en la iteración 1, con su coste y su plan de pago.
No es una lista de deseos: cada entrada se aceptó por una razón concreta.

| ID | Deuda | Por qué se aceptó | Coste | Plan |
|---|---|---|---|---|
| DT-01 | Sin ESLint ni Prettier en el repositorio | No mezclar un cambio de tooling con la primera entrega funcional | Riesgo de estilo inconsistente y de imports muertos | Añadir `eslint@9` + `eslint-config-next` y `format:check` (T-18) |
| DT-02 | Un único `globals.css` de ~1.470 líneas en lugar de CSS Modules | El sistema tiene 30 tokens y componentes compartidos; un solo archivo evita duplicar tokens y mantiene la fuente de verdad en un sitio | El archivo crecerá y costará navegarlo | Migrar a CSS Modules por componente cuando pase de ~1.800 líneas, empezando por `senales` y `home` |
| DT-03 | Los pictogramas de señales son esquemáticos, no oficiales | Publicar 441 dibujos oficiales exige resolver licencias y descargas, y el riesgo de una señal mal dibujada es educativo | La web no sirve como referencia gráfica fiel | Sustituir por SVG de Commons con crédito (T-02) |
| DT-04 | Catálogo incompleto: 19 de ~441 fichas | Auditar el anexo oficial es trabajo de varias sesiones y no se quiso inventar ningún código | La sección Señales es la más floja del producto | T-01 a T-04 |
| DT-05 | Contenido de los temas con `verified: false` | Los redactores trabajaron desde `PLAN.md` y la norma, sin cotejo final uno a uno | Puede haber cifras desactualizadas y se avisa en la interfaz | T-05 a T-08 |
| DT-07 | Sin tests de extremo a extremo | No había todavía un flujo con volumen suficiente para que aportaran | Las regresiones de navegación se detectan tarde | Playwright (T-09) |
| DT-08 | Buscador solo en producción | Pagefind indexa `out/`, no el servidor de desarrollo | Confusión al probar la búsqueda en `dev` | Mostrar aviso explícito (ya implementado) y documentar en README |
| DT-09 | `tsconfig.json` no incluye `tests/` ni `scripts/` | El type-check de Next debe quedarse en el código de la app | Los tests no se validan con `tsc` | Añadir un `tsconfig.test.json` con `tsc --noEmit` en CI |
| DT-10 | Datos de progreso sin migración de versión | Guardar `{temas, senales}` con clave `guiab.progress.v1` es suficiente hoy | Si cambia la forma, hay que invalidar la clave | Función de migración por versión de clave |
| DT-11 | `check:links` hace peticiones de red reales | Verificar 40 enlaces externos en cada push es lento y frágil | Puede fallar por red, no por contenido | Ejecutarlo solo en el workflow semanal (T-11) |
| DT-12 | Documentación de despliegue sin Netlify/Vercel verificado | No se dispone de credenciales de esos proveedores | El usuario tiene que añadir el archivo de configuración si los quiere | T-17 |

## Deuda cerrada

| ID | Deuda | Cómo se cerró |
|---|---|---|
| DT-06 | `next/font/google` descargaba Inter en cada build | `fonts.gstatic.com` empezó a dar timeout y todas las rutas de `dev` devolvían 500. Inter pasa a `src/fonts/inter-latin-wght-normal.woff2` (subset latin variable, 48 KB) con `next/font/local` y su licencia OFL en `src/fonts/OFL.txt`. Build y dev funcionan sin red. |
