"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldMark } from "./FieldMark";

const STICKY_OFFSET = 72;

const LINKS = [
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/product/chroma", label: "Chroma" },
  { href: "/studio", label: "Studio" },
];

export function Nav() {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > STICKY_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 var(--pad-x-mobile)",
          background: sticky ? "rgba(243, 242, 242, 0.95)" : "transparent",
          backdropFilter: sticky ? "saturate(1.2) blur(6px)" : undefined,
          WebkitBackdropFilter: sticky ? "saturate(1.2) blur(6px)" : undefined,
          borderBottom: sticky
            ? "0.5px solid var(--hairline-strong)"
            : "0.5px solid transparent",
          transition:
            "background var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out)",
        }}
        className="nav-root"
      >
        <Link
          href="/"
          className="link-quiet"
          onClick={close}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--ground)",
            textDecoration: "none",
          }}
        >
          <FieldMark size="sm" />
          <span className="t-wordmark" style={{ fontSize: 11 }}>
            Studio Lab BH
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul
          className="nav-desktop"
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 0 auto",
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
              href="mailto:Brendon@studiolabbh.xyz"
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

        {/* Hamburger — mobile only */}
        <button
          className="nav-ham"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--ground)",
              transition: `transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out)`,
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--ground)",
              transition: `opacity 0.3s var(--ease-out)`,
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--ground)",
              transition: `transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out)`,
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Soft overlay */}
      <div
        className="nav-overlay"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={close}
        aria-hidden
      />

      {/* Slide-in panel */}
      <div
        className="nav-panel"
        style={{ transform: menuOpen ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!menuOpen}
      >
        <ul
          style={{
            listStyle: "none",
            padding: "56px 32px 40px",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {LINKS.map((link) => (
            <li key={link.href} style={{ borderBottom: "0.5px solid var(--hairline)" }}>
              <Link
                href={link.href}
                className="t-h3 link-quiet"
                onClick={close}
                style={{
                  display: "block",
                  color: "var(--ground)",
                  textDecoration: "none",
                  padding: "20px 0",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ paddingTop: 32 }}>
            <Link
              href="mailto:Brendon@studiolabbh.xyz"
              className="t-nav link-quiet"
              onClick={close}
              style={{
                display: "inline-block",
                color: "var(--ground)",
                textDecoration: "none",
                border: "1px solid var(--ground)",
                padding: "12px 28px",
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-root { padding: 0 var(--pad-x) !important; height: 72px !important; }
        }
        .nav-desktop {
          display: none;
          gap: 28px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
        }
        .nav-ham {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 4px;
          margin-left: auto;
        }
        @media (min-width: 768px) {
          .nav-ham { display: none; }
        }
        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 44;
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          transition: opacity 0.4s var(--ease-out);
        }
        .nav-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 85vw);
          background: rgba(243, 242, 242, 0.97);
          backdrop-filter: saturate(1.2) blur(12px);
          -webkit-backdrop-filter: saturate(1.2) blur(12px);
          border-left: 0.5px solid var(--hairline-strong);
          z-index: 45;
          transition: transform 0.4s var(--ease-out);
          overflow-y: auto;
        }
        @media (min-width: 768px) {
          .nav-overlay { display: none; }
          .nav-panel { display: none; }
        }
      `}</style>
    </>
  );
}
