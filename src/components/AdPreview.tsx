import type { ProductInput } from "@/types/product";
import { conditionOptions } from "@/types/product";
import { formatPrice, generateShortDescription } from "@/lib/generators";
import { formatProductName, formatDisplayName } from "@/lib/product-formatting";
import { Icon } from "@/components/Icon";

export function AdPreview({ input }: { input: ProductInput }) {
  const name = input.name.trim() ? formatProductName(input) : "";
  const price = formatPrice(input.price, input.currency);
  const condition = conditionOptions.find((item) => item.value === input.condition)?.label;
  const description = name ? generateShortDescription(input) : "";
  const hasData = name || price || condition || input.location.trim();

  return (
    <section className="ad-preview-section" aria-labelledby="preview-heading">
      <div className="builder-side-heading">
        <h2 id="preview-heading">Vista previa</h2>
        <span>Se actualiza al escribir</span>
      </div>
      {hasData ? (
        <div className="sale-preview">
          <div className="sale-preview-top">
            <span className="sale-preview-icon">
              <Icon name="tag" size={20} />
            </span>
            <span>Tu publicación</span>
            {condition && <span className="sale-condition">{condition}</span>}
          </div>
          {name && <h3>{name}</h3>}
          {price && <p className="sale-price">{price}</p>}
          {description && <p className="sale-description">{description}</p>}
          {input.location.trim() && (
            <p className="sale-location">
              <Icon name="pin" size={16} />
              {formatDisplayName(input.location)}
            </p>
          )}
        </div>
      ) : (
        <div className="preview-empty">
          <span className="icon-box green">
            <Icon name="tag" size={26} />
          </span>
          <h3>Tu producto, bien presentado</h3>
          <p>Escribe los datos y verás cómo podría quedar tu publicación.</p>
        </div>
      )}
      <p className="builder-note">Una vista orientativa. Tú decides dónde publicarlo.</p>
    </section>
  );
}
