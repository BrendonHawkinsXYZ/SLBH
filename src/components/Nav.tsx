"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldMark } from "./FieldMark";

const STICKY_OFFSET = 72;

const LINKS = [
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/diagrams", label: "Diagrams" },
  { href: "/studio", label: "Studio" },
];

export function Nav() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > STICKY_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: 72,
        display: "flex",
        alignItems: "center",
        padding: "0 var(--pad-x-mobile)",
        background: sticky ? "rgba(243, 242, 242, 0.95)" : "transparent",
        backdropFilter: sticky ? "saturate(1.2) blur(6px)" : undefined,
        WebkitBackdropFilter: sticky ? "saturate(1.2) blur(6px)" : undefined,
        borderBottom: sticky ? "0.5px solid var(--hairline-strong)" : "0.5px solid transparent",
        transition:
          "background var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out)",
      }}
      className="nav-root"
    >
      <Link
        href="/"
        className="link-quiet"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          color: "var(--ground)",
          textDecoration: "none",
        }}
      >
        <FieldMark size="sm" />
        <span className="t-wordmark" style={{ fontSize: 12 }}>
          Studio Lab BH
        </span>
      </Link>

      <ul
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          marginLeft: "auto",
          listStyle: "none",
          padding: 0,
        }}
      >
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="t-nav link-quiet"
              style={{ color: "var(--ground)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/studio#contact"
            className="t-nav link-quiet"
            style={{
              color: "var(--ground)",
              textDecoration: "none",
              border: "1px solid var(--ground)",
              padding: "8px 18px",
              display: "inline-block",
            }}
          >
            Contact
          </Link>
        </li>
      </ul>

      <style>{`
        @media (min-width: 768px) {
          .nav-root { padding: 0 var(--pad-x) !important; }
        }
      `}</style>
    </nav>
  );
}
