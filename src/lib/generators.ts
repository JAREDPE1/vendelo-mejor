import { categoryFields } from "../data/category-fields.ts";
import type {
  Currency,
  GeneratedAd,
  ImprovedAd,
  ProductInput,
  ProductDetailKey,
  ProductCategory,
} from "../types/product.ts";
import { categoryTemplates, conditionContext, conditionLabels } from "./ad-templates.ts";
import { formatProductName, formatDisplayName, formatDetailValue } from "./product-formatting.ts";

function oneLine(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function comparisonKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function distinct(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = comparisonKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function productName(input: ProductInput): string {
  return formatProductName(input) || categoryTemplates[input.category].fallbackName;
}

/** Keep whole name tokens, so URLs and model numbers are never cut midway. */
function shortName(input: ProductInput, limit: number): string {
  const name = productName(input);
  if (name.length <= limit) return name;
  const words: string[] = [];
  for (const word of name.split(" ")) {
    if ([...words, word].join(" ").length > limit - 1) break;
    words.push(word);
  }
  return words.length ? `${words.join(" ")}…` : categoryTemplates[input.category].fallbackName;
}

/** Formats only prices explicitly supplied by the seller. */
export function formatPrice(price: number | null, currency: Currency): string {
  if (price === null || !Number.isFinite(price) || price < 0) return "";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/** New lines and semicolons separate list items; decimals and commas stay intact. */
function suppliedFeatures(value: string): string[] {
  return distinct(
    value
      .split(/\r?\n|;/u)
      .map((line) => oneLine(line.replace(/^\s*(?:[-•*]\s+|\d+[.)]\s+)/u, "")))
      .filter(Boolean),
  );
}

function activeDetails(
  input: ProductInput,
): { key: ProductDetailKey; text: string; value: string }[] {
  return categoryFields[input.category].flatMap((field) => {
    const value = formatDetailValue(input.category, field.key, input.details?.[field.key] ?? "");
    const label = field.label.replace(/ \((?:km|cc)\)$/u, "");
    return value ? [{ key: field.key, text: `${label}: ${value}`, value }] : [];
  });
}

function featureList(input: ProductInput): string[] {
  return distinct([
    ...(oneLine(input.brand) ? [`Marca: ${formatDisplayName(input.brand)}`] : []),
    ...(oneLine(input.model) ? [`Modelo: ${formatDisplayName(input.model)}`] : []),
    ...(input.condition ? [`Estado: ${conditionLabels[input.condition]}`] : []),
    ...activeDetails(input).map(({ text }) => text),
    ...suppliedFeatures(input.features),
  ]);
}

function variationIndex(input: ProductInput, variant: number): number {
  const conditionOffset =
    input.condition === "usado" ? 1 : input.condition === "como-nuevo" ? 2 : 0;
  const richness = Math.min(2, Math.floor(featureList(input).length / 3));
  const safeVariant = Number.isFinite(variant) ? Math.trunc(variant) : 0;
  return (((safeVariant + conditionOffset + richness) % 3) + 3) % 3;
}

const titleDetails: Record<ProductCategory, [ProductDetailKey[], ProductDetailKey[]]> = {
  celulares: [
    ["storage", "color"],
    ["storage", "carrier"],
  ],
  laptops: [
    ["processor", "ram"],
    ["storage", "screen"],
  ],
  motos: [
    ["year", "engine"],
    ["mileage", "color"],
  ],
  autos: [
    ["year", "transmission"],
    ["mileage", "fuel"],
  ],
  muebles: [
    ["material", "dimensions"],
    ["color", "usageTime"],
  ],
  electrodomesticos: [["capacity", "voltage"], ["usageTime"]],
  otros: [[], []],
};

/** Optional title facts stay whole, including any seller-supplied qualification. */
export function generateTitles(input: ProductInput, variant = 0): string[] {
  const condition = conditionLabels[input.condition];
  const price = formatPrice(input.price, input.currency).replace(/\.00$/u, "");
  const location = formatDisplayName(input.location);
  const details = activeDetails(input);
  const values = (keys: ProductDetailKey[]) =>
    keys.flatMap((key) => {
      const detail = details.find((item) => item.key === key);
      return detail ? [key === "color" ? formatDisplayName(detail.value) : detail.value] : [];
    });
  const compose = (prefix: string, facts: string[], suffix = "", source = input) => {
    const safeSuffix = suffix.length <= 40 ? suffix : "";
    let title = `${prefix}${shortName(source, 90 - prefix.length - safeSuffix.length)}`;
    for (const fact of facts) {
      if (` ${comparisonKey(title)} `.includes(` ${comparisonKey(fact)} `)) continue;
      if (title.length + fact.length + 1 + safeSuffix.length <= 90) title += ` ${fact}`;
    }
    return `${title}${safeSuffix}`;
  };
  const [primary, secondary] = titleDetails[input.category];
  const first = compose("", values(primary), condition ? ` - ${condition}` : " en venta");
  const second = compose("", values(secondary), price ? ` - ${price}` : " en venta", {
    ...input,
    brand: "",
  });
  const third = compose(
    "",
    [
      ...(condition ? [condition.toLocaleLowerCase("es")] : []),
      ...(location ? [`en ${location}`] : []),
    ],
    values(primary.slice(0, 1))[0] ? ` - ${values(primary.slice(0, 1))[0]}` : "",
  );
  const titles = distinct([first, second, third]);
  // Prefixes stay visible even when a very long name has to be shortened.
  for (const prefix of ["Vendo ", "En venta: ", "Venta de "]) {
    if (titles.length === 3) break;
    const candidate = compose(prefix, []);
    if (!titles.some((existing) => comparisonKey(existing) === comparisonKey(candidate)))
      titles.push(candidate);
  }
  const rotation = Number.isFinite(variant) ? ((Math.trunc(variant) % 3) + 3) % 3 : 0;
  return [...titles.slice(rotation), ...titles.slice(0, rotation)].slice(0, 3);
}

export function generateDescription(input: ProductInput, variant = 0): string {
  const template = categoryTemplates[input.category];
  const index = variationIndex(input, variant);
  const facts = featureList(input);
  const price = formatPrice(input.price, input.currency);
  const location = formatDisplayName(input.location);
  const delivery = oneLine(input.delivery);
  const hasUsageDetails = activeDetails(input).some(
    ({ key }) => key === "defects" || key === "usageTime",
  );
  const heading = facts.length >= 5 ? "Características y detalles" : "Datos del producto";
  const details = facts.length
    ? `${heading}:\n${facts.map((feature) => `• ${feature}`).join("\n")}`
    : "";
  const logistics = [
    location ? `Ubicación: ${location}` : "",
    delivery ? `Entrega: ${delivery}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const introduction = template.introductions[index].replace("{name}", () => productName(input));
  const context = conditionContext(input.condition, hasUsageDetails);

  // Rich listings lead with their specifications; sparse listings expose the
  // supplied price early. Empty information is never replaced by sales claims.
  return [
    introduction,
    ...(facts.length >= 5
      ? [details, price ? `Precio: ${price}` : ""]
      : [price ? `Precio: ${price}` : "", details]),
    context,
    logistics,
    template.closings[index],
  ]
    .filter(Boolean)
    .join("\n\n");
}

function isDisclosure(value: string): boolean {
  return /\b(?:no|sin|excepto|aunque|pero|fallas?|fallos?|rayon|rayones|rot[oa]s?|golpes?|grietas?|desgaste|desgastad[oa]s?|marcas?|reparar|reparacion|defectos?|danos?|detalles?)\b/u.test(
    comparisonKey(value),
  );
}

function summaryDetail(detail: ReturnType<typeof activeDetails>[number]): string {
  if (
    ["storage", "ram"].includes(detail.key) &&
    /^\d+(?:[.,]\d+)?\s*(?:[KMGT]B)$/iu.test(detail.value)
  ) {
    return `${detail.value} de ${detail.key === "ram" ? "RAM" : "almacenamiento"}`;
  }
  if (detail.key === "color") return `color ${detail.value}`;
  if (detail.key === "battery" && /^\d+(?:[.,]\d+)?\s*%$/u.test(detail.value)) {
    return `batería al ${detail.value}`;
  }
  return detail.text;
}

/** A free-text paragraph stays atomic, including its exceptions and negatives. */
function summaryFacts(input: ProductInput): {
  disclosures: string[];
  important: string[];
  other: string[];
} {
  const details = activeDetails(input);
  const paragraphs: string[] = [];
  for (const line of input.features.split(/\r?\n/u).map(oneLine).filter(Boolean)) {
    // Keep an exception on the following line attached to its assertion.
    if (
      paragraphs.length &&
      /^(?:excepto|salvo|aunque|pero|sin embargo|con la excepcion)\b/u.test(comparisonKey(line))
    ) {
      paragraphs[paragraphs.length - 1] += ` ${line}`;
    } else {
      paragraphs.push(line);
    }
  }
  const important = distinct([
    ...details.filter(({ key }) => key === "defects").map(({ text }) => text),
    ...paragraphs.filter(isDisclosure),
  ]);
  const disclosures = distinct([
    ...important,
    ...details
      .filter(({ key, value }) => key === "defects" || isDisclosure(value))
      .map(({ text }) => text),
  ]);
  const other = distinct([
    ...details
      .filter(({ key, value }) => key !== "defects" && !isDisclosure(value))
      .map(summaryDetail),
    ...paragraphs.filter((value) => !isDisclosure(value)),
  ]);
  return { disclosures, important, other };
}

interface SummaryOptions {
  limit: number;
  nameLimit: number;
  whatsapp?: boolean;
  variant: number;
}

function sentence(value: string): string {
  return /[.!?…]$/u.test(value) ? value : `${value}.`;
}

function sentenceCount(value: string): number {
  // Decimal points, URLs and abbreviations such as S/ do not split a sentence.
  return value.split(/[.!?…]+(?:\s+|$)/u).filter((part) => part.trim()).length;
}

function summarize(input: ProductInput, options: SummaryOptions): string {
  const { limit, nameLimit, whatsapp = false, variant } = options;
  const separator = whatsapp ? "\n" : " ";
  const name = shortName(input, nameLimit);
  const price = formatPrice(input.price, input.currency);
  const condition = conditionLabels[input.condition];
  const { disclosures, important, other } = summaryFacts(input);
  const location = formatDisplayName(input.location);
  const opening = ["Vendo", "Pongo en venta", "Tengo a la venta"][variationIndex(input, variant)];
  const introduction = whatsapp
    ? `${name}${condition ? ` · ${condition}` : ""}`
    : sentence(`${opening} ${name}${condition ? ` (${condition.toLocaleLowerCase("es")})` : ""}`);
  const notice = "Más información en la descripción completa.";
  const disclosureNotice = "Revisa los detalles o fallas en la descripción completa.";
  const selected: string[] = [];
  const logistics: string[] = [];
  const render = (facts: string[], ending = "") =>
    [
      introduction,
      facts.length ? (whatsapp ? facts.join("\n") : sentence(facts.join("; "))) : "",
      logistics.length ? (whatsapp ? logistics.join("\n") : sentence(logistics.join(" · "))) : "",
      ending,
    ]
      .filter(Boolean)
      .join(separator);
  // Reserve a line for any important omitted qualification. Values remain atomic.
  const fits = (facts: string[]) => render(facts, disclosureNotice).length <= limit;
  let omitted = name !== productName(input);
  for (const item of [
    price ? `${whatsapp ? "💰 " : "Precio: "}${price}` : "",
    location ? `${whatsapp ? "📍 " : "En "}${location}` : "",
  ].filter(Boolean)) {
    logistics.push(item);
    if (!fits([])) {
      logistics.pop();
      omitted = true;
    }
  }
  for (const fact of distinct([...important, ...other, ...disclosures])) {
    // Three highlights are enough for a summary, even when more would fit.
    if (
      selected.length < 3 &&
      fits([...selected, fact]) &&
      (whatsapp || sentenceCount(render([...selected, fact])) <= 4)
    ) {
      selected.push(fact);
    } else {
      omitted = true;
    }
  }
  const ending = () =>
    disclosures.some((fact) => !selected.includes(fact))
      ? disclosureNotice
      : omitted
        ? notice
        : whatsapp
          ? "Escríbeme si te interesa."
          : "";
  // If a seller's paragraph contains several sentences, omit it as a whole.
  // Never truncate away a negation just to meet the short format's budget.
  while (selected.length && !whatsapp && sentenceCount(render(selected, ending())) > 4) {
    selected.pop();
    omitted = true;
  }
  return render(selected, ending());
}

export function generateShortDescription(input: ProductInput, variant = 0): string {
  return summarize(input, { limit: 300, nameLimit: 90, variant });
}

export function generateWhatsApp(input: ProductInput, variant = 0): string {
  return summarize(input, { limit: 450, nameLimit: 100, whatsapp: true, variant });
}

function hashtag(value: string): string {
  const tag = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}_]/gu, "");
  // An entire tag is omitted if it is too long; truncation could change a model.
  return tag && tag.length <= 48 ? `#${tag}` : "";
}

export function generateHashtags(input: ProductInput): string[] {
  return distinct(
    [
      ...categoryTemplates[input.category].hashtags,
      input.name,
      input.brand,
      input.model,
      conditionLabels[input.condition],
      input.location,
      "EnVenta",
    ]
      .map(hashtag)
      .filter(Boolean),
  ).slice(0, 8);
}

export function generateAd(input: ProductInput, variant = 0): GeneratedAd {
  const titles = generateTitles(input, variant);
  const description = generateDescription(input, variant);
  const shortDescription = generateShortDescription(input, variant);
  const hashtags = generateHashtags(input);
  const features = featureList(input);
  const price = formatPrice(input.price, input.currency);
  const location = formatDisplayName(input.location);
  const delivery = oneLine(input.delivery);
  const instagram = [
    `En venta · ${productName(input)}`,
    features.length ? features.map((feature) => `• ${feature}`).join("\n") : "",
    [
      price ? `Precio: ${price}` : "",
      location ? `Ubicación: ${location}` : "",
      delivery ? `Entrega: ${delivery}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "¿Te interesa? Escríbeme por mensaje para conversar sobre el producto.",
    hashtags.join(" "),
  ]
    .filter(Boolean)
    .join("\n\n");
  return {
    title: titles[0],
    titles,
    shortDescription,
    description,
    features,
    whatsapp: generateWhatsApp(input, variant),
    marketplace: `${titles[0]}\n\n${description}`,
    instagram,
    hashtags,
  };
}

/** Keeps the original wording and punctuation, including decimals and URLs. */
export function improveAd(original: string): ImprovedAd {
  const text = original
    .replace(/\r\n?/gu, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/gu, " ").trim())
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();

  if (!text) {
    return {
      text: "",
      suggestions: ["Escribe tu anuncio para revisar su presentación y recibir sugerencias."],
    };
  }

  const lower = comparisonKey(text);
  const suggestions: string[] = [];

  if (!/(?:precio|s\/\.?|us\$|\$|€|\b(?:pen|usd|eur|mxn|cop)\b)/iu.test(text)) {
    suggestions.push("Añade el precio y la moneda para evitar consultas innecesarias.");
  }
  if (!/\b(?:nuevo|nueva|nuevos|nuevas|usado|usada|usados|usadas|estado)\b/u.test(lower)) {
    suggestions.push("Indica el estado real del producto y cualquier detalle de uso.");
  }
  if (!/\b(?:ubicacion|zona|distrito|ciudad|direccion)\b/u.test(lower)) {
    suggestions.push(
      "Comprueba que figure tu ciudad o zona, sin publicar tu dirección particular.",
    );
  }
  if (!/\b(?:entrega|envio|envios|recojo|recogida|retiro)\b/u.test(lower)) {
    suggestions.push("Explica cómo se coordinará la entrega y si tiene un costo adicional.");
  }
  if (
    !/\b(?:marca|modelo|medidas|capacidad|memoria|material|procesador|cilindrada|kilometraje)\b/u.test(
      lower,
    )
  ) {
    suggestions.push(
      "Incluye características concretas: modelo, medidas, capacidad o material, según el producto.",
    );
  }
  if (text.length > 280 && !text.includes("\n")) {
    suggestions.push(
      "Separa manualmente la presentación, las características y la entrega en párrafos breves.",
    );
  }
  if (text !== original) {
    suggestions.unshift(
      "Se ajustaron los espacios y los saltos de línea conservando tu información.",
    );
  }
  if (suggestions.length === 0) {
    suggestions.push(
      "La información básica está presente. Revisa que todos los datos sean exactos y añade fotos propias claras.",
    );
  }

  return { text, suggestions };
}
