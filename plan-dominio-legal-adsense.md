# Plan: dominio propio, cumplimiento legal y monetización con AdSense

**Proyecto:** Guía B (temario del permiso B), actualmente en https://alebc96.github.io/guia-licencia-web/
**Fecha del análisis:** 12 de noviembre de 2026
**Objetivo:** publicar la web en un dominio propio, adaptarla a la normativa española/europea y dejarla lista para solicitar Google AdSense.

**Estado:** el dominio, los datos del titular y la cuenta de AdSense están pendientes de la decisión del titular. Mientras tanto, el repositorio se deja listo para desplegar.

**Actualización 12/11/2026 — verificado.** Revisado contra el código y las fuentes oficiales. Cambios:
- Sección 1: imágenes (394 fichas: 286 de Wikimedia Commons y 108 pictogramas propios) y auditoría de licencias.
- Sección 2: coste del consentimiento.
- Sección 3: ruta base, sitemap, robots, canonical, 404 y redirección desde `github.io` marcados; condiciones de GitHub Pages.
- Sección 4: requisitos de Google para el consentimiento (4.4); tareas nuevas de `EMAIL_ALLOWLIST` y pie global (4.5 y 4.6).
- Sección 5: ubicaciones de la afirmación "sin cookies".
- Sección 6: licencias de imágenes (6.1), RD 465/2025 y RD 518/2026 (6.2), autónomos y edad (6.4).
- Sección 7: verificación de AdSense, `ads.txt` y nota sobre los botones del examen.
- Fuentes consultadas: enlaces oficiales añadidos.

> Instrucciones para Claude: implementa los cambios de las secciones 3 a 8 en el repositorio de la web. No inventes datos del titular: usa los marcadores `[[...]]` hasta que el usuario los facilite y pregúntale por ellos antes de terminar. Las secciones marcadas como "Comprobar" requieren verificar antes de dar algo por hecho. Esto es información general y no sustituye a un abogado ni a un gestor.

---

## 1. Estado actual de la web (revisado)

- Guía de estudio en español para el teórico del permiso B: 17 temas, señales, examen, práctico, recursos, glosario, buscador y progreso.
- Alojada en GitHub Pages bajo la ruta `/guia-licencia-web/` (URL base confirmada en `.github/workflows/deploy-pages.yml`).
- Aviso de independencia presente: "No es una publicación oficial de la Dirección General de Tráfico".
- Página `/creditos/` (aviso legal y créditos) con:
  - Fuentes: Reglamento General de Circulación, Reglamento General de Conductores, Ley de Tráfico y Seguridad Vial y páginas públicas de la DGT.
  - Afirma que no copia texto, tablas ni imágenes de webs de autoescuelas.
  - Catálogo de 394 fichas de señales: 286 imágenes de Wikimedia Commons y 108 pictogramas propios del sitio. Auditoría de licencias (`scripts/audit-commons-licenses.mjs`): 208 dominio público, 31 CC0, 5 CC BY 4.0, 18 CC BY-SA 3.0 y 24 CC BY-SA 4.0. Ninguna impide el uso comercial; 47 exigen atribución. Portada propia.
  - Tipografía Inter (SIL OFL 1.1) servida desde el propio dominio.
  - Dice que no hay cuentas, cookies, analítica ni servicios externos, y que el progreso se guarda solo en el almacenamiento local del navegador.
  - **No indica nombre, NIF ni email del titular.** Solo "Proyecto personal publicado en abierto".
  - No hay cláusula formal de exclusión de responsabilidad.
- No existe política de privacidad, política de cookies, página de contacto ni banner de cookies.
- No hay publicidad ni analítica.

## 2. Costes estimados

| Concepto | Coste orientativo |
|---|---|
| Dominio `.com` | 10-16 €/año (precio fijo en Cloudflare/Porkbun ≈ 11 $; registradores españoles 13-16 €) |
| Dominio `.es` | 7-10 €/año en algunos registradores; hasta 25 €/año de renovación en otros (p. ej. Arsys) |
| Hosting | 0 € si se mantiene GitHub Pages con dominio propio |
| Textos legales | 0 € redactándolos a mano o con generadores gratuitos; el mensaje de consentimiento de AdSense (CMP certificado) es probablemente gratuito, no confirmado |
| Email de contacto | 0 € con una cuenta gratuita dedicada |

