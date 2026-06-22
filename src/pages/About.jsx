import site from "../data/site.json";
import Image from "../components/Image.jsx";
import Reveal from "../components/Reveal.jsx";
import "./About.css";

export default function About() {
  const { about } = site;
  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div className="about__text">
          <Reveal as="h2">{about.heading}</Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 60}>{p}</Reveal>
          ))}
        </div>

        {about.images?.length > 0 && (
          <div className="about__gallery">
            {about.images.map((img, i) => (
              <Reveal key={img} delay={i * 90}>
                <Image name={img} alt="" sizes="(max-width: 900px) 100vw, 40vw" />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
