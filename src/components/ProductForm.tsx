"use client";

import { useRef, useState, type FormEvent, type ReactNode, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { ToolDefinition } from "@/data/tools";
import { categoryFields } from "@/data/category-fields";
import {
  categoryOptions,
  conditionOptions,
  currencyOptions,
  type ProductInput,
  type ProductCategory,
  type ProductDetails,
  type ProductDetailKey,
  type GeneratedAd,
} from "@/types/product";
import {
  generateAd,
  generateTitles,
  generateDescription,
  generateHashtags,
  generateWhatsApp,
} from "@/lib/generators";
import { validateProductInput, type ProductErrors } from "@/lib/product-validation";
import { FormField } from "@/components/FormField";
import { GeneratedResult } from "@/components/GeneratedResult";
import { AdPreview } from "@/components/AdPreview";
import { AdQuality } from "@/components/AdQuality";
import { assessAdQuality } from "@/lib/ad-quality";
import { AdResults } from "@/components/AdResults";
import { Icon } from "@/components/Icon";

type ProductDraft = Omit<ProductInput, "price" | "details"> & { price: string };
type Result = { title: string; text: string };

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="builder-form-section">
      <div className="builder-section-title">
        <span className="step-number">{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export function ProductForm({ tool }: { tool: ToolDefinition }) {
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<ProductDraft>(() => ({
    name: "",
    category:
      categoryOptions.find((item) => item.value === searchParams.get("categoria"))?.value ||
      "otros",
    brand: "",
    model: "",
    price: "",
    currency: "PEN",
    condition: "",
    features: "",
    location: "",
    delivery: "",
  }));
  const [detailsByCategory, setDetailsByCategory] = useState<
    Partial<Record<ProductCategory, ProductDetails>>
  >({});
  const [results, setResults] = useState<Result[]>([]);
  const [ad, setAd] = useState<GeneratedAd | null>(null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<ProductErrors>({});
  const [version, setVersion] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isAd = tool.mode === "ad";
  const isHashtags = tool.mode === "hashtags";
  const needsDescription = tool.mode === "descriptions" || tool.mode === "whatsapp";
  const hasDelivery = isAd || needsDescription;
  const fields = categoryFields[draft.category];
  const details = isAd ? detailsByCategory[draft.category] || {} : {};
  const input: ProductInput = {
    ...draft,
    price: draft.price.trim() ? Number(draft.price) : null,
    details,
  };
  const categoryLabel =
    categoryOptions.find((item) => item.value === draft.category)?.label || "tu producto";
  const hasResults = Boolean(ad) || results.length > 0;
  const quality = isAd ? assessAdQuality(input) : null;

  function clearError(id: string) {
    setErrors((previous) => {
      if (!previous[id]) return previous;
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }
  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
    if (key === "category") setErrors({});
    else clearError(key);
  }
  function updateDetail(key: ProductDetailKey, value: string) {
    setDetailsByCategory((previous) => ({
      ...previous,
      [draft.category]: { ...previous[draft.category], [key]: value },
    }));
    setDirty(true);
    clearError(`detail-${key}`);
  }
  function focusField(field: string) {
    const id = field.replace("details.", "detail-");
    const control = formRef.current?.elements.namedItem(id);
    if (control instanceof HTMLElement) {
      control.focus({ preventScroll: true });
      control.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }
  function fieldState(id: string, hint = false) {
    return {
      "aria-invalid": Boolean(errors[id]),
      "aria-describedby":
        [hint ? `${id}-hint` : "", errors[id] ? `${id}-error` : ""].filter(Boolean).join(" ") ||
        undefined,
    };
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProductInput(input, {
      requirePrice: needsDescription,
      requireFeatures: needsDescription,
    });
    // Invalid numeric tokens can have an empty value while validity.badInput is true.
    for (const element of Array.from(event.currentTarget.elements)) {
      if (element instanceof HTMLInputElement && element.validity.badInput)
        nextErrors[element.id] = "Introduce un número válido o deja el campo vacío.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusField(Object.keys(nextErrors)[0]);
      return;
    }
    if (isAd) {
      setAd(generateAd(input, version));
      setVersion((previous) => previous + 1);
    } else {
      switch (tool.mode) {
        case "titles":
          setResults(
            generateTitles(input).map((text, index) => ({ title: `Título ${index + 1}`, text })),
          );
          break;
        case "descriptions":
          setResults([{ title: "Tu descripción", text: generateDescription(input) }]);
          break;
        case "hashtags":
          setResults([{ title: "Tus hashtags", text: generateHashtags(input).join(" ") }]);
          break;
        case "whatsapp":
          setResults([{ title: "Tu texto para WhatsApp", text: generateWhatsApp(input) }]);
          break;
      }
    }
    setDirty(false);
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  const resultContent = (
    <>
      <div className="builder-results-heading">
        <div>
          <span className="eyebrow">TUS TEXTOS, EN UN SOLO LUGAR</span>
          <h2>
            {hasResults ? "Tu anuncio está listo para revisar" : "Aquí aparecerán tus textos"}
          </h2>
          <p>
            {hasResults
              ? "Elige, revisa y copia. Tú decides cuándo publicarlo."
              : "Completa los datos y genera tu primera versión."}
          </p>
        </div>
        {hasResults && (
          <button
            type="button"
            className="button button-outline"
            onClick={() => focusField("name")}
          >
            <Icon name="edit" size={17} />
            Editar datos
          </button>
        )}
      </div>
      {dirty && hasResults && (
        <p className="notice" role="status">
          {isAd
            ? "Estos textos corresponden a la última generación. Has cambiado datos: pulsa «Actualizar mi anuncio» para incluirlos."
            : "Has cambiado los datos. Vuelve a generar para actualizar estos textos."}
        </p>
      )}
      {ad ? (
        <AdResults ad={ad} />
      ) : results.length ? (
        <div className="results-list">
          {results.map((result) => (
            <GeneratedResult key={result.title} {...result} />
          ))}
        </div>
      ) : (
        <div className="builder-results-empty">
          <Icon name="align" size={25} />
          <p>
            {isAd
              ? "Recibirás 3 títulos, descripciones, características y textos para WhatsApp, Marketplace e Instagram, además de hashtags."
              : "Tus resultados aparecerán aquí, listos para copiar."}
          </p>
        </div>
      )}
      {hasResults && (
        <>
          <p className="sr-only" role="status">
            {ad
              ? "Se generaron tres títulos y siete resultados adicionales."
              : `Se generaron ${results.length} resultados.`}
          </p>
          <p className="result-footnote">
            Antes de compartir, revisa precios, características y condiciones. Las plantillas
            organizan tus datos; no verifican el producto.
          </p>
        </>
      )}
    </>
  );

  return (
    <div className={isAd ? "ad-builder" : "compact-product-tool"}>
      <div className={isAd ? "builder-workspace" : "workspace-grid"}>
        <form
          ref={formRef}
          className={`form-panel ${isAd ? "builder-form" : ""}`}
          onSubmit={submit}
          noValidate
        >
          {isAd && (
            <div className="builder-form-intro">
              <span>Tu próximo anuncio empieza aquí</span>
              <p>Solo el nombre es obligatorio. Cada detalle que añadas hará el texto más útil.</p>
              {quality && (
                <a href="#quality-heading" className="builder-quality-link">
                  <span>
                    {quality.score} / 100 · {quality.label}
                  </span>
                  <span>
                    Ver recomendaciones
                    <Icon name="arrow" size={15} />
                  </span>
                </a>
              )}
            </div>
          )}
          <FormSection
            number="1"
            title="Lo esencial de tu producto"
            description="Ayuda a quien compra a identificar lo que ofreces."
          >
            <FormField id="name" label="Nombre del producto" className="full" error={errors.name}>
              <input
                id="name"
                name="name"
                required
                maxLength={90}
                placeholder="Ej. iPhone 13 de 128 GB"
                autoComplete="off"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                {...fieldState("name")}
              />
            </FormField>
            <FormField id="category" label="Categoría">
              <select
                id="category"
                name="category"
                value={draft.category}
                onChange={(event) => update("category", event.target.value as ProductCategory)}
              >
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="condition" label="Estado" optional>
              <select
                id="condition"
                name="condition"
                value={draft.condition}
                onChange={(event) =>
                  update("condition", event.target.value as ProductInput["condition"])
                }
              >
                <option value="">Sin especificar</option>
                {conditionOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </FormField>
            {!isHashtags && (
              <>
                <FormField
                  id="price"
                  label="Precio"
                  optional={!needsDescription}
                  error={errors.price}
                >
                  <input
                    id="price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="999999999"
                    step="0.01"
                    required={needsDescription}
                    placeholder="0.00"
                    value={draft.price}
                    onChange={(event) => update("price", event.target.value)}
                    {...fieldState("price")}
                  />
                </FormField>
                <FormField id="currency" label="Moneda">
                  <select
                    id="currency"
                    name="currency"
                    value={draft.currency}
                    onChange={(event) =>
                      update("currency", event.target.value as ProductInput["currency"])
                    }
                  >
                    {currencyOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </>
            )}
          </FormSection>
          <FormSection
            number="2"
            title={
              isAd && draft.category !== "otros"
                ? `Detalles de ${categoryLabel.toLowerCase()}`
                : "Los detalles que lo distinguen"
            }
            description={
              isAd
                ? "Todos son opcionales. Completa solo lo que conozcas."
                : "La marca y el modelo ayudan a reconocer tu producto."
            }
          >
            <FormField id="brand" label="Marca" optional>
              <input
                id="brand"
                name="brand"
                maxLength={50}
                placeholder="Si la conoces"
                value={draft.brand}
                onChange={(event) => update("brand", event.target.value)}
              />
            </FormField>
            <FormField id="model" label="Modelo" optional>
              <input
                id="model"
                name="model"
                maxLength={60}
                placeholder="Si corresponde"
                value={draft.model}
                onChange={(event) => update("model", event.target.value)}
              />
            </FormField>
            {isAd &&
              fields.map((field) => {
                const id = `detail-${field.key}`;
                const common = {
                  id,
                  name: id,
                  value: details[field.key] || "",
                  onChange: (
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                  ) => updateDetail(field.key, event.target.value),
                  ...fieldState(id, Boolean(field.hint)),
                };
                return (
                  <FormField
                    key={`${draft.category}-${field.key}`}
                    id={id}
                    label={field.label}
                    optional
                    hint={field.hint}
                    error={errors[id]}
                    className={field.kind === "textarea" ? "full" : ""}
                  >
                    {field.kind === "select" ? (
                      <select {...common}>
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.kind === "textarea" ? (
                      <textarea
                        {...common}
                        rows={3}
                        maxLength={field.maxLength || 800}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        {...common}
                        type={field.kind === "number" ? "number" : "text"}
                        inputMode={field.kind === "number" ? "decimal" : undefined}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        maxLength={field.maxLength || 160}
                        placeholder={field.placeholder}
                      />
                    )}
                  </FormField>
                );
              })}
            {isAd && fields.length === 0 && (
              <p className="builder-category-note full">
                <Icon name="info" size={16} />
                Al elegir una categoría, verás campos específicos para ese producto.
              </p>
            )}
          </FormSection>
          <FormSection
            number="3"
            title={isHashtags ? "Dónde lo vendes" : "Descripción y entrega"}
            description={
              isHashtags
                ? "La ubicación es opcional; no incluyas tu dirección exacta."
                : "Añade lo que falta y explica cómo coordinar la compra."
            }
          >
            {!isHashtags && (
              <FormField
                id="features"
                label="Descripción o características"
                optional={!needsDescription}
                hint={
                  isAd
                    ? "No hace falta repetir los campos anteriores. Añade otros datos reales, separados por líneas."
                    : "Escribe una característica por línea. Incluye los detalles de uso."
                }
                className="full"
                error={errors.features}
              >
                <textarea
                  id="features"
                  name="features"
                  rows={4}
                  maxLength={3000}
                  required={needsDescription}
                  placeholder="Ej. Comprado hace dos años. Una marca visible en el lateral. Puedo mostrar fotos del detalle."
                  value={draft.features}
                  onChange={(event) => update("features", event.target.value)}
                  {...fieldState("features", true)}
                />
              </FormField>
            )}
            <FormField
              id="location"
              label="Ubicación"
              optional
              hint="Ciudad o distrito. Evita tu dirección exacta."
              className={hasDelivery ? "" : "full"}
            >
              <input
                id="location"
                name="location"
                maxLength={80}
                placeholder="Ej. Miraflores, Lima"
                value={draft.location}
                onChange={(event) => update("location", event.target.value)}
                aria-describedby="location-hint"
              />
            </FormField>
            {hasDelivery && (
              <FormField id="delivery" label="Método de entrega" optional>
                <input
                  id="delivery"
                  name="delivery"
                  maxLength={200}
                  placeholder="Ej. Recojo previa coordinación"
                  value={draft.delivery}
                  onChange={(event) => update("delivery", event.target.value)}
                />
              </FormField>
            )}
          </FormSection>
          <div className="builder-submit-area">
            {Object.keys(errors).length > 0 && (
              <div className="form-error" role="alert">
                <strong>Revisa los campos señalados.</strong>
                <span> Corrige la información para generar tu anuncio.</span>
              </div>
            )}
            <button className="button button-primary submit-button" type="submit">
              <Icon name="sparkles" size={19} />
              {isAd && hasResults
                ? dirty
                  ? "Actualizar mi anuncio"
                  : "Generar otra versión"
                : tool.action}
              <Icon name="arrow" size={18} />
            </button>
            <p className="form-privacy">
              <Icon name="shield" size={14} />
              Sin registro. Tus datos se procesan en este navegador.
            </p>
            {isAd && (
              <p className="builder-note centered-note">
                Se usan únicamente los datos que introduces. No se añaden garantías ni
                características inventadas.
              </p>
            )}
          </div>
        </form>
        {isAd ? (
          <aside className="builder-sidebar">
            <AdPreview input={input} />
            {quality && <AdQuality quality={quality} onFocusField={focusField} />}
          </aside>
        ) : (
          <div
            ref={resultRef}
            tabIndex={-1}
            className="results-panel"
            aria-label="Resultados generados"
          >
            {resultContent}
          </div>
        )}
      </div>
      {isAd && (
        <div
          ref={resultRef}
          tabIndex={-1}
          className="builder-results"
          aria-label="Resultados generados"
        >
          {resultContent}
        </div>
      )}
    </div>
  );
}
