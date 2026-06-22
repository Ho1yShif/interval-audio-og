import site from "../data/site.json";
import { ICONS } from "./SocialIcons.jsx";
import "./Footer.css";

export default function Footer() {
  const { footer, social } = site;
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <h2>{footer.brand}</h2>
          <p>{footer.subhead}</p>
        </div>

        <ul className="site-footer__social" aria-label="Social links">
          {social.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
                {ICONS[s.name]}
              </a>
            </li>
          ))}
        </ul>

        <div className="site-footer__cols">
          <div>
            <h4>Location</h4>
            <p>{footer.location}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              <a className="link-underline" href={`mailto:${footer.email}`}>{footer.email}</a>
            </p>
          </div>
        </div>
      </div>

      <p className="site-footer__copyright">
        © {new Date().getFullYear()} {footer.brand}
      </p>
    </footer>
  );
}
