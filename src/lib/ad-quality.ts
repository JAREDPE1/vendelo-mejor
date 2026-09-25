import { categoryFields, type CategoryField } from "../data/category-fields.ts";
import type { ProductDetailKey, ProductInput } from "../types/product.ts";
import { validateProductInput } from "./product-validation.ts";

export interface AdQuality {
  score: number;
  label: string;
  recommendations: { field: string; message: string }[];
  completed: number;
  total: number;
}

type GeneralField = Exclude<keyof ProductInput, "details">;
type RecommendationField = GeneralField | `details.${ProductDetailKey}`;

function isBlank(value: string | number | null | undefined): boolean {
  return value === null || value === undefined || (typeof value === "string" && !value.trim());
}

function comparisonKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Reject obvious filler without claiming to verify the truth of a seller's data. */
function usefulText(value: string | undefined): boolean {
  const key = comparisonKey(value ?? "");
  if (!key || !/\p{L}/u.test(key)) return false;
  if (
    /^(?:n a|na|no se|no aplica|sin datos|sin informacion|por definir|pendiente|desconocid[oa]|no disponible|asdf|qwerty|test|prueba)$/u.test(
      key,
    )
  ) {
    return false;
  }

  const compact = key.replace(/\s/gu, "");
  if (compact.length < 2 || new Set(compact).size < 2) return false;
  if (/^(.{1,12})\1{2,}$/u.test(compact)) return false;
  const words = key.split(" ");
  return words.length < 3 || new Set(words).size > 1;
}

function usefulModel(value: string): boolean {
  const model = value.trim();
  // Model identifiers can be entirely numeric (13, 3310, 911, Model 3).
  // Keep this exception local: a bare number is not descriptive free text.
  const numericModel =
    /^\d{1,16}$/u.test(model) && /[1-9]/u.test(model) && !/^(\d)\1{3,}$/u.test(model);
  return numericModel || usefulText(model);
}

function usefulDetail(field: CategoryField, value: string | undefined): boolean {
  // Numeric/select validity is checked centrally before evaluating usefulness.
  if (field.kind === "number") {
    return Boolean(value?.trim());
  }
  const text = value?.trim() ?? "";
  if (field.options) return field.options.includes(text);
  // These fields carry numeric information even when sellers omit the unit.
  // Scoring the supplied number does not add a unit or interpretation to it.
  if ((field.key === "storage" || field.key === "ram") && /^\d+(?:[.,]\d+)?$/u.test(text)) {
    const number = Number(text.replace(",", "."));
    return Number.isFinite(number) && number > 0;
  }
  if (field.key === "battery" && /^\d{1,3}(?:[.,]\d+)?\s*%?$/u.test(text)) {
    const number = Number(text.replace("%", "").replace(",", ".").trim());
    return number >= 0 && number <= 100;
  }
  return usefulText(value);
}

function disclosedUse(value: string): boolean {
  return (
    usefulText(value) &&
    /\b(?:uso|usad[oa]|desgaste|desgastad[oa]|rayon(?:es)?|rayad[oa]|grieta(?:s)?|golpe(?:s)?|falla(?:s)?|defecto(?:s)?|dan[oa](?:s)?|reparad[oa]|reparacion|reparar|averia(?:s)?|rota?|roto|sellad[oa]|empaque|funciona|enciende|marca(?:s)? de uso)\b/u.test(
      comparisonKey(value),
    )
  );
}

function qualityLabel(score: number): string {
  if (score < 30) return "Faltan datos";
  if (score < 50) return "Anuncio básico";
  if (score < 70) return "Puede mejorar";
  if (score < 85) return "Buen anuncio";
  return "Anuncio muy completo";
}

/**
 * Measures completeness, not sale probability or factual accuracy. Ten criteria
 * total 100 points: name 12, category 4, brand/model 5 each, price/state 10 each,
 * useful characteristics 30, location/delivery 8 each and disclosed use 8.
 * Characteristics earn six points per distinct fact, up to five; text length
 * alone never adds points. Only fields belonging to the active category count.
 * Recommendations are separate: only actually empty fields can be suggested,
 * even if a supplied value earns no quality points. Validation stays in the form.
 */
