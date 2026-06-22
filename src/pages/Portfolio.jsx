import { useState, useEffect } from "react";
import portfolio from "../data/portfolio.json";
import site from "../data/site.json";
import PortfolioCard from "../components/PortfolioCard.jsx";
import Image from "../components/Image.jsx";
import Reveal from "../components/Reveal.jsx";
import "./Portfolio.css";

// Render the description with the project's "lead" (its title as written in the
// copy) bolded, matching the original site's emphasis.
function Description({ text, lead }) {
  if (!lead || !text.includes(lead)) return <>{text}</>;
  const i = text.indexOf(lead);
  return (
    <>
      {text.slice(0, i)}
      <strong>{lead}</strong>
      {text.slice(i + lead.length)}
    </>
  );
}

// Track how many poster columns the grid is showing (mirrors the breakpoints in
// Portfolio.css) so films can be grouped into rows and a full-width description
// panel can sit directly beneath the row of the clicked film.
function useColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const two = window.matchMedia("(max-width: 1100px)");
    const one = window.matchMedia("(max-width: 600px)");
    const update = () => setCols(one.matches ? 1 : two.matches ? 2 : 3);
    update();
    two.addEventListener("change", update);
    one.addEventListener("change", update);
    return () => {
      two.removeEventListener("change", update);
      one.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

// One full-width description panel per row. It stays mounted so it can animate
// as a smooth wipe in both directions (grid-rows 0fr↔1fr transition). `item` is
// the row's open film, or null when nothing in the row is open; we retain the
// last shown film through the closing wipe, then clear it. Clicking another
// film in the same row swaps the content (a quick fade), never stacks a box.
function RowPanel({ item, onClose }) {
  const [shown, setShown] = useState(item);
  useEffect(() => {
    if (item) setShown(item);
  }, [item]);
  const open = Boolean(item);

  return (
    <div
      className={`pf-panel ${open ? "is-open" : ""}`}
      id={shown ? `pf-panel-${shown.slug}` : undefined}
      role="region"
      aria-label={shown ? `${shown.title} description` : undefined}
      aria-hidden={!open}
      onTransitionEnd={() => {
        if (!item) setShown(null);
      }}
    >
      <div className="pf-panel__inner">
        {shown && (
          <div className="pf-panel__content" key={shown.slug}>
            <button
              type="button"
              className="pf-panel__close"
              onClick={() => onClose(shown.slug)}
              aria-label="Close description"
            >
              &times;
            </button>
            {shown.awards?.length > 0 && (
              <ul className="pf-badges">
                {shown.awards.map((a) => (
                  <li key={a} className="pf-badge">{a}</li>
                ))}
              </ul>
            )}
            <p className="pf-panel__text">
              <Description text={shown.description} lead={shown.lead} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Portfolio() {
  // At most one open film per row. Clicking a film in a row replaces whatever
  // was open in that row; clicking the open film closes it. Rows are
  // independent, so several rows can each show a description at once.
  const [open, setOpen] = useState(() => new Set());
  const toggle = (slug, rowItems) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        rowItems.forEach((it) => next.delete(it.slug));
        next.add(slug);
      }
      return next;
    });

  const cols = useColumns();
  const rows = [];
  for (let i = 0; i < portfolio.length; i += cols) {
    rows.push(portfolio.slice(i, i + cols));
  }

  return (
    <>
      {/* Upside-down copy of the home hero: its dark-olive top meets the gold
          Services band above, the bright sky/water carries the intro copy, and
          the dark base flows straight into the portfolio grid below. */}
      <section className="portfolio-hero" id="portfolio">
        <div className="portfolio-hero__media" aria-hidden="true">
          <Image name={site.heroImage} alt="" sizes="100vw" />
        </div>
        <div className="container">
          <Reveal as="div" className="portfolio-hero__intro">
            {site.portfolio.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section portfolio-grid">
        <div className="container">
          <Reveal as="h2" className="portfolio__heading">Selected Work</Reveal>
          <div className="portfolio__grid">
            {rows.map((row, r) => {
              const active = row.find((it) => open.has(it.slug)) || null;
              return (
                <div className="pf-rowgroup" key={r}>
                  <div className="pf-row">
                    {row.map((item, ci) => (
                      <Reveal as="div" className="pf-cell" key={item.slug} delay={ci * 70}>
                        <PortfolioCard
                          item={item}
                          isOpen={open.has(item.slug)}
                          onToggle={() => toggle(item.slug, row)}
                          sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                      </Reveal>
                    ))}
                  </div>
                  <RowPanel item={active} onClose={(slug) => toggle(slug, row)} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
