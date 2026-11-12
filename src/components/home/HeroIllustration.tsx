/**
 * Ilustración del hero: una estudiante prepara el teórico del permiso B en su
 * escritorio. SVG propio, en línea, coloreado por clases `ha-*` que leen los
 * tokens del tema (src/styles/components/_hero-art.scss), así que se adapta
 * solo a claro, oscuro y lectura. Las animaciones también viven en ese parcial.
 */

const TITLE_ID = "hero-art-title";

/**
 * Sello «sin anuncios». Va aparte, en su propio grupo, para poder quitarlo
 * sin tocar el resto del dibujo si algún día la web lleva publicidad.
 * Si se elimina, actualiza también el texto de <title> de la ilustración.
 */
function NoAdsBadge() {
  return (
    <g id="sin-anuncios" className="ha-badge" transform="translate(522 150)">
      <g className="ha-badge__bob">
        <circle r="35" className="ha-badge__plate" />
        <circle r="31" className="ha-badge__ring" />
        <text y="8" textAnchor="middle" className="ha-badge__ad">
          AD
        </text>
        <path d="M-21 -21 21 21" className="ha-badge__slash" />
        <rect x="-50" y="36" width="100" height="22" rx="11" className="ha-badge__ribbon" />
        <text y="51" textAnchor="middle" className="ha-badge__label">
          SIN ANUNCIOS
        </text>
      </g>
    </g>
  );
}

