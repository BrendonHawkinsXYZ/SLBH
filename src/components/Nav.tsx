"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalReadout } from "./LocalReadout";
import type { ReactNode } from "react";

export function Nav({ gallery }: { gallery?: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProject = pathname.startsWith("/projects/");
  const parent = pathname.startsWith("/research/") ? "/research" : null;
  return (
    <>
    {isHome && gallery}
    <header className={`site-header container-page${isHome ? " site-header--home site-surface" : ""}${isProject ? " site-header--essay" : ""}`}>
      <div>
        <Link href="/" className="site-name">STUDIO LAB BH</Link>
        {!isHome && (
          <nav className="site-path" aria-label="Breadcrumb">
            <Link href={isProject ? "/#work" : "/"}>{isProject ? "← All work" : "← Index"}</Link>
            {parent && <><span aria-hidden="true">/</span><Link href={parent}>{parent.slice(1)}</Link></>}
          </nav>
        )}
      </div>
      <LocalReadout home={isHome} />
    </header>
    </>
  );
}
