import type { ReactNode } from "react";
import styles from "./project-documents.module.css";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className={styles.documents}>{children}</div>;
}
