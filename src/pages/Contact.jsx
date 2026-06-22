import { useState } from "react";
import site from "../data/site.json";
import Reveal from "../components/Reveal.jsx";
import "./Contact.css";

// Formspree form ID, supplied via env (see .env.example). Kept out of source so
// the same build works across environments.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export default function Contact() {
  const { contact } = site;
  const [form, setForm] = useState({ fname: "", lname: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.target),
      });
      if (res.ok) {
        setStatus("ok");
        setForm({ fname: "", lname: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact__inner">
        <Reveal as="h2" className="contact__heading">{contact.heading}</Reveal>

        {status === "ok" ? (
          <Reveal className="contact__thanks" role="status">
            Thanks so much for reaching out. I’ll be in touch with you soon.
          </Reveal>
        ) : (
          <Reveal as="form" className="contact__form" onSubmit={onSubmit} delay={80}>
            <p className="contact__required">All fields required</p>

            {/* honeypot: hidden from people, catches bots (Formspree convention) */}
            <input
              type="text"
              name="_gotcha"
              tabIndex="-1"
              autoComplete="off"
              className="contact__honeypot"
              aria-hidden="true"
            />

            <fieldset className="contact__name">
              <legend>Name</legend>
              <label>
                <span>First Name</span>
                <input name="fname" type="text" value={form.fname} onChange={update} required />
              </label>
              <label>
                <span>Last Name</span>
                <input name="lname" type="text" value={form.lname} onChange={update} required />
              </label>
            </fieldset>
            <label>
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={update} required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="6" value={form.message} onChange={update} required />
            </label>
            <button type="submit" className="contact__submit" disabled={status === "sending"}>
              {status === "sending" ? "SENDING…" : "SEND"}
            </button>
            {status === "error" && (
              <p className="contact__error" role="alert">
                Something went wrong. Please try again or email{" "}
                <a className="link-underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
              </p>
            )}
          </Reveal>
        )}
      </div>

      <div className="contact__divider" aria-hidden="true">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path d="M0,55 C360,110 1080,0 1440,55 L1440,110 L0,110 Z" fill="var(--footer-bg)" />
        </svg>
      </div>
    </section>
  );
}
