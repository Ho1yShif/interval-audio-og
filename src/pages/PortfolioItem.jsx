import { useParams, Link } from "react-router-dom";
import portfolio from "../data/portfolio.json";
import Reveal from "../components/Reveal.jsx";
import "./PortfolioItem.css";

// render the description with the project's "lead" (its title as written in the
// copy) bolded, matching the live site's emphasis.
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

function Caret({ dir }) {
  // matches the live caret-left / caret-right pagination icon
  const points = dir === "left" ? "7.3,14.7 2.5,8 7.3,1.2" : "1.7,1.2 6.5,8 1.7,14.7";
  return (
    <svg className="pf-item__caret" viewBox="0 0 9 16" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioItem() {
  const { slug } = useParams();
  const index = portfolio.findIndex((p) => p.slug === slug);
  const item = index >= 0 ? portfolio[index] : null;

  if (!item) {
    return (
      <section className="section pf-item">
        <div className="container">
          <h1>Not found</h1>
          <Link to="/portfolio" className="link-underline">Back to portfolio</Link>
        </div>
      </section>
    );
  }

  const prev = index > 0 ? portfolio[index - 1] : null;
  const next = index < portfolio.length - 1 ? portfolio[index + 1] : null;

  return (
    <article className="section pf-item">
      <div className="container">
        {item.description && (
          <Reveal as="p" className="pf-item__desc">
            <Description text={item.description} lead={item.lead} />
          </Reveal>
        )}

        <Reveal as="nav" className="pf-item__nav" aria-label="Portfolio navigation">
          {prev && (
            <Link to={`/portfolio/${prev.slug}`} className="pf-item__link pf-item__link--prev">
              <Caret dir="left" />
              <span className="pagination-title-wrapper">
                <span className="pf-item__nav-label">Previous</span>
                <h2>{prev.title}</h2>
              </span>
            </Link>
          )}
          {next && (
            <Link to={`/portfolio/${next.slug}`} className="pf-item__link pf-item__link--next">
              <span className="pagination-title-wrapper">
                <span className="pf-item__nav-label">Next</span>
                <h2>{next.title}</h2>
              </span>
              <Caret dir="right" />
            </Link>
          )}
        </Reveal>
      </div>
    </article>
  );
}