export function HeroIllustration() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 600 480"
      role="img"
      aria-labelledby={TITLE_ID}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={TITLE_ID}>
        Una joven estudia el teórico del permiso B en su escritorio: en el portátil acierta una pregunta de test,
        junto a sus apuntes, un lápiz, una taza y dos señales de tráfico. Un sello indica que la guía no tiene
        anuncios.
      </title>

      {/* Fondo */}
      <g id="fondo">
        <path
          className="ha-blob"
          d="M300 46c112-6 228 50 252 158 22 102-34 204-140 236-92 28-214 22-300-30C40 362 22 260 64 176 102 100 196 52 300 46Z"
        />
        <circle className="ha-blob-2" cx="104" cy="104" r="62" />
      </g>

      {/* Señales flotantes (simplificadas) */}
      <g id="senales">
        <g className="ha-float ha-float--a">
          <path className="ha-sign-red" d="M54 70h92l-46 78Z" strokeLinejoin="round" />
          <path className="ha-sign-white" d="M75 82h50l-25 43Z" strokeLinejoin="round" />
        </g>
        <g className="ha-float ha-float--b">
          <circle className="ha-sign-red" cx="318" cy="88" r="31" />
          <circle className="ha-sign-white" cx="318" cy="88" r="23" />
          <text className="ha-sign-num" x="318" y="96" textAnchor="middle">
            50
          </text>
        </g>
      </g>

      {/* Mesa */}
      <g id="mesa">
        <ellipse className="ha-floor" cx="300" cy="458" rx="250" ry="9" />
        <rect className="ha-desk-edge" x="66" y="350" width="14" height="106" rx="4" />
        <rect className="ha-desk-edge" x="520" y="350" width="14" height="106" rx="4" />
      </g>

      {/* Estudiante */}
      <g id="estudiante">
        {/* Silla y piernas, bajo la mesa */}
        <rect className="ha-desk-edge" x="186" y="370" width="10" height="58" rx="3" />
        <path className="ha-chair-base" d="M150 434h82" />
        <circle className="ha-desk-edge" cx="152" cy="442" r="6" />
        <circle className="ha-desk-edge" cx="230" cy="442" r="6" />
        <rect className="ha-chair" x="146" y="360" width="96" height="14" rx="7" />
        <path className="ha-pants" d="M180 354h70l4 84" />
        <path className="ha-shoe" d="M244 447h30a7 7 0 0 0-7-9h-23Z" />
        <rect className="ha-chair" x="122" y="222" width="128" height="116" rx="24" />

        <rect className="ha-skin" x="194" y="232" width="22" height="34" rx="9" />
        <path className="ha-skin-shade" d="M194 246h22v8c-7 4-15 4-22 0Z" />
        <path className="ha-sweater" d="M144 340v-44c0-24 15-36 38-38h7q16 15 32 0h7c23 2 36 14 36 38v44Z" />
        <path className="ha-collar" d="M188 259q17 17 34 0" />

        {/* Cabeza, girada hacia el portátil */}
        <path className="ha-hair" d="M178 204c-6 30 2 52 18 62l10-34Z" />
        <ellipse className="ha-skin" cx="210" cy="202" rx="28" ry="31" />
        <path
          className="ha-hair"
          d="M182 210c-8-26 6-46 30-46 18 0 32 10 33 28-12-2-24-8-31-16-4 10-14 18-24 20-1 5-3 10-8 14Z"
        />
        <circle className="ha-hair" cx="186" cy="166" r="15" />
        <path className="ha-skin" d="M236 203l7 11-6 2Z" />
        <path className="ha-hair-light" d="M196 174c8-4 18-4 26 0" />
        <circle className="ha-blush" cx="226" cy="216" r="5" />
        <g className="ha-eyes">
          <ellipse className="ha-eye" cx="216" cy="203" rx="2.6" ry="3.4" />
          <ellipse className="ha-eye" cx="233" cy="202" rx="2.4" ry="3.2" />
        </g>
        <path className="ha-line" d="M211 194q5-3 10-1M229 192q4-2 8 0" />
        <path className="ha-line" d="M223 223q6 4 11-1" />
      </g>

      {/* Tablero de la mesa (por delante del cuerpo) */}
      <g id="tablero">
        <rect className="ha-desk-top" x="24" y="316" width="552" height="32" rx="8" />
        <rect className="ha-desk-edge" x="24" y="340" width="552" height="14" rx="7" />
      </g>

      {/* Libros: la guía y un cuaderno */}
      <g id="libros">
        <rect className="ha-book-a" x="42" y="314" width="82" height="16" rx="3" />
        <rect className="ha-paper" x="118" y="317" width="4" height="10" />
        <rect className="ha-book-b" x="50" y="300" width="68" height="14" rx="3" />
        <path className="ha-stroke-paper" d="M58 307h30" />
        <text className="ha-book-b-label" x="104" y="327" textAnchor="middle">
          B
        </text>
      </g>

      {/* Cuaderno abierto */}
      <g id="cuaderno">
        <path className="ha-paper" d="M168 342l8-20 42-2v20Z" />
        <path className="ha-paper" d="M218 340v-20l42 2 8 20Z" />
        <path className="ha-paper-line" d="M180 330l32-1M178 336l34-1M224 329l30 1M224 335l34 1" />
        <path className="ha-spine" d="M218 320v20" />
      </g>

      {/* Brazos */}
      <g id="brazos">
        <path className="ha-sleeve" d="M160 276l-8 42 40 12" />
        <circle className="ha-skin" cx="196" cy="330" r="8" />
        <g className="ha-writing">
          <path className="ha-sleeve" d="M250 276l18 40-26 10" />
          <g id="lapiz">
            <path className="ha-pencil" d="M238 330l22-34" />
            <path className="ha-pencil-tip" d="M236 334l3-7 4 3Z" />
            <path className="ha-pencil-end" d="M258 299l4-6" />
          </g>
          <circle className="ha-skin" cx="240" cy="326" r="8" />
        </g>
      </g>

      {/* Portátil con la pregunta de test */}
      <g id="portatil">
        <rect className="ha-device" x="312" y="166" width="210" height="152" rx="12" />
        <rect className="ha-screen" x="320" y="174" width="194" height="136" rx="6" />
        <path className="ha-device-base" d="M300 318h234l-10 12H310Z" />

        <g id="pregunta">
          <rect className="ha-ui-accent" x="332" y="186" width="54" height="8" rx="4" />
          <rect className="ha-ui-muted" x="476" y="186" width="26" height="8" rx="4" />
          <rect className="ha-ui-text" x="332" y="203" width="160" height="7" rx="3.5" />
          <rect className="ha-ui-text" x="332" y="215" width="108" height="7" rx="3.5" />

          <rect className="ha-opt" x="332" y="232" width="170" height="18" rx="9" />
          <circle className="ha-radio" cx="343" cy="241" r="4" />
          <rect className="ha-ui-muted" x="354" y="239" width="78" height="5" rx="2.5" />

          <rect className="ha-opt ha-opt--ok" x="332" y="255" width="170" height="18" rx="9" />
          <circle className="ha-radio--ok" cx="343" cy="264" r="6" />
          <path className="ha-check" d="M340 264l2.2 2.4 4-4.8" pathLength="1" />
          <rect className="ha-ui-ok" x="356" y="262" width="96" height="5" rx="2.5" />

          <rect className="ha-opt" x="332" y="278" width="170" height="18" rx="9" />
          <circle className="ha-radio" cx="343" cy="287" r="4" />
          <rect className="ha-ui-muted" x="354" y="285" width="62" height="5" rx="2.5" />

          <rect className="ha-track" x="332" y="300" width="170" height="5" rx="2.5" />
          <rect className="ha-progress" x="332" y="300" width="118" height="5" rx="2.5" />
        </g>
      </g>

      {/* Taza */}
      <g id="taza">
        <path className="ha-steam" d="M543 292c-5-6 5-10 0-16s4-10 0-14" />
        <path className="ha-steam ha-steam--2" d="M553 292c-5-6 5-10 0-16s4-10 0-14" />
        <path className="ha-mug-handle" d="M562 308h3a7 7 0 0 1 0 14h-3" />
        <rect className="ha-mug" x="536" y="300" width="28" height="30" rx="6" />
        <rect className="ha-mug-band" x="536" y="310" width="28" height="5" />
      </g>

      <NoAdsBadge />
    </svg>
  );
}
