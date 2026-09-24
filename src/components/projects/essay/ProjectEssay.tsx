import Image from "next/image";
import Link from "next/link";
import { projectFiles } from "@/lib/projectFiles";
import { chromaWorkshop } from "@/lib/chromaWorkshop";
import { ACGStory, GeometryStory, WorkshopStory } from "./ProjectStories";
import { ResearchStory } from "./ResearchStories";
import { ProjectDetails } from "./ProjectDetails";
import styles from "./ProjectEssay.module.css";

export type EssaySlug = "acg" | "affective-geometry" | "tell-me-how-you-feel-chroma" | "affective-sculptural-sketches" | "american-emotions" | "global-emotions" | "convergent-grammar" | "tihif-nyc";

function projectFor(slug: string) {
  return slug === "tell-me-how-you-feel-chroma" ? chromaWorkshop : projectFiles[slug];
}

export function ProjectEssay({ slug }: { slug: EssaySlug }) {
  const project = projectFor(slug);
  const related = project.references.flatMap((reference) => {
    if (!reference.href.startsWith("/projects/")) return [];
    const relatedSlug = reference.href.slice("/projects/".length);
    const record = projectFor(relatedSlug);
    if (!record) return [];
    const preferred = relatedSlug === "affective-geometry" ? "plate-rhombus.png" : relatedSlug === "tell-me-how-you-feel-chroma" ? "at-the-table.webp" : relatedSlug === "acg" ? "installation-storefront.png" : null;
    const image = record.images.find((image) => preferred && image.src.endsWith(preferred)) ?? record.images[0];
    return image ? [{ ...reference, image }] : [];
  }).slice(0, 3);

  return <article className={styles.essayPage}>
    {slug === "acg" ? <ACGStory /> : slug === "affective-geometry" ? <GeometryStory /> : slug === "tell-me-how-you-feel-chroma" ? <WorkshopStory /> : <ResearchStory slug={slug} project={project} />}
    <ProjectDetails project={project} />
    {!!related.length && <section className={styles.furtherWork} aria-labelledby="related-work-title">
      <div className={styles.sectionTopline}><h2 id="related-work-title">Related work</h2><Link href="/projects">All work →</Link></div>
      <div className={styles.furtherGrid}>{related.map(({ href, title, image }) => <Link href={href} key={href}>
        <div><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) 100vw, 32vw" /></div>
        <p><span>{title}</span><span aria-hidden="true">↗</span></p>
      </Link>)}</div>
    </section>}
  </article>;
}
