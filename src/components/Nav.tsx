"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalReadout } from "./LocalReadout";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProject = pathname.startsWith("/projects/");
  const parent = pathname.startsWith("/projects/") ? "/projects" : pathname.startsWith("/research/") ? "/research" : null;
  return (
    <header className={`site-header container-page${isProject ? " site-header--essay" : ""}`}>
      <div>
        <Link href="/" className="site-name">STUDIO LAB BH</Link>
        {!isHome && (
          <nav className="site-path" aria-label="Breadcrumb">
            <Link href="/">← Index</Link>
            {parent && <><span aria-hidden="true">/</span><Link href={parent}>{parent.slice(1)}</Link></>}
          </nav>
        )}
      </div>
      <LocalReadout />
    </header>
  );
}
