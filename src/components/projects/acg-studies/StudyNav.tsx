"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./studies.module.css";

const studies = [
  { href: "/test-1", title: "Test 1", name: "Project file" },
  { href: "/test-2", title: "Test 2", name: "Field report" },
  { href: "/test-3", title: "Test 3", name: "Evidence index" },
];

export function StudyNav() {
  const pathname = usePathname();
  return (
    <div className={styles.studyBar}>
      <span className={styles.studyLabel}>ACG / Page studies</span>
      <nav aria-label="Project page studies" className={styles.studyNav}>
        {studies.map((study) => (
          <Link key={study.href} href={study.href} aria-current={pathname === study.href ? "page" : undefined}>
            {study.title}<span>{study.name}</span>
          </Link>
        ))}
      </nav>
      <Link className={styles.originalLink} href="/projects/acg">Current page ↗</Link>
    </div>
  );
}
