import type { AdQuality as QualityAssessment } from "@/lib/ad-quality";
import { Icon } from "@/components/Icon";

export function AdQuality({
  quality,
  onFocusField,
}: {
  quality: QualityAssessment;
  onFocusField: (field: string) => void;
}) {
  function recommendationsList(items: QualityAssessment["recommendations"]) {
    return (
      <ul>
        {items.map((item) => (
          <li key={`${item.field}-${item.message}`}>
            <button type="button" onClick={() => onFocusField(item.field)}>
              <Icon name="plus" size={14} />
              <span>{item.message}</span>
              <Icon name="chevron" size={14} />
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <section className="ad-quality" aria-labelledby="quality-heading">
      <div className="builder-side-heading">
        <h2 id="quality-heading" tabIndex={-1}>
          Calidad de tu anuncio
        </h2>
        <Icon name="check" size={18} />
      </div>
      <div className="quality-score">
        <span>
          <strong>{quality.score}</strong>
          <span> / 100</span>
        </span>
        <span className="quality-label">{quality.label}</span>
      </div>
      <meter
        min={0}
        max={100}
        low={50}
        high={85}
        optimum={100}
        value={quality.score}
        aria-label={`Información del anuncio: ${quality.score} de 100`}
      >
        {quality.score} de 100
      </meter>
      <p className="builder-note">
        Mide lo completa y específica que es la información. No predice ventas ni verifica el
        producto.
      </p>
      {quality.recommendations.length > 0 ? (
        <div className="quality-recommendations">
          <h3>El siguiente detalle hace la diferencia</h3>
          {recommendationsList(quality.recommendations.slice(0, 4))}
          {quality.recommendations.length > 4 && (
            <details className="more-recommendations">
              <summary>Ver {quality.recommendations.length - 4} recomendaciones más</summary>
              {recommendationsList(quality.recommendations.slice(4))}
            </details>
          )}
        </div>
      ) : (
        <p className="quality-complete">
          <Icon name="check" size={17} />
          La información está muy completa. Revisa que todos los datos sean correctos.
        </p>
      )}
    </section>
  );
}