Reglas para elegir registrador:
- Comparar siempre el **precio de renovación**, no el del primer año (ofertas de 0,01 € o 1 € suben mucho al renovar).
- Desconfiar de "dominio gratis el primer año" sin ver la tarifa de renovación (caso Nominalia: 64,85 € + IVA/año según un usuario).
- Activar la privacidad WHOIS (que no se publiquen los datos personales del titular del dominio) si el registrador la ofrece gratis.

**Total estimado: 10-16 € al año.**

---

## 3. Tareas de infraestructura (dominio y despliegue)

- [ ] Registrar el dominio elegido: `[[DOMINIO]]`.
- [ ] Configurar el dominio en Settings → Pages y los registros DNS hacia GitHub Pages. Con despliegues por Actions no se usa el archivo `CNAME`. En curso: que el dominio sea solo una variable de repositorio `CUSTOM_DOMAIN` (ver README cuando se actualice).
- [ ] Activar "Enforce HTTPS" en la configuración de Pages.
- [ ] **Cambiar la ruta base.** Hoy el sitio vive en `/guia-licencia-web/`; con dominio propio pasará a `/`. Verificado:
  - [x] La ruta base solo se controla con `NEXT_PUBLIC_BASE_PATH` y `NEXT_PUBLIC_SITE_URL` en `.github/workflows/deploy-pages.yml` (líneas 45-46). No hay rutas `/guia-licencia-web/` escritas en el código.
  - [x] Enlaces internos: los enlaces sin ruta base de ProgressSummary, ExamFacts y creditos están corregidos (cambios pendientes de commit).
  - [x] No hay service worker.
  - [x] El buscador (Pagefind) respeta `BASE_PATH`.
  - [ ] Comprobar rutas de CSS, JS, fuentes e imágenes tras el cambio.
  - [ ] Al cambiar de dominio, ajustar `NEXT_PUBLIC_BASE_PATH` y `NEXT_PUBLIC_SITE_URL` en el workflow y repetir la comprobación de enlaces rotos.
- [ ] Definir un único dominio canónico (con o sin `www`) y redirigir el otro.
- [x] Canonical: generado en `src/lib/seo.ts` y `src/app/layout.tsx`.
- [x] `sitemap.xml` y `robots.txt` existen (`src/app/sitemap.ts`, `src/app/robots.ts`) y usan la URL de la configuración.
- [x] Redirección de la URL antigua de `github.io`: GitHub Pages la hace automáticamente al configurar el dominio propio. Comprobarla tras el cambio.
- [x] Página 404: `src/app/not-found.tsx`.
- [ ] Comprobar que no quedan enlaces rotos (herramienta de comprobación de enlaces).
- [ ] Probar la web en móvil (AdSense lo valora) y revisar accesibilidad básica.
- [ ] **Comprobar (zona gris):** las condiciones de GitHub Pages no mencionan la publicidad, pero excluyen su uso como servicio de alojamiento gratuito para negocios: "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)." Límite orientativo: 100 GB al mes. Si hay dudas, valorar otro hosting estático; las condiciones de Cloudflare Pages no están verificadas. Fuente: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## 4. Textos legales a crear

Datos del titular necesarios (preguntar al usuario, no inventar):
- Nombre y apellidos o razón social: `[[NOMBRE]]`
- NIF/CIF: `[[NIF]]`
- Domicilio postal: `[[DOMICILIO]]`
- Correo electrónico de contacto: `[[EMAIL]]`
- Datos de inscripción en el Registro Mercantil, solo si es una empresa.

### 4.1 Aviso legal (art. 10 LSSI-CE)
Obligatorio en cuanto la web tenga actividad económica, incluida la publicidad.
- [ ] Identificación del titular (datos anteriores), visible de forma permanente y de fácil acceso desde el pie de todas las páginas.
- [ ] Condiciones de uso y limitación de responsabilidad:
  - la guía no es una publicación oficial de la DGT,
  - no sustituye a una autoescuela,
  - no garantiza aprobar el examen,
  - el usuario debe contrastar con el BOE y la DGT porque la normativa cambia.
