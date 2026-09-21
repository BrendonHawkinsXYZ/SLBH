"use client";

import { usePathname } from "next/navigation";
import { MorphShape } from "./MorphShape";

export function AmbientShape() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/research-arc" && !pathname.startsWith("/projects") && !pathname.startsWith("/work/")) return null;
  return <div className="ambient-shape" aria-hidden="true"><MorphShape /></div>;
}
