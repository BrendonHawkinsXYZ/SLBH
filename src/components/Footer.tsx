import Link from "next/link";

const FOOTER_LINK = {
  color: "var(--ground)",
  textDecoration: "none",
  letterSpacing: "0.18em",
} as const;

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
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Link href="/chroma/privacy" className="t-label link-quiet" style={FOOTER_LINK}>
            Privacy
          </Link>
          {/* Chroma ships under Apple's Standard EULA; no custom agreement. */}
          <Link
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            target="_blank"
            rel="noreferrer noopener"
            className="t-label link-quiet"
            style={FOOTER_LINK}
          >
            Terms of Use ↗︎
          </Link>
          <Link
            href="https://instagram.com/studiolabbh"
            target="_blank"
            rel="noreferrer noopener"
            className="t-label link-quiet"
            style={FOOTER_LINK}
          >
            Instagram ↗︎
          </Link>
        </nav>
      </div>
    </footer>
  );
}