- [ ] Propiedad intelectual: titularidad del contenido propio, licencias e imágenes de terceros con sus créditos.
- [ ] Marcas: "DGT" y denominaciones oficiales pertenecen a sus titulares, citadas solo como referencia.
- [ ] Legislación aplicable y jurisdicción.

### 4.2 Política de privacidad (RGPD y LOPDGDD, arts. 13-14 RGPD)
- [ ] Responsable del tratamiento y contacto.
- [ ] Qué datos se tratan, con qué finalidad y base jurídica, plazos y derechos del usuario.
- [ ] Mención expresa a **Google AdSense y terceros proveedores/redes publicitarias**, que pueden usar cookies e identificadores.
- [ ] Fecha de vigencia y cómo se avisará de cambios.
- [ ] Si se añade formulario de contacto o newsletter, describir ese tratamiento.

### 4.3 Política de cookies (art. 22.2 LSSI)
- [ ] Tabla de cookies y tecnologías: nombre, titular, finalidad, duración.
- [ ] Incluir las de Google/AdSense y, si se usa, la analítica.
- [ ] Indicar cómo retirar o modificar el consentimiento.

### 4.4 Banner / gestor de consentimiento
- [ ] Banner que bloquee cookies no esenciales y los scripts de anuncios **hasta que haya consentimiento**.
- [ ] Botones de aceptar y rechazar con el mismo nivel de visibilidad, y acceso para cambiar la elección después.
- [x] Requisitos de Google verificados: desde el 16/01/2024, los anuncios personalizados en el EEE y Reino Unido exigen un CMP certificado por Google e integrado con IAB TCF (desde el 31/07/2024 también en Suiza). El estándar vigente es TCF v2.3 (obligatorio desde el 01/03/2026). Sin CMP certificado solo se sirven anuncios limitados o no personalizados. Fuentes: https://support.google.com/adsense/answer/13554116 y https://support.google.com/adsense/answer/14210870
- [ ] Recomendación: usar el mensaje "Privacidad y mensajería" de AdSense (CMP certificado, Google LLC, CMP ID 300), configurado desde el panel de AdSense, en lugar de un banner propio. Que sea gratuito es probable, pero **no confirmado**.

### 4.5 Páginas de apoyo
- [ ] Acerca de: quién está detrás, a quién sirve la web, metodología y fuentes.
- [ ] Contacto: un correo que funcione de verdad (y/o formulario).
- [ ] Enlazar aviso legal, privacidad, cookies, contacto y acerca de desde el **pie global** de todas las páginas. Hoy el pie (`src/components/layout/Footer.tsx`, enlaces en `FOOTER_COLUMNS` de `src/lib/constants.ts`) solo enlaza `/creditos`.

### 4.6 Datos de contacto en el repositorio
- [ ] Añadir el correo de contacto a `EMAIL_ALLOWLIST` en `scripts/check-secrets.mjs` (hoy solo admite `example.com`, `noreply@github.com` y `git@github.com`). El paso "Secret and personal-data scan" de CI se ejecuta antes del build y bloquea cualquier otro email.
- [ ] Revisar a mano el NIF y el domicilio: `check-secrets.mjs` no detecta NIF ni direcciones postales.

## 5. Cambios en textos existentes

- [ ] Reescribir en `/creditos/` la afirmación "no hay cookies, analítica ni servicios externos / no se envía ningún dato": dejará de ser cierta con AdSense. Mantener solo lo que siga siendo verdad. La misma afirmación aparece en `src/app/creditos/page.tsx` (líneas 92-94), `src/app/progreso/page.tsx` (meta description, línea 10), `README.md` (línea 5), `PLAN.md` (línea 1038), `MEMORY.md` (línea 20) y `odd/tasks/guia-licencia-web.md` (líneas 14 y 46, decisión D5). Revisar también los documentos internos.
- [ ] Sustituir "Proyecto personal publicado en abierto" por la identificación real del titular.
- [ ] Informar de que el progreso se guarda en el almacenamiento local del navegador, y cómo borrarlo (ya existe la página de progreso).
- [ ] Mantener el aviso de independencia visible y el pie con la fecha de actualización.
- [ ] Evitar cualquier elemento visual o textual que haga pensar que la web es oficial o está respaldada por la DGT.
- [ ] Comprobar que "Guía B" no choca con marcas registradas existentes (consulta en la OEPM). **Comprobar.**

