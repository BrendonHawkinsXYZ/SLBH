import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import styles from "./tools.module.css";

export const metadata = {
  title: "Tools — Studio Lab BH",
  description: "Browser instruments for shape, colour, motion, and drawing.",
  robots: { index: false, follow: false },
};

export default function ToolsPage() {
  return (
    <section className={`container-page ${styles.directory}`}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1>Tools</h1>
          <span>{String(TOOLS.length).padStart(2, "0")} instruments</span>
        </div>
        <p>Shape, colour, motion, drawing. Instruments from the studio, running in your browser.</p>
      </header>

      <ul className={styles.list}>
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href} className={styles.row}>
              <span className={styles.name}>{tool.title}</span>
              <span className={styles.description}>{tool.line}</span>
              <span className={styles.output}>{tool.out}</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
