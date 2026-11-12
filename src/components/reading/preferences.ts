/**
 * Preferencias de lectura: tema y tamaño de texto. Viven en localStorage y se
 * aplican como atributos en <html> (data-theme, data-text-size), que es lo
 * que lee el SCSS. Sin preferencia guardada, el tema sigue al sistema.
 */

export const THEMES = ["light", "dark", "reading"] as const;
export const TEXT_SIZES = ["s", "m", "l", "xl"] as const;

export type Theme = (typeof THEMES)[number];
export type TextSize = (typeof TEXT_SIZES)[number];

export const THEME_KEY = "guiab:theme";
export const TEXT_SIZE_KEY = "guiab:text-size";

/**
 * Script que se ejecuta en <head> antes del primer pintado, para que no haya
 * destello de tema claro al cargar en oscuro o lectura. Se mantiene como
 * cadena autocontenida (no puede importar nada).
 */
export const PREFERENCES_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_KEY}"),s=localStorage.getItem("${TEXT_SIZE_KEY}");if(t==="light"||t==="dark"||t==="reading")d.dataset.theme=t;if(s==="s"||s==="l"||s==="xl")d.dataset.textSize=s;}catch(e){}})();`;

export function readTheme(): Theme | null {
  const value = document.documentElement.dataset.theme;
  return THEMES.includes(value as Theme) ? (value as Theme) : null;
}

/** Tema efectivo (resuelve "sistema" a claro u oscuro). */
export function effectiveTheme(): Theme {
  return readTheme() ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

export function readTextSize(): TextSize {
  const value = document.documentElement.dataset.textSize;
  return TEXT_SIZES.includes(value as TextSize) ? (value as TextSize) : "m";
}

/**
 * Cambia el tema con una transición circular desde el punto pulsado
 * (View Transitions API). Sin soporte, o con movimiento reducido, el cambio
 * es inmediato.
 */
export function applyTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const commit = () => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* modo privado: la preferencia dura la sesión */
    }
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("startViewTransition" in document) || reduceMotion) {
    commit();
    return;
  }

  if (origin) {
    root.style.setProperty("--vt-x", `${origin.x}px`);
    root.style.setProperty("--vt-y", `${origin.y}px`);
  }
  document.startViewTransition(commit);
}

export function applyTextSize(size: TextSize) {
  const root = document.documentElement;
  if (size === "m") delete root.dataset.textSize;
  else root.dataset.textSize = size;
  try {
    localStorage.setItem(TEXT_SIZE_KEY, size);
  } catch {
    /* sin almacenamiento */
  }
}