## 6. Cosas a revisar (verificación, no implementación directa)

### 6.1 Imágenes y licencias
- [x] Listar las 286 imágenes de Wikimedia Commons (de 394 fichas de señales) y registrar de cada una: autor, licencia exacta, enlace a la página de origen y si requiere atribución o compartir igual. Hecho con `scripts/audit-commons-licenses.mjs` (solo lectura).
- [x] Ninguna licencia impide el uso comercial (208 dominio público, 31 CC0, 5 CC BY 4.0, 18 CC BY-SA 3.0, 24 CC BY-SA 4.0). Todas quedan clasificadas; ninguna sin licencia clara.
- [ ] Atribución visible correcta: 47 imágenes la exigen (autor, licencia y enlace), de 6 autores. En curso en `data/creditos.json` y en las fichas de señal.
- [ ] Indicar en `/creditos/` la licencia concreta de cada grupo de imágenes, no solo "la indicada en la página de origen".
- [ ] Comprobar si las ilustraciones de señales oficiales reproducen el diseño del catálogo oficial y si eso exige alguna cautela adicional. **Comprobar.**
- [ ] Mantener la advertencia de que los pictogramas propios no son señalización oficial.

### 6.2 Contenido y originalidad (también para AdSense)
- [ ] Confirmar que el texto es original (reescrito desde la normativa) y pasar una revisión anti-plagio frente a webs de autoescuelas y a la DGT.
- [ ] Citar la fuente (BOE/DGT) en cada tema y mantener la fecha de actualización.
- [ ] La reutilización de información pública (Ley 37/2007) admite condiciones como citar la fuente, indicar la fecha de actualización y no alterar su sentido. Cumplirlas.
- [x] Referencias normativas verificadas en el BOE: RD 465/2025, de 10 de junio (BOE-A-2025-12199, en vigor desde el 1/07/2025), catálogo de señales; RD 518/2026, de 24 de junio (BOE-A-2026-13889, en vigor desde el 1/10/2026), usuarios vulnerables.
- [ ] Asegurar que el contenido refleja el RD 518/2026 (por ejemplo `content/temas/11-usuarios-vulnerables.md`). Revisión en curso.
- [ ] Comprobar que cada tema tiene suficiente contenido propio y no páginas casi vacías (AdSense rechaza contenido insuficiente o de baja calidad).
- [ ] Revisar que el texto de los temas indica claramente que la normativa puede cambiar.

### 6.3 Privacidad técnica
- [ ] Auditar con las herramientas de desarrollador qué peticiones de red hace la web hoy (fuentes, scripts, imágenes externas, embeds) y confirmar que todo se sirve desde el propio dominio.
- [ ] Tras añadir AdSense, repetir la auditoría y documentar las cookies reales en la política de cookies.
- [ ] Decidir si se usará analítica (opcional). Si se usa, preferir una opción respetuosa con la privacidad y reflejarla en los textos y en el consentimiento.

