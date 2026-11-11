"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  /** Match nested routes too (for example /senales/r-301). */
  nested?: boolean;
}

/**
 * Renders an internal link that exposes `aria-current="page"` when it points at
 * the active route. Kept client-side so the rest of the navigation can stay a
 * server component.
 */
export function NavLink({ href, className, children, nested = false }: NavLinkProps) {
  const pathname = usePathname() ?? "/";
  const isActive = nested ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;

  return (
    <Link href={href} className={className} aria-current={isActive ? "page" : undefined}>
      {children}
    </Link>
  );
}
