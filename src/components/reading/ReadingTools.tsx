"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { MoonIcon, ReadingIcon, SunIcon, TextSizeIcon } from "@/components/ui/icons";
import {
  TEXT_SIZES,
  THEMES,
  applyTextSize,
  applyTheme,
  effectiveTheme,
  readTextSize,
  type TextSize,
  type Theme,
} from "./preferences";

const THEME_LABELS: Record<Theme, string> = { light: "Claro", dark: "Oscuro", reading: "Lectura" };
const THEME_ICONS: Record<Theme, typeof SunIcon> = { light: SunIcon, dark: MoonIcon, reading: ReadingIcon };
const SIZE_LABELS: Record<TextSize, string> = { s: "Pequeño", m: "Normal", l: "Grande", xl: "Muy grande" };

const PANEL_ID = "ajustes-lectura";

/**
 * Botón "Aa" de la barra global y su panel (API Popover nativa: cierre con
 * Escape y clic fuera incluidos, sin JS propio). Dos grupos de radio con
 * navegación por flechas (patrón WAI-ARIA radiogroup, tabindex itinerante).
 */
export function ReadingTools() {
  const [theme, setTheme] = useState<Theme>("light");
  const [size, setSize] = useState<TextSize>("m");

  useEffect(() => {
    setTheme(effectiveTheme());
    setSize(readTextSize());
  }, []);

  return (
    <>
      <button
        type="button"
        className="global-nav__icon"
        popoverTarget={PANEL_ID}
        aria-label="Ajustes de lectura: tema y tamaño de texto"
      >
        <TextSizeIcon width={20} height={20} />
      </button>

      <div id={PANEL_ID} popover="auto" className="reading-tools" role="dialog" aria-labelledby={`${PANEL_ID}-title`}>
        <p id={`${PANEL_ID}-title`} className="reading-tools__title">
          Ajustes de lectura
        </p>

        <fieldset className="reading-tools__group">
          <legend className="reading-tools__legend">Tema</legend>
          <RadioGroup
            label="Tema"
            options={THEMES}
            value={theme}
            onChange={(next, origin) => {
              setTheme(next);
              applyTheme(next, origin);
            }}
            renderOption={(option) => {
              const Icon = THEME_ICONS[option];
              return (
                <>
                  <Icon />
                  {THEME_LABELS[option]}
                </>
              );
            }}
          />
        </fieldset>

        <fieldset className="reading-tools__group">
          <legend className="reading-tools__legend">Tamaño del texto</legend>
          <RadioGroup
            label="Tamaño del texto"
            options={TEXT_SIZES}
            value={size}
            modifier="theme-switch--sizes"
            onChange={(next) => {
              setSize(next);
              applyTextSize(next);
            }}
            renderOption={(option) => (
              <>
                <span aria-hidden="true">A</span>
                <span className="visually-hidden">{SIZE_LABELS[option]}</span>
              </>
            )}
          />
        </fieldset>

        <p className="reading-tools__hint">
          El modo Lectura usa papel cálido, letra serif y desactiva las animaciones. Se guarda en este navegador.
        </p>
      </div>
    </>
  );
}

interface RadioGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  modifier?: string;
  onChange: (value: T, origin: { x: number; y: number }) => void;
  renderOption: (option: T) => React.ReactNode;
}

function RadioGroup<T extends string>({ label, options, value, modifier, onChange, renderOption }: RadioGroupProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function originOf(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const current = options.indexOf(value);
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % options.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = options.length - 1;
    const button = refs.current[next];
    button?.focus();
    const target = options[next];
    if (button && target !== undefined) onChange(target, originOf(button));
  }

  return (
    <div role="radiogroup" aria-label={label} className={`theme-switch ${modifier ?? ""}`} onKeyDown={onKeyDown}>
      {options.map((option, index) => (
        <button
          key={option}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="button"
          role="radio"
          aria-checked={option === value}
          tabIndex={option === value ? 0 : -1}
          className="theme-switch__option"
          onClick={(event: MouseEvent<HTMLButtonElement>) => onChange(option, originOf(event.currentTarget))}
        >
          {renderOption(option)}
        </button>
      ))}
    </div>
  );
}
