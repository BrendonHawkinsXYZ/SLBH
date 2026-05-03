import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="hairline-t"
      style={{
        padding: "24px var(--pad-x-mobile)",
      }}
    >
      <div
        className="container-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            fontSize: 11,
            color: "var(--ground)",
            opacity: 0.72,
          }}
        >
          © 2026 Studio Lab BH
        </span>
        <Link
          href="https://instagram.com/studiolabbh"
          target="_blank"
          rel="noreferrer noopener"
          className="t-label link-quiet"
          style={{
            color: "var(--ground)",
            textDecoration: "none",
            letterSpacing: "0.18em",
          }}
        >
          Instagram ↗︎
        </Link>
      </div>
    </footer>
  );
}
