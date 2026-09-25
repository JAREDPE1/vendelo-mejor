import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDetailValue,
  formatDisplayName,
  formatProductName,
} from "../src/lib/product-formatting.ts";
import type { ProductInput } from "../src/types/product.ts";

const product: ProductInput = {
  name: "",
  brand: "",
  model: "",
  category: "celulares",
  currency: "PEN",
  condition: "",
  price: null,
  features: "",
  location: "",
  delivery: "",
};

test("places the explicit brand first and deduplicates a repeated product model", () => {
  assert.equal(
    formatProductName({ ...product, name: "iphone 13", brand: "apple", model: "iphone 13" }),
    "Apple iPhone 13",
  );
  assert.equal(
    formatProductName({
      ...product,
      name: "apple iphone 13",
      brand: "Apple",
      model: "Apple iPhone 13",
    }),
    "Apple iPhone 13",
  );
  assert.equal(
    formatProductName({ ...product, name: "iphone 13 apple", brand: "Apple", model: "iPhone 13" }),
    "Apple iPhone 13",
  );
});

test("retains the more specific model and original storage information", () => {
  assert.equal(
    formatProductName({
      ...product,
      name: "iphone 13",
      brand: "apple",
      model: "iphone 13 pro max",
    }),
    "Apple iPhone 13 Pro Max",
  );
  assert.equal(
    formatProductName({
      ...product,
      name: "iphone 13 128 GB",
      brand: "apple",
      model: "iphone 13 pro",
    }),
    "Apple iPhone 13 Pro 128 GB",
  );
  assert.equal(
    formatProductName({
      ...product,
      name: "laptop lenovo ThinkPad",
      brand: "Lenovo",
      model: "ThinkPad T14 Gen 2",
    }),
    "Lenovo Laptop ThinkPad T14 Gen 2",
  );
});

test("preserves negatives and exceptions while merging a model extension", () => {
  assert.equal(
    formatProductName({
      ...product,
      name: "iphone 13 no enciende",
      brand: "apple",
      model: "iphone 13 pro",
    }),
    "Apple iPhone 13 Pro no Enciende",
  );
  const name = formatProductName({
    ...product,
    name: "iphone 13 sin cargador",
    brand: "apple",
    model: "iphone 13",
  });
  assert.match(name, /sin Cargador/u);
  const qualifiedBrand = formatProductName({
    ...product,
    name: "funda compatible con Apple",
    brand: "Marca X",
    model: "",
  });
  assert.equal(qualifiedBrand, "Marca X Funda Compatible con Apple");
  assert.equal(
    formatProductName({ ...product, name: "no es Apple", brand: "Apple" }),
    "Apple no Es Apple",
  );
});

test("does not invent a brand, product name or category fallback", () => {
  assert.equal(
    formatProductName({ ...product, name: "iphone 13", model: "iphone 13" }),
    "iPhone 13",
  );
  assert.equal(
    formatProductName({ ...product, brand: "HP", model: "14-dq2005la" }),
    "HP 14-dq2005la",
  );
  assert.equal(formatProductName(product), "");
  assert.equal(formatProductName({ ...product, name: "  ", brand: "\n", model: "\t" }), "");
});

test("uses complete normalized tokens rather than partial brand matches", () => {
  assert.equal(
    formatProductName({ ...product, name: "HP14", brand: "HP", model: "HP14" }),
    "HP HP14",
  );
  assert.equal(
    formatProductName({ ...product, name: "mesa de centro", brand: "Marca", model: "mesa centro" }),
    "Marca Mesa de Centro",
  );
  assert.equal(
    formatProductName({ ...product, name: "cámara ágil", brand: "Cámara Ágil", model: "X100" }),
    "Cámara Ágil X100",
  );
});

test("capitalizes ordinary lowercase words and preserves connecting words", () => {
  assert.equal(formatDisplayName("lima"), "Lima");
  assert.equal(formatDisplayName("mesa de centro en lima"), "Mesa de Centro en Lima");
  assert.equal(formatDisplayName("  san  juan\nde miraflores "), "San Juan de Miraflores");
  assert.equal(formatDisplayName("iphone ipad macbook"), "iPhone iPad MacBook");
});

test("preserves explicit acronyms, model codes, mixed case and punctuation", () => {
  assert.equal(
    formatDisplayName("HP ASUS SM-G991B ThinkPad i7-1165G7"),
    "HP ASUS SM-G991B ThinkPad i7-1165G7",
  );
  assert.equal(formatDisplayName("iPhone 13 (azul)"), "iPhone 13 (Azul)");
  assert.equal(formatDisplayName("128gb 87% 1TB"), "128gb 87% 1TB");
  assert.equal(formatDisplayName("  \n "), "");
});

test("adds category-specific units to numeric values, including zero and decimals", () => {
  assert.equal(formatDetailValue("celulares", "storage", "128"), "128 GB");
  assert.equal(formatDetailValue("celulares", "ram", "8"), "8 GB");
  assert.equal(formatDetailValue("celulares", "battery", "87"), "87 %");
  assert.equal(formatDetailValue("celulares", "battery", "0"), "0 %");
  assert.equal(formatDetailValue("celulares", "battery", "87,5"), "87,5 %");
  assert.equal(formatDetailValue("motos", "mileage", "25000.5"), "25000.5 km");
  assert.equal(formatDetailValue("autos", "mileage", "120000"), "120000 km");
  assert.equal(formatDetailValue("motos", "engine", "150"), "150 cc");
});

test("preserves values that already include units and never adds a duplicate", () => {
  for (const value of ["128 GB", "128gb", "1 TB", "128 GB; 8 GB de RAM"]) {
    assert.equal(formatDetailValue("celulares", "storage", value), value);
  }
  for (const value of ["87%", "87 %", "87 %, según ajustes"]) {
    assert.equal(formatDetailValue("celulares", "battery", value), value);
  }
  assert.equal(formatDetailValue("autos", "mileage", "25 000 km"), "25 000 km");
  assert.equal(formatDetailValue("motos", "engine", "150 cc"), "150 cc");
});

test("does not infer units from another category or alter qualifications", () => {
  assert.equal(formatDetailValue("laptops", "storage", "512"), "512");
  assert.equal(formatDetailValue("autos", "engine", "150"), "150");
  assert.equal(formatDetailValue("motos", "year", "2022"), "2022");
  assert.equal(formatDetailValue("electrodomesticos", "capacity", "8"), "8");
  for (const value of [
    "no comprobado",
    "128 aproximadamente",
    "-1",
    "1e3",
    "87; batería reemplazada",
  ]) {
    assert.equal(formatDetailValue("celulares", "battery", value), value);
  }
  assert.equal(formatDetailValue("celulares", "storage", " \n "), "");
});
