import type { ProductCategory, ProductDetailKey, ProductInput } from "../types/product.ts";

const productSpellings: Record<string, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  macbook: "MacBook",
};

const connectors = new Set([
  "a",
  "al",
  "con",
  "de",
  "del",
  "e",
  "el",
  "en",
  "la",
  "las",
  "los",
  "o",
  "para",
  "por",
  "que",
  "sin",
  "u",
  "un",
  "una",
  "y",
  "no",
  "ni",
  "como",
  "excepto",
  "salvo",
  "aunque",
  "pero",
]);

const qualifierStarts = new Set([
  "no",
  "sin",
  "excepto",
  "salvo",
  "aunque",
  "pero",
  "para",
  "compatible",
  "compatibles",
  "similar",
  "replica",
  "imitacion",
]);

interface NameToken {
  text: string;
  key: string;
}

function singleLine(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function tokenKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

/** Normalize ordinary lowercase names; keep codes, acronyms and mixed case. */
export function formatDisplayName(value: string): string {
  return singleLine(value).replace(/\S+/gu, (token) => {
    const parts = token.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
    if (!parts) return token;
    const [, before, word, after] = parts;
    const key = word.toLocaleLowerCase("es");
    const known = productSpellings[key];
    if (known) return `${before}${known}${after}`;
    // A model identifier may start in lowercase; uppercasing it could change it.
    if (!/^\p{Ll}+$/u.test(word) || connectors.has(key)) return token;
    return `${before}${word.charAt(0).toLocaleUpperCase("es")}${word.slice(1)}${after}`;
  });
}

function tokens(value: string): NameToken[] {
  const clean = formatDisplayName(value);
  return clean ? clean.split(" ").map((text) => ({ text, key: tokenKey(text) })) : [];
}

function startsAt(haystack: NameToken[], needle: NameToken[], start: number): boolean {
  return (
    needle.length > 0 &&
    needle.every((token, offset) => token.key !== "" && token.key === haystack[start + offset]?.key)
  );
}

function contains(haystack: NameToken[], needle: NameToken[]): boolean {
  return needle.length > 0 && haystack.some((_, start) => startsAt(haystack, needle, start));
}

/** Move a stated brand out of the identity, without deleting qualified mentions. */
function withoutBrand(value: NameToken[], brand: NameToken[]): NameToken[] {
  if (!brand.length) return value;
  const output: NameToken[] = [];
  let qualified = false;
  for (let index = 0; index < value.length; index += 1) {
    const token = value[index];
    if (qualifierStarts.has(token.key)) qualified = true;
    if (!qualified && startsAt(value, brand, index)) {
      index += brand.length - 1;
    } else {
      output.push(token);
    }
  }
  return output;
}

/**
 * A common subsequence joins overlapping identities without discarding any
 * unmatched model number or descriptor. Model extensions precede extra details.
 */
function mergeIdentity(name: NameToken[], model: NameToken[]): NameToken[] {
  if (!model.length || contains(name, model)) return name;
  if (!name.length || contains(model, name)) return model;
  // Inputs from the form are short. Keep unusual unbounded utility input linear.
  if (name.length * model.length > 10000) return [...name, ...model];
  const matches = Array.from({ length: name.length + 1 }, () =>
    Array<number>(model.length + 1).fill(0),
  );
  for (let left = name.length - 1; left >= 0; left -= 1) {
    for (let right = model.length - 1; right >= 0; right -= 1) {
      matches[left][right] =
        name[left].key && name[left].key === model[right].key
          ? 1 + matches[left + 1][right + 1]
          : Math.max(matches[left + 1][right], matches[left][right + 1]);
    }
  }
  if (!matches[0][0]) return [...name, ...model];
  const output: NameToken[] = [];
  let left = 0;
  let right = 0;
  while (left < name.length && right < model.length) {
    if (name[left].key && name[left].key === model[right].key) {
      output.push(name[left]);
      left += 1;
      right += 1;
    } else if (matches[left + 1][right] > matches[left][right + 1]) {
      output.push(name[left]);
      left += 1;
    } else {
      output.push(model[right]);
      right += 1;
    }
  }
  return [...output, ...name.slice(left), ...model.slice(right)];
}

/** Brand first, followed by the supplied identity; no category or brand guesses. */
export function formatProductName(input: ProductInput): string {
  const brand = tokens(input.brand);
  const name = withoutBrand(tokens(input.name), brand);
  const model = withoutBrand(tokens(input.model), brand);
  let identity: NameToken[];
  if (contains(name, model)) {
    identity = name;
  } else {
    const qualifierIndex = name.findIndex((token) => qualifierStarts.has(token.key));
    const split = qualifierIndex < 0 ? name.length : qualifierIndex;
    identity = [...mergeIdentity(name.slice(0, split), model), ...name.slice(split)];
  }
  return [...brand, ...identity].map(({ text }) => text).join(" ");
}

/** Add a unit only where a category field defines one and the value is numeric. */
export function formatDetailValue(
  category: ProductCategory,
  key: ProductDetailKey,
  value: string,
): string {
  const clean = value.trim();
  if (!/^\d+(?:[.,]\d+)?$/u.test(clean)) return clean;
  let unit = "";
  if (category === "celulares") {
    if (key === "storage" || key === "ram") unit = "GB";
    if (key === "battery") unit = "%";
  }
  if ((category === "motos" || category === "autos") && key === "mileage") unit = "km";
  if (category === "motos" && key === "engine") unit = "cc";
  return unit ? `${clean} ${unit}` : clean;
}
