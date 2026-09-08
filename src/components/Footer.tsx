import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer container-page">
      <span>© {new Date().getFullYear()} Studio Lab BH</span>
      <nav aria-label="Elsewhere and legal">
        <a href="https://instagram.com/studiolabbh" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        <Link href="/chroma/privacy">Privacy</Link>
        <Link href="/chroma/terms">Terms</Link>
      </nav>
    </footer>
  );
}
