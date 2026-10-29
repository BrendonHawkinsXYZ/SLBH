import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const imageExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const mebibyte = 1024 ** 2;

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async entry => {
    if (entry.name === ".DS_Store") return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collect(absolute);
    if (!entry.isFile()) return [];
    return [{ file: path.relative(publicDirectory, absolute), bytes: (await stat(absolute)).size }];
  }));
  return groups.flat();
}

function summarize(files, groupBy) {
  const groups = new Map();
  for (const file of files) {
    const key = groupBy(file.file);
    const group = groups.get(key) ?? { count: 0, bytes: 0 };
    group.count += 1;
    group.bytes += file.bytes;
    groups.set(key, group);
  }
  return [...groups].sort((a, b) => b[1].bytes - a[1].bytes || a[0].localeCompare(b[0]));
}

const size = bytes => `${(bytes / mebibyte).toFixed(2)} MiB`;
const total = files => files.reduce((bytes, file) => bytes + file.bytes, 0);
const files = await collect(publicDirectory);
const images = files.filter(({ file }) => imageExtensions.has(path.extname(file).toLowerCase()));

console.log(`Public assets: ${files.length} files, ${size(total(files))}`);
console.log(`Images: ${images.length} files, ${size(total(images))}`);
console.log("These are source/deployment sizes; next/image serves responsive derivatives.");

for (const [label, groupBy] of [
  ["Images by format", file => path.extname(file).toLowerCase()],
  ["Images by folder", file => file.includes(path.sep) ? file.split(path.sep)[0] : "(root)"],
]) {
  console.log(`\n${label}:`);
  for (const [name, group] of summarize(images, groupBy)) {
    console.log(`  ${size(group.bytes).padStart(11)}  ${String(group.count).padStart(3)} files  ${name}`);
  }
}

console.log("\nLargest images:");
for (const image of [...images].sort((a, b) => b.bytes - a.bytes || a.file.localeCompare(b.file)).slice(0, 15)) {
  console.log(`  ${size(image.bytes).padStart(11)}  ${image.file}`);
}

const largeImages = images.filter(image => image.bytes > mebibyte);
console.log(`\n${largeImages.length} images exceed 1 MiB. Review these first; detailed artwork may justify larger files.`);