### 6.4 Fiscalidad y titularidad
- [ ] Consultar con un gestor si los ingresos de AdSense obligan a darse de alta como autónomo y cómo tributan. Verificado: no hay guía oficial de la AEAT ni de la Seguridad Social específica para AdSense. La STS 162/2026, de 16 de febrero, establece que unos ingresos inferiores al SMI no excluyen automáticamente la habitualidad (se valora caso por caso). Los ingresos tributan en IRPF como actividad económica.
- [ ] Verificar que el titular de la cuenta de AdSense coincide con el titular del aviso legal.
- [x] Edad mínima para AdSense: 18 años (https://support.google.com/adsense/answer/9724).
- [ ] Revisar el requisito de identidad y pagos.

## 7. Requisitos y pasos para solicitar Google AdSense

Antes de solicitar:
- [ ] Dominio propio con HTTPS (los subdominios gratuitos no están prohibidos, pero la tasa de aprobación es claramente menor). No está confirmado que Google exija dominio propio.
- [ ] Acerca de, Contacto y Política de privacidad publicados y enlazados globalmente.
- [ ] Política de cookies y consentimiento funcionando.
- [ ] Contenido original, abundante y con navegación clara (idealmente a no más de tres clics).
- [ ] Sin enlaces rotos y con buena experiencia en móvil.
- [ ] Sin contenido que infrinja las políticas del programa (derechos de autor, etc.).

Al solicitar:
- [ ] Alta en https://www.google.com/adsense/start/ con el dominio definitivo y verificación de propiedad del sitio (código de anuncio, `ads.txt` o meta tag).
- [ ] Una vez aprobado, crear `ads.txt` en la raíz del dominio con la línea que indique AdSense. Google indica que no es obligatorio, pero sí muy recomendable.
- [ ] Empezar con pocos bloques de anuncio colocados de forma que no molesten al estudio (no ocultar contenido ni confundir anuncios con botones de la web).
- [ ] No pedir ni incitar clics en los anuncios.
- [ ] No colocar anuncios cerca de los botones de respuesta del examen: los clics accidentales infringen las políticas.

Notas:
- Aprobación no implica ingresos: dependen del tráfico y no hay datos para estimarlos.
- Si la solicitud se rechaza, revisar el motivo indicado por Google (normalmente contenido insuficiente, páginas esenciales ausentes o infracción de políticas), corregir y volver a solicitar.

## 8. Orden de implementación sugerido

1. Registrar dominio y configurar DNS, HTTPS y rutas base (sección 3).
2. Obtener del usuario los datos del titular y crear aviso legal, privacidad, cookies, contacto y acerca de (sección 4).
3. Actualizar `/creditos/` y los textos existentes (sección 5).
4. Auditar imágenes, contenido y peticiones de red (sección 6).
5. Instalar el consentimiento de cookies (4.4).
6. Solicitar AdSense, añadir `ads.txt` y colocar anuncios (sección 7).
7. Tras la aprobación, repetir las auditorías de la 6.3 y actualizar la política de cookies con lo que realmente se use.

## 9. Criterios de aceptación

- La web carga solo en el dominio propio, con HTTPS y sin enlaces ni recursos rotos.
- El pie de todas las páginas enlaza a aviso legal, privacidad, cookies, contacto y acerca de.
- El aviso legal contiene datos reales del titular y ninguna información falsa.
- Ningún script de anuncios ni cookie no esencial se ejecuta antes del consentimiento.
- Cada imagen de terceros tiene autor, licencia y enlace de origen registrados y visibles.
- No queda ningún texto que afirme "sin cookies/servicios externos" si deja de ser cierto.
- Existen `sitemap.xml`, `robots.txt`, canonical y (tras la aprobación) `ads.txt`.

---

## Fuentes consultadas

- Web del proyecto: https://alebc96.github.io/guia-licencia-web/temario/ , /creditos/ y /recursos/
- Precios de dominio: https://affinco.com/es/cheapest-domain-registrars/ y https://hackceleration.com/es/labs/mejor/registrador-de-dominios
- Aviso legal LSSI: https://www.legiscope.com/blog/modelo-aviso-legal-web.html y https://lawwwing.com/textos-legales-web-requisitos-obligatorios/
- Privacidad y cookies para AdSense: https://www.iubenda.com/es/help/39470-politica-de-privacidad-para-google-adsense/
- Aprobación de AdSense: https://eastondev.com/blog/es/posts/media/20260108-google-adsense-approval-guide/ y https://support.wix.com/es/article/solicitud-de-google-adsense-rechazada-por-google
- Reutilización de información pública: https://boe.es/eli/es/l/2007/11/16/37/con
- Consentimiento de AdSense: https://support.google.com/adsense/answer/13554116 y https://support.google.com/adsense/answer/14210870
- Requisitos de AdSense (edad, verificación, ads.txt): https://support.google.com/adsense/answer/9724 y https://support.google.com/adsense/answer/7532444
- Condiciones de GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- BOE: https://www.boe.es/eli/es/rd/2025/06/10/465 y https://www.boe.es/eli/es/rd/2026/06/24/518
