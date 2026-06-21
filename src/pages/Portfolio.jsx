import portfolio from "../data/portfolio.json";
import site from "../data/site.json";
import PortfolioCard from "../components/PortfolioCard.jsx";
import Image from "../components/Image.jsx";
import Reveal from "../components/Reveal.jsx";
import "./Portfolio.css";

export default function Portfolio() {
  return (
    <>
      {/* Upside-down copy of the home hero: its dark-olive top blends into the
          gold header, the bright sky band carries the intro copy, and the dark
          base flows straight into the portfolio grid below. */}
      <section className="portfolio-hero">
        <div className="portfolio-hero__media" aria-hidden="true">
          <Image name={site.heroImage} alt="" sizes="100vw" eager />
        </div>
        <div className="container">
          <Reveal as="div" className="portfolio-hero__intro">
            <p>I’m a New York–based audio creative working across documentary, television, and narrative film.</p>
            <p>My work has lived everywhere from independent projects to platforms like HBO, Netflix, and Adult Swim — shaped by a focus on subtlety, rhythm, and the space between moments.</p>
            <p>Recognized with an Emmy nomination and two Golden Reel nominations for Sound Editing, I’m drawn to stories that feel intimate, immersive, and quietly powerful.</p>
          </Reveal>
        </div>
      </section>

      <section className="section portfolio-grid">
        <div className="container">
          <div className="portfolio__grid">
            {portfolio.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 70}>
                <PortfolioCard item={item} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
