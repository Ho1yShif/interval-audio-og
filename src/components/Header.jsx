import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about-2", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close the mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // pages whose top section (behind the fixed header) is dark — the logo/nav
  // float in gold over them, like the home hero. /portfolio opens with an
  // upside-down copy of the hero whose dark-olive top blends into the header.
  const darkTop = ["/", "/portfolio", "/about-2", "/contact"].includes(location.pathname);

  return (
    <header className={`site-header ${darkTop ? "is-dark-top" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Interval Audio home">
          Interval Audio
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `link-underline ${isActive ? "is-active" : ""}`}
            >
              {item.label}
            </NavLink>
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
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
