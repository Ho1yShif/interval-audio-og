import Image from "./Image.jsx";

export default function PortfolioCard({ item, sizes, isOpen, onToggle }) {
  return (
    <button
      type="button"
      className={`pf-card ${isOpen ? "is-open" : ""}`}
      aria-label={item.title}
      aria-expanded={isOpen}
      aria-controls={`pf-panel-${item.slug}`}
      onClick={onToggle}
    >
      <div className="pf-card__media">
        {item.image ? (
          <Image name={item.image} alt={item.title} sizes={sizes} />
        ) : (
          <div className="pf-card__placeholder" />
        )}

        {/* award badges highlight a standout title (e.g. 100 Foot Wave); always
            visible, decorative here since the same awards appear in the panel */}
        {item.awards?.length > 0 && (
          <span className="pf-card__badges" aria-hidden="true">
            {item.awards.map((a) => (
              <span key={a} className="pf-badge">{a}</span>
            ))}
          </span>
        )}

        <div className="pf-card__overlay">
          <span className="pf-card__title">{item.title}</span>
        </div>
      </div>
    </button>
  );
}
