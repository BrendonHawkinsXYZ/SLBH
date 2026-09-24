import type { Metadata } from "next";
import { StudyNav } from "@/components/projects/acg-studies/StudyNav";
import styles from "@/components/projects/acg-studies/studies.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProjectStudiesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`container-page ${styles.studies}`}><StudyNav />{children}</div>;
}
