import assert from "node:assert/strict";
import test from "node:test";
import { validateProductInput } from "../src/lib/product-validation.ts";
import type { ProductInput } from "../src/types/product.ts";

const input: ProductInput = {
  name: "Mesa de comedor",
  category: "muebles",
  brand: "",
  model: "",
  price: null,
  currency: "PEN",
  condition: "",
  features: "",
  location: "",
  delivery: "",
};

test("main creator accepts sparse truthful input without requiring unknown details", () => {
  assert.deepEqual(validateProductInput(input), {});
  assert.deepEqual(validateProductInput({ ...input, price: 0 }), {});
});
test("empty and punctuation-only names receive a field-level error", () => {
  for (const name of ["", "   ", "!!!"]) assert.ok(validateProductInput({ ...input, name }).name);
});
test("invalid optional prices are rejected even when the price is not required", () => {
  for (const price of [-1, NaN, Infinity, 1000000000, 1.005])
    assert.ok(validateProductInput({ ...input, price }).price);
  assert.equal(validateProductInput({ ...input, price: 1200.99 }).price, undefined);
});
test("standalone description tools retain required price and characteristics", () => {
  const errors = validateProductInput(input, { requirePrice: true, requireFeatures: true });
  assert.ok(errors.price);
  assert.ok(errors.features);
});
test("only active category details are validated and zero mileage is accepted", () => {
  const details = { mileage: "-1", engine: "-2", year: "2020.5" };
  assert.deepEqual(validateProductInput({ ...input, details }), {});
  const errors = validateProductInput({ ...input, category: "motos", details });
  assert.ok(errors["detail-mileage"]);
  assert.ok(errors["detail-engine"]);
  assert.ok(errors["detail-year"]);
  assert.deepEqual(
    validateProductInput({
      ...input,
      category: "motos",
      details: { mileage: "0", engine: "150", year: "2022" },
    }),
    {},
  );
});
test("negative charger answers remain valid and arbitrary choices are rejected", () => {
  assert.deepEqual(
    validateProductInput({ ...input, category: "laptops", details: { charger: "No" } }),
    {},
  );
  assert.ok(
    validateProductInput({ ...input, category: "laptops", details: { charger: "Quizás" } })[
      "detail-charger"
    ],
  );
});
