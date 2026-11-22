import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

interface SubNavLink {
  href: string;
  label: string;
}

interface SubNavProps {
  title: string;
  links?: SubNavLink[];
  action?: { href: string; label: string } | null;
  children?: ReactNode;
}

/** Compact size for a primary button placed in the bar. */
export const SUB_NAV_ACTION_STYLE: CSSProperties = { minHeight: 32, padding: "6px 16px", fontSize: 14 };

/** Frosted 52 px section bar: section name on the left, contextual links right. */
export function SubNav({ title, links = [], action = null, children }: SubNavProps) {
  return (
    <div className="sub-nav">
      <div className="sub-nav__inner">
        <span className="sub-nav__title">{title}</span>
        <div className="row" style={{ gap: 16 }}>
          {links.length > 0 ? (
            <nav aria-label={`Navegación de ${title}`} className="sub-nav__links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="sub-nav__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
          {children}
          {action ? (
            <Link href={action.href} className="btn btn-primary" style={SUB_NAV_ACTION_STYLE}>
              {action.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
