import manifest from "../data/images.json";

// The manifest stores root-absolute paths ("/img/..."). Rewrite them to include
// Vite's base so images resolve under the GitHub Pages project subpath.
const BASE = import.meta.env.BASE_URL;
const withBase = (path) => path.replaceAll("/img/", `${BASE}img/`);

/**
 * Responsive <picture> backed by the build-time image manifest.
 * Serves AVIF -> WebP -> JPEG fallback with srcset + lazy loading.
 *
 * @param {string} name  original filename key in images.json (e.g. "hero.jpg")
 */
export default function Image({ name, alt = "", sizes = "100vw", className, eager = false, style }) {
  const m = manifest[name];
  if (!m) {
    // graceful fallback if an asset is missing from the manifest
    return <img src={`${BASE}img/${name}`} alt={alt} className={className} loading="lazy" style={style} />;
  }
  return (
    <picture>
      <source type="image/avif" srcSet={withBase(m.srcset.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={withBase(m.srcset.webp)} sizes={sizes} />
      <img
        src={withBase(m.fallback)}
        alt={alt}
        width={m.width}
        height={m.height}
        className={className}
        style={style}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}
