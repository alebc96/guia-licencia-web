// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { ProgressProvider } from "@/components/progress/ProgressProvider";
import SenalPage from "@/app/senales/[slug]/page";

/**
 * Image credit on the sign page: CC BY-SA needs author, licence link and a
 * link to the Commons source; public-domain images with no author must not
 * leave stray separators or empty links.
 */
async function creditOf(slug: string): Promise<HTMLElement> {
  const page = await SenalPage({ params: Promise.resolve({ slug }) });
  render(<ProgressProvider totalTemas={17}>{page}</ProgressProvider>);
  const term = screen.getByText("Crédito de imagen");
  return term.nextElementSibling as HTMLElement;
}

afterEach(cleanup);

describe("crédito de imagen en la ficha", () => {
  it("muestra autor, enlace a la licencia y enlace a Commons en una señal CC BY-SA", async () => {
    const credit = await creditOf("r-120");

    expect(credit.textContent).toContain("SerrgioFdezz");
    const license = screen.getByRole("link", { name: "CC BY-SA 4.0" });
    expect(license.getAttribute("href")).toMatch(/^https:\/\/creativecommons\.org\/licenses\/by-sa\/4\.0/);
    const source = screen.getByRole("link", { name: "Wikimedia Commons" });
    expect(source.getAttribute("href")).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  });

  it("no deja separadores sueltos ni enlaces vacíos en una señal de dominio público sin autor", async () => {
    const credit = await creditOf("p-1c");

    expect(credit.textContent?.replace(/\s+/g, " ").trim()).toBe("Dominio público · Wikimedia Commons");
    for (const link of credit.querySelectorAll("a")) expect(link.textContent?.trim()).not.toBe("");
    expect(credit.textContent?.trim().startsWith("·")).toBe(false);
  });
});
