import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const EXTS = ["webp", "jpg", "jpeg", "png"];

/**
 * Resolves the first asset that exists at public/{dir}/{base}.{ext} and returns
 * its public URL, or "" when nothing is on disk yet. Pages ship with empty
 * image slots that fill in on their own as files land in /public.
 */
export function findAsset(dir: string, base: string): string {
  const rel = dir.replace(/^\/+|\/+$/g, "");
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(PUBLIC_DIR, rel, `${base}.${ext}`))) {
      return `/${rel}/${base}.${ext}`;
    }
  }
  return "";
}
