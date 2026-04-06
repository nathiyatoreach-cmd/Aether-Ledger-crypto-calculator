import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const outDir = new URL("../out", import.meta.url);
const outPath = fileURLToPath(outDir);

function walk(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function prefixFor(filePath) {
  const relativeDir = relative(outPath, filePath)
    .split("\\")
    .slice(0, -1)
    .filter(Boolean);

  if (relativeDir.length === 0) {
    return "./";
  }

  return `${"../".repeat(relativeDir.length)}`;
}

const candidates = walk(outPath).filter((file) => /\.(html|txt)$/.test(file));

for (const file of candidates) {
  const prefix = prefixFor(file);
  const nextPrefix = `${prefix}_next/`;
  const iconPrefix = `${prefix}icon.svg`;
  const content = readFileSync(file, "utf8");
  const updated = content
    .replaceAll('"/_next/', `"${nextPrefix}`)
    .replaceAll("'/_next/", `'${nextPrefix}`)
    .replaceAll('"/icon.svg', `"${iconPrefix}`)
    .replaceAll("'/icon.svg", `'${iconPrefix}`);

  if (updated !== content) {
    writeFileSync(file, updated, "utf8");
  }
}

console.log("Relativized static export asset paths for Live Server use.");