export function assessAdQuality(input: ProductInput): AdQuality {
  const validationErrors = validateProductInput(input);
  const fields = categoryFields[input.category] ?? [];
  const activeDetails = fields.filter(
    (field) =>
      !validationErrors[`detail-${field.key}`] && usefulDetail(field, input.details?.[field.key]),
  );
  const hasDetail = (key: ProductDetailKey) => activeDetails.some((field) => field.key === key);
  const freeFacts = input.features
    .split(/\r?\n|;|(?<=[\p{L}\p{N}])[.!?]\s+(?=\p{L})/u)
    .map((fact) => fact.replace(/^\s*[-•*]\s*/u, "").trim())
    .filter(usefulText);
  const factKeys = new Set([
    ...freeFacts.map(comparisonKey),
    ...activeDetails
      .filter((field) => field.key !== "defects")
      .map((field) => comparisonKey(input.details?.[field.key] ?? "")),
  ]);
  const hasName = usefulText(input.name);
  const genericName =
    /^(?:producto|articulo|objeto|celular|laptop|moto|auto|mueble|electrodomestico|telefono|televisor|tv)$/u.test(
      comparisonKey(input.name),
    );
  const specificName = hasName && !genericName;
  const hasCategory =
    Object.hasOwn(categoryFields, input.category) && (input.category !== "otros" || hasName);
  // Unbranded furniture can be precisely identified by its construction and size.
  const hasBrand =
    usefulText(input.brand) || (input.category === "muebles" && hasDetail("material"));
  const hasModel =
    usefulModel(input.model) || (input.category === "muebles" && hasDetail("dimensions"));
  const hasPrice = input.price !== null && !validationErrors.price;
  const hasCondition = ["nuevo", "como-nuevo", "usado"].includes(input.condition);
  const hasLocation = usefulText(input.location);
  const hasDelivery = usefulText(input.delivery);
  const hasDisclosure =
    hasDetail("defects") || hasDetail("usageTime") || freeFacts.some(disclosedUse);
  const characteristicsPoints = Math.min(5, factKeys.size) * 6;

  const criteria = [
    { points: hasName ? (specificName ? 12 : 6) : 0, maximum: 12 },
    { points: hasCategory ? 4 : 0, maximum: 4 },
    { points: hasBrand ? 5 : 0, maximum: 5 },
    { points: hasModel ? 5 : 0, maximum: 5 },
    { points: hasPrice ? 10 : 0, maximum: 10 },
    { points: hasCondition ? 10 : 0, maximum: 10 },
    { points: characteristicsPoints, maximum: 30 },
    { points: hasLocation ? 8 : 0, maximum: 8 },
    { points: hasDelivery ? 8 : 0, maximum: 8 },
    { points: hasDisclosure ? 8 : 0, maximum: 8 },
  ];
  const recommendations: AdQuality["recommendations"] = [];
  const recommend = (field: RecommendationField, message: string) => {
    const value = field.startsWith("details.")
      ? input.details?.[field.slice("details.".length) as ProductDetailKey]
      : input[field as GeneralField];
    if (isBlank(value)) recommendations.push({ field, message });
  };

  if (!hasName) recommend("name", "Añade el nombre del producto que vendes.");
  if (!hasCategory)
    recommend("category", "Selecciona la categoría que mejor describa tu producto.");
  if (!hasPrice) recommend("price", "Añade un precio válido para evitar consultas innecesarias.");
  if (!hasCondition) recommend("condition", "Indica el estado real del producto.");
  if (!hasBrand) recommend("brand", "Añade la marca, si la conoces.");
  if (!hasModel) recommend("model", "Añade el modelo, si lo conoces.");
  if (characteristicsPoints < 30) {
    recommend(
      "features",
      "Agrega características concretas que ayuden a decidir: medidas, capacidad, material o accesorios.",
    );
    const missingDetails = fields.filter(
      (field) => field.key !== "defects" && isBlank(input.details?.[field.key]),
    );
    for (const field of missingDetails.slice(0, 2)) {
      recommend(`details.${field.key}`, `Completa «${field.label}», si conoces ese dato.`);
    }
  }
  if (!hasDisclosure) {
    recommend(
      fields.some((field) => field.key === "defects") ? "details.defects" : "features",
      "Menciona detalles de uso, revisiones o fallas conocidas. Describe únicamente lo que has comprobado.",
    );
  }
  if (!hasLocation) recommend("location", "Añade tu ubicación: basta con la ciudad o el distrito.");
  if (!hasDelivery) recommend("delivery", "Especifica cómo realizarás la entrega o el recojo.");

  const score = criteria.reduce((sum, criterion) => sum + criterion.points, 0);
  return {
    score,
    label: qualityLabel(score),
    recommendations,
    completed: criteria.filter((criterion) => criterion.points === criterion.maximum).length,
    total: criteria.length,
  };
}
