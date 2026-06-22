// Optimize originals -> responsive AVIF/WebP/JPEG in public/img/.
// Emits src/data/images.json manifest consumed by the <Image> component.
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets", "originals");
const OUT = path.join(ROOT, "public", "img");
const WIDTHS = [400, 800, 1200, 1600, 2000];
const Q = { avif: 50, webp: 74, jpg: 80 };

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const manifest = {};

for (const file of files) {
  const base = file.replace(/\.[^.]+$/, "");
  const img = sharp(path.join(SRC, file));
  const meta = await img.metadata();
  const intrinsic = meta.width || WIDTHS.at(-1);
  const intrinsicH = meta.height || 0;
  const targets = [...new Set(WIDTHS.filter((w) => w < intrinsic).concat(intrinsic))].sort((a, b) => a - b);

  const sources = { avif: [], webp: [] };
  let fallback = null;

  for (const w of targets) {
    const resized = sharp(path.join(SRC, file)).resize({ width: w, withoutEnlargement: true });
    const avifName = `${base}-${w}.avif`;
    const webpName = `${base}-${w}.webp`;
    await resized.clone().avif({ quality: Q.avif }).toFile(path.join(OUT, avifName));
    await resized.clone().webp({ quality: Q.webp }).toFile(path.join(OUT, webpName));
    sources.avif.push({ w, url: `/img/${avifName}` });
    sources.webp.push({ w, url: `/img/${webpName}` });
    if (w === targets.at(-1)) {
      const jpgName = `${base}-${w}.jpg`;
      await resized.clone().jpeg({ quality: Q.jpg, mozjpeg: true }).toFile(path.join(OUT, jpgName));
      fallback = `/img/${jpgName}`;
    }
  }

  manifest[file] = {
    width: intrinsic,
    height: intrinsicH,
    aspectRatio: intrinsicH ? +(intrinsic / intrinsicH).toFixed(4) : null,
    srcset: {
      avif: sources.avif.map((s) => `${s.url} ${s.w}w`).join(", "),
      webp: sources.webp.map((s) => `${s.url} ${s.w}w`).join(", "),
    },
    fallback,
  };
  console.log(`optimized ${file} (${intrinsic}px -> ${targets.length} sizes)`);
}

await writeFile(path.join(ROOT, "src", "data", "images.json"), JSON.stringify(manifest, null, 2));
console.log(`Wrote images.json (${Object.keys(manifest).length} images)`);
