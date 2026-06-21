import { Link } from "react-router-dom";
import Image from "./Image.jsx";

export default function PortfolioCard({ item, sizes }) {
  return (
    <Link to={`/portfolio/${item.slug}`} className="pf-card" aria-label={item.title}>
      <div className="pf-card__media">
        {item.image ? (
          <Image name={item.image} alt={item.title} sizes={sizes} />
        ) : (
          <div className="pf-card__placeholder" />
        )}
        <div className="pf-card__overlay">
          <span className="pf-card__title">{item.title}</span>
        </div>
      </div>
    </Link>
  );
}
