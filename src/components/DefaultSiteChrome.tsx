"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The landing study supplies its own navigation and footer. */
export function DefaultSiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/preview" ? null : children;
}
