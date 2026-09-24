import Link from "next/link";
import type { ReactNode } from "react";
import type { FileLink, ProjectFileData } from "@/components/projects/ProjectFile.types";
import styles from "./ProjectEssay.module.css";

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return <details><summary><span>{title}</span><span aria-hidden="true">+</span></summary><div>{children}</div></details>;
}

function Connections({ links }: { links: FileLink[] }) {
  return links.map((link) => <Link className={styles.referenceLink} href={link.href} key={link.href}><span>{link.title}{link.role && <small>{link.role}</small>}</span><span aria-hidden="true">↗</span></Link>);
}

export function ProjectDetails({ project }: { project: ProjectFileData }) {
  return <section id="research" className={styles.context}>
    <div><h2>Project details</h2><dl className={styles.facts}>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div>
    <div className={styles.notes}>
      <Disclosure title="About the project"><p className={styles.notesLead}>{project.summary}</p>{project.abstract.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{project.actions && <Connections links={project.actions} />}</Disclosure>
      <Disclosure title={project.title === "Tell Me How You Feel: ACG" ? "How the system works" : project.method.title}>
        {project.method.columns && <div className={styles.noteColumns}>{project.method.columns.map((column) => <div key={column.title}><h3>{column.title}</h3>{column.text && <p>{column.text}</p>}{column.steps && <ol>{column.steps.map((step) => <li key={step}>{step}</li>)}</ol>}</div>)}</div>}
        {project.method.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {project.method.details?.map((detail) => <div key={detail.title}><h3>{detail.title}</h3>{detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>)}
      </Disclosure>
      {project.sections?.map((section) => <Disclosure title={section.id === "observations" ? "Observations & open questions" : section.title} key={section.id}>
        {section.columns && <div className={styles.noteColumns}>{section.columns.map((column) => <div key={column.title}><h3>{column.title}</h3><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>}
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.questions && <ul>{section.questions.map((question) => <li key={question}>{question}</li>)}</ul>}
        {section.links && <Connections links={section.links} />}
      </Disclosure>)}
      {project.record && <Disclosure title={project.record.title}><dl>{project.record.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>{project.record.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Disclosure>}
      <Disclosure title="Research & connections"><Connections links={project.references} /></Disclosure>
    </div>
  </section>;
}
