// One-time extraction of content + image assets from the live Squarespace site.
// Output: src/data/*.json (content) and assets/originals/* (downloaded images).
// Re-runnable; safe to delete assets/originals and regenerate.
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE = "https://interval-audio.com";
const UA = { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" } };
const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const ORIG_DIR = path.join(ROOT, "assets", "originals");

const get = async (url) => (await fetch(url, UA)).text();
const getJson = async (url) => (await fetch(url, UA)).json();

// --- HTML helpers -----------------------------------------------------------
const stripTags = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&rsquo;/g, "’")
   .replace(/&lsquo;/g, "‘").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
   .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&hellip;/g, "…")
   .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

// content images in section/blocks (full-res, no query params)
const imageUrls = (html) =>
  [...new Set((html.match(/https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"&?\\ ]+\.(?:jpg|jpeg|png|webp|gif|JPG|JPEG|PNG)/g) || [])
    .filter((u) => !u.includes("favicon"))) ];

const paragraphs = (html) =>
  [...html.matchAll(/<p\b[^>]*>(.*?)<\/p>/gs)]
    .map((m) => decode(stripTags(m[1])))
    .filter((t) => t.length > 2 && !t.includes("tweak"));

const videoEmbed = (html) => {
  const m =
    html.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/) ||
    html.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d+)/);
  if (!m) return null;
  const isVimeo = m[0].includes("vimeo");
  return { provider: isVimeo ? "vimeo" : "youtube", id: m[1] };
};

// --- download ---------------------------------------------------------------
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
async function download(url, name) {
  await mkdir(ORIG_DIR, { recursive: true });
  const ext = (url.match(/\.(jpg|jpeg|png|webp|gif)$/i) || [, "jpg"])[1].toLowerCase();
  const file = `${name}.${ext === "jpeg" ? "jpg" : ext}`;
  const dest = path.join(ORIG_DIR, file);
  if (existsSync(dest)) return file;
  // ?format=original gets the unresized master from Squarespace's CDN
  const res = await fetch(`${url}?format=original`, UA);
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("  downloaded", file);
  return file;
}

// --- main -------------------------------------------------------------------
await mkdir(DATA_DIR, { recursive: true });

// 1) Portfolio collection -> items
console.log("Fetching portfolio collection...");
const coll = await getJson(`${BASE}/portfolio?format=json-pretty`);
const rawItems = coll.items || [];
console.log(`  ${rawItems.length} items`);

const portfolio = [];
for (const it of rawItems) {
  const slug = it.urlId || slugify(it.title);
  const title = decode(it.title || "");
  console.log(`Item: ${title}`);
  const html = await get(`${BASE}${it.fullUrl}`);
  // feature image: prefer collection assetUrl, else first content image on page
  const pageImgs = imageUrls(html);
  const featureUrl = (it.assetUrl || pageImgs[0] || "").split("?")[0];
  let image = null;
  if (featureUrl) image = await download(featureUrl, `portfolio-${slug}`);
  // description: longest paragraph on the page that isn't footer boilerplate
  const ps = paragraphs(html).filter(
    (p) => !/Audio Services by Eli|eli\.intervalaudio|Brooklyn, NY/.test(p)
  );
  const description = ps.sort((a, b) => b.length - a.length)[0] || "";
  portfolio.push({ title, slug, image, description, video: videoEmbed(html) });
}
await writeFile(path.join(DATA_DIR, "portfolio.json"), JSON.stringify(portfolio, null, 2));
console.log(`Wrote portfolio.json (${portfolio.length})`);

// 2) Home
console.log("Fetching home...");
const homeHtml = await get(`${BASE}/home`);
const heroUrl = (imageUrls(homeHtml)[0] || "").split("?")[0];
const heroImage = heroUrl ? await download(heroUrl, "hero") : null;

// 3) About (bio + gallery)
console.log("Fetching about...");
const aboutHtml = await get(`${BASE}/about-2`);
const aboutImgUrls = imageUrls(aboutHtml).slice(0, 12);
const aboutImages = [];
for (let i = 0; i < aboutImgUrls.length; i++)
  aboutImages.push(await download(aboutImgUrls[i].split("?")[0], `about-${i + 1}`));
const aboutParas = paragraphs(aboutHtml).filter(
  (p) => !/Audio Services by Eli|eli\.intervalaudio|Brooklyn, NY/.test(p)
);

// 4) Favicon
let favicon = null;
const favM = homeHtml.match(/href="(https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"]+favicon\.ico)"/);
if (favM) {
  await mkdir(path.join(ROOT, "public"), { recursive: true });
  const res = await fetch(favM[1], UA);
  await writeFile(path.join(ROOT, "public", "favicon.ico"), Buffer.from(await res.arrayBuffer()));
  favicon = "/favicon.ico";
  console.log("  downloaded favicon.ico");
}

// 5) Site-wide content
const site = {
  brand: "Interval Audio",
  tagline: ["fill with sound the", "spaces between"],
  subhead: "Film and Media Audio Services by Eli Akselrod",
  heroImage,
  services: [
    { title: "Full-Service Audio Post Production", detail: "Dialogue Editing, SFX Editing/Sound Design, Re-Recording Mix" },
    { title: "Supervising Sound Supervision", detail: "Creative Direction, Department Oversight, Spotting Sessions, Pre-Dub and Mix Prep, Mix Attendance" },
    { title: "Sound Editing", detail: "Dialogue Editing, SFX Editing, or Sound Design in focused specialized role" },
  ],
  about: { heading: "Hi, I’m Eli Akselrod.", paragraphs: aboutParas, images: aboutImages },
  contact: { heading: "What’s your story?", email: "eli.intervalaudio@gmail.com" },
  footer: { brand: "Interval Audio", subhead: "Film and Media Audio Services by Eli Akselrod", location: "Brooklyn, NY", email: "eli.intervalaudio@gmail.com" },
  social: [
    { name: "IMDb", url: "https://www.imdb.com/name/nm14485197/" },
    { name: "Instagram", url: "https://www.instagram.com/" },
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
  favicon,
};
await writeFile(path.join(DATA_DIR, "site.json"), JSON.stringify(site, null, 2));
console.log("Wrote site.json");
console.log("DONE");
