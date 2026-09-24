import Link from "next/link";
import type { FileFact, FileLink, ProjectFileData } from "./ProjectFile.types";
import { DocumentationCarousel } from "./DocumentationCarousel";
import styles from "./ProjectFile.module.css";

function FileLinkElement({ link, children }: { link: FileLink; children: React.ReactNode }) {
  return link.href.startsWith("https://") ? <a href={link.href} target="_blank" rel="noopener noreferrer">{children}</a> : <Link href={link.href}>{children}</Link>;
}

function Facts({ facts }: { facts: FileFact[] }) {
  return <dl className={styles.factList}>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}

export function ProjectFile({ project }: { project: ProjectFileData }) {
  const sections = [
    { id: "abstract", title: "Abstract" },
    { id: "method", title: project.method.title },
    ...(project.images.length ? [{ id: "documentation", title: "Documentation" }] : []),
    ...(project.record ? [{ id: "record", title: project.record.title }] : []),
    ...(project.references.length ? [{ id: "references", title: "References" }] : []),
  ];
  function heading(id: string) {
    const index = sections.findIndex((section) => section.id === id);
    return <h2><span>{String(index + 1).padStart(2, "0")}</span>{sections[index].title}</h2>;
  }

  return <article className={`container-page ${styles.file}`}>
    <header className={styles.fileHeader}>
      <div><h1>{project.title}</h1>{project.subtitle && <p className={styles.fileSubtitle}>{project.subtitle}</p>}</div>
      <p className={styles.fileStatement}>{project.statement}</p>
    </header>
    <div className={styles.fileGrid}>
      <aside className={styles.fileRail} aria-label="Project details and contents">
        <Facts facts={project.facts} />
        {!!project.actions?.length && <div className={styles.actions}>{project.actions.map((link) => <FileLinkElement key={link.href} link={link}>{link.title} ↗</FileLinkElement>)}</div>}
        <nav className={styles.contents} aria-label="File contents">{sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</nav>
      </aside>
      <div className={styles.fileBody}>
        <section id="abstract" className={styles.fileSection}>{heading("abstract")}<p className={styles.lead}>{project.summary}</p>{project.abstract.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
        <section id="method" className={styles.fileSection}>
          {heading("method")}
          {!!project.method.columns?.length && <div className={styles.fieldColumns}>{project.method.columns.map((column, index) => <div key={column.title}>
            <h3><span>{String.fromCharCode(65 + index)}</span>{column.title}</h3>
            {column.text && <p>{column.text}</p>}
            {column.steps && <ol className={styles.steps}>{column.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
          </div>)}</div>}
          {project.method.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {project.method.details?.map((detail) => <details key={detail.title} className={styles.disclosure}><summary>{detail.title}<span aria-hidden="true">+</span></summary>{detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</details>)}
        </section>
        {!!project.images.length && <section id="documentation" className={styles.fileSection}>{heading("documentation")}<DocumentationCarousel images={project.images} /></section>}
        {project.record && <section id="record" className={styles.fileSection}>{heading("record")}<Facts facts={project.record.facts} />{project.record.paragraphs?.map((paragraph) => <p className={styles.recordNote} key={paragraph}>{paragraph}</p>)}</section>}
        {!!project.references.length && <section id="references" className={styles.fileSection}>{heading("references")}<div className={styles.relatedRecords}>{project.references.map((link) => <FileLinkElement key={link.href} link={link}><span>{link.title}</span><span>{link.role}</span><span aria-hidden="true">↗</span></FileLinkElement>)}</div></section>}
      </div>
    </div>
  </article>;
}
