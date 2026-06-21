import { useState } from "react";
import site from "../data/site.json";
import Image from "../components/Image.jsx";
import Reveal from "../components/Reveal.jsx";
import "./Home.css";

function Chevron() {
  return (
    <svg className="service__chevron" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  // accordion: every item collapsed by default
  const [open, setOpen] = useState(() => site.services.map(() => false));
  const toggle = (i) => setOpen((cur) => cur.map((v, j) => (j === i ? !v : v)));

  return (
    <>
      <section className="hero">
        <div className="hero__frame">
          <div className="hero__media">
            <Image name={site.heroImage} alt="" sizes="100vw" eager />
          </div>
          <div className="hero__scrim" />
          <div className="hero__grain" aria-hidden="true" />
          <div className="hero__content">
            <h1 className="hero__title">
              {site.tagline.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>
            <p className="hero__subhead">{site.subhead}</p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services__inner">
          <Reveal as="h2" className="services__heading">Services</Reveal>
          <div className="services__list">
            {site.services.map((s, i) => (
              <Reveal as="div" className="service" key={s.title} delay={i * 80}>
                <button
                  type="button"
                  className="service__head"
                  aria-expanded={open[i]}
                  onClick={() => toggle(i)}
                >
                  <h3 className="service__title">{s.title}</h3>
                  <Chevron />
                </button>
                <div className={`service__body ${open[i] ? "is-open" : ""}`}>
                  <p>{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const Head = () => null;
