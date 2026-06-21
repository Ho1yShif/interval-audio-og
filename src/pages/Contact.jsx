import { useState } from "react";
import site from "../data/site.json";
import Reveal from "../components/Reveal.jsx";
import "./Contact.css";

export default function Contact() {
  const { contact } = site;
  const [form, setForm] = useState({ fname: "", lname: "", email: "", message: "" });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Submission backend is intentionally deferred — match the live form's structure
  // only for now. Wire to mailto / Formspree / a hosted handler later.
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="section contact">
      <div className="container contact__inner">
        <Reveal as="h1" className="contact__heading">{contact.heading}</Reveal>

        <Reveal as="form" className="contact__form" onSubmit={onSubmit} delay={80}>
          <fieldset className="contact__name">
            <legend>Name</legend>
            <label>
              <span>First Name <em>(required)</em></span>
              <input name="fname" type="text" value={form.fname} onChange={update} required />
            </label>
            <label>
              <span>Last Name <em>(required)</em></span>
              <input name="lname" type="text" value={form.lname} onChange={update} required />
            </label>
          </fieldset>
          <label>
            <span>Email <em>(required)</em></span>
            <input name="email" type="email" value={form.email} onChange={update} required />
          </label>
          <label>
            <span>Message <em>(required)</em></span>
            <textarea name="message" rows="6" value={form.message} onChange={update} required />
          </label>
          <button type="submit" className="contact__submit">SEND</button>
        </Reveal>
      </div>

      <div className="contact__divider" aria-hidden="true">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path d="M0,55 C360,110 1080,0 1440,55 L1440,110 L0,110 Z" fill="var(--footer-bg)" />
        </svg>
      </div>
    </section>
  );
}
