import { useEffect, useState } from "react";
import "./Header.css";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  // The gold logo/nav float over the page at every scroll position (a soft
  // text-shadow keeps them legible over the lighter Services band).
  return (
    <header className={`site-header is-dark-top ${open ? "is-open" : ""}`}>
      <div className="site-header__inner">
        <a href="#home" className="site-header__logo" aria-label="Interval Audio home" onClick={close}>
          Interval Audio
        </a>

        <nav className="site-header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="link-underline" onClick={close}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="site-header__burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className="site-header__overlay" aria-hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>{item.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
