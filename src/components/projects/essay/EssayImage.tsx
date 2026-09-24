import Image from "next/image";
import type { ProjectFileData } from "../ProjectFile.types";
import styles from "./ProjectEssay.module.css";

export function EssayImage({ project, file, className = "", priority = false, caption, sizes = "(max-width: 760px) 100vw, 80vw" }: {
  project: ProjectFileData;
  file: string;
  className?: string;
  priority?: boolean;
  caption?: string;
  sizes?: string;
}) {
  const picture = project.images.find((item) => item.src.endsWith(`/${file}`));
  if (!picture) throw new Error(`Missing project image: ${project.title}/${file}`);
  return <figure className={`${styles.picture} ${className}`}>
    <Image src={picture.src} alt={picture.alt} width={picture.width} height={picture.height} sizes={sizes} priority={priority} />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}
