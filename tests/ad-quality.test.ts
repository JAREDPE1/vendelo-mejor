import assert from "node:assert/strict";
import test from "node:test";
import { categoryFields } from "../src/data/category-fields.ts";
import { assessAdQuality } from "../src/lib/ad-quality.ts";
import type { ProductCategory, ProductDetailKey, ProductInput } from "../src/types/product.ts";

const empty: ProductInput = {
  name: "",
  category: "otros",
  brand: "",
  model: "",
  price: null,
  currency: "PEN",
  condition: "",
  features: "",
  location: "",
  delivery: "",
};

const named: ProductInput = { ...empty, name: "Samsung Galaxy A52", category: "celulares" };
const fiveFacts =
  "Pantalla de 6 pulgadas; Memoria de 256 GB; Color azul; Cámara de 50 MP; Incluye cable USB";
const disclosed = { defects: "Un rayón visible en el lateral" };
const detailExamples: Record<ProductDetailKey, string> = {
  storage: "256 GB",
  ram: "8 GB",
  color: "Azul oscuro",
  battery: "87 % de salud",
  carrier: "Liberado, probado con dos operadores",
  accessories: "Cable USB",
  defects: "Rayón pequeño en un lateral",
  processor: "Intel Core i5-1135G7",
  graphics: "Intel Iris Xe",
  screen: "15,6 pulgadas",
  charger: "Sí",
  year: "2022",
  mileage: "25000",
  engine: "150",
  documents: "Tarjeta de propiedad disponible",
  fuel: "Gasolina",
  transmission: "Manual",
  material: "Madera de pino",
  dimensions: "120 × 60 × 75 cm",
  usageTime: "2 años de uso",
  capacity: "8 kg",
  voltage: "220 V",
};

test("an untouched form has zero points and actionable missing-field recommendations", () => {
  const quality = assessAdQuality(empty);
  assert.equal(quality.score, 0);
  assert.equal(quality.label, "Faltan datos");
  assert.equal(quality.completed, 0);
  assert.equal(quality.total, 10);
  for (const field of [
    "name",
    "brand",
    "model",
    "price",
    "condition",
    "features",
    "location",
    "delivery",
  ]) {
    assert.ok(
      quality.recommendations.some((recommendation) => recommendation.field === field),
      field,
    );
  }
  assert.ok(!quality.recommendations.some(({ field }) => field === "category"));
  assert.ok(quality.recommendations.some(({ message }) => message.includes("detalles de uso")));
});

test("labels change at every documented score boundary", () => {
  const cases: [Partial<ProductInput>, number, string][] = [
    [{ brand: "Samsung", location: "Lima" }, 29, "Faltan datos"],
    [{ features: "Pantalla de 6 pulgadas", location: "Lima" }, 30, "Anuncio básico"],
    [{ brand: "Samsung", price: 600, condition: "usado", location: "Lima" }, 49, "Anuncio básico"],
    [
      { price: 600, location: "Lima", delivery: "Recojo coordinado", details: disclosed },
      50,
      "Puede mejorar",
    ],
    [
      {
        brand: "Samsung",
        price: 600,
        condition: "usado",
        features: "Pantalla de 6 pulgadas; Memoria de 256 GB",
        location: "Lima",
        details: disclosed,
      },
      69,
      "Puede mejorar",
    ],
    [
      {
        price: 600,
        condition: "usado",
        features: "Pantalla de 6 pulgadas; Memoria de 256 GB; Color azul",
        location: "Lima",
        delivery: "Recojo coordinado",
      },
      70,
      "Buen anuncio",
    ],
    [
      {
        brand: "Samsung",
        model: "A52",
        price: 600,
        condition: "usado",
        features: fiveFacts,
        location: "Lima",
      },
      84,
      "Buen anuncio",
    ],
    [
      {
        brand: "Samsung",
        price: 600,
        features: fiveFacts,
        location: "Lima",
        delivery: "Recojo coordinado",
        details: disclosed,
      },
      85,
      "Anuncio muy completo",
    ],
  ];

  for (const [input, score, label] of cases) {
    const quality = assessAdQuality({ ...named, ...input });
    assert.equal(quality.score, score);
    assert.equal(quality.label, label);
  }
});

test("rich information can reach 100 in every category without forcing unused fields", () => {
  for (const category of Object.keys(categoryFields) as ProductCategory[]) {
    const details = Object.fromEntries(
      categoryFields[category].map(({ key }) => [key, detailExamples[key]]),
    );
    const input: ProductInput = {
      ...empty,
      category,
      name: "Producto modelo Alba",
      brand: "Acme",
      model: "Alba 2",
      price: 450,
      condition: "usado",
      location: "Lima",
      delivery: "Recojo coordinado",
      features:
        "Tiene un rayón en un lateral; Peso de 4 kg; Incluye manual; Color azul oscuro; Medidas de 30 × 40 cm",
      details,
    };
    const quality = assessAdQuality(input);
    assert.equal(quality.score, 100, category);
    assert.equal(quality.completed, quality.total);
    assert.deepEqual(quality.recommendations, []);
  }
});

test("a generic name earns less than a specific product identity", () => {
  const generic = assessAdQuality({ ...named, name: "Celular" });
  const specific = assessAdQuality(named);
  assert.ok(generic.score < specific.score);
  assert.ok(!generic.recommendations.some(({ field }) => field === "name"));
  assert.ok(!specific.recommendations.some(({ field }) => field === "name"));
});

test("unknown condition and invalid prices do not receive completeness credit", () => {
  const baseline = assessAdQuality(named);
  for (const price of [-1, Number.NaN, Number.POSITIVE_INFINITY, 1000000000, 450.001]) {
    const quality = assessAdQuality({ ...named, price });
    assert.equal(quality.score, baseline.score);
    assert.ok(!quality.recommendations.some(({ field }) => field === "price"));
  }
  assert.equal(assessAdQuality({ ...named, price: 0 }).score, baseline.score + 10);
  assert.equal(assessAdQuality({ ...named, price: 999999999 }).score, baseline.score + 10);
  assert.equal(assessAdQuality({ ...named, price: 450.01 }).score, baseline.score + 10);
  assert.equal(assessAdQuality({ ...named, condition: "nuevo" }).score, baseline.score + 10);
  assert.ok(baseline.recommendations.some(({ field }) => field === "condition"));
});

test("whitespace, punctuation, placeholders and repeated filler cannot inflate quality", () => {
  for (const value of [
    "   ",
    "!!!...---",
    "no sé",
    "n/a",
    "-",
    "aaaaaaa",
    "abababababab",
    "hola hola hola",
    "sin información",
    "qwerty",
  ]) {
    const quality = assessAdQuality({
      ...empty,
      name: value,
      brand: value,
      model: value,
      location: value,
      delivery: value,
      features: value,
      details: { defects: value, storage: value },
    });
    assert.equal(quality.score, 0, value);
  }
  assert.equal(assessAdQuality({ ...empty, features: "aaa\nbbb\nccc\n;;;" }).score, 0);
});

test("duplicate facts and longer repetitions do not earn extra points", () => {
  const single = assessAdQuality({ ...named, features: "Pantalla de 6 pulgadas" });
  const repeated = assessAdQuality({
    ...named,
    features: "Pantalla de 6 pulgadas; PANTALLA DE 6 PULGADAS\nPantalla de 6 pulgadas",
  });
  assert.equal(repeated.score, single.score);
  assert.ok(assessAdQuality({ ...named, features: fiveFacts }).score > single.score);
});

test("only the active category's optional fields contribute or become recommendations", () => {
  const input = {
    ...named,
    details: { processor: "Intel Core i5", engine: "150", material: "Madera" },
  };
  assert.equal(assessAdQuality(input).score, assessAdQuality(named).score);
  const recommendations = assessAdQuality(input).recommendations;
  assert.ok(recommendations.some(({ field }) => field === "details.storage"));
  assert.ok(
    !recommendations.some(({ field }) =>
      ["details.processor", "details.engine", "details.material"].includes(field),
    ),
  );
  assert.ok(
    assessAdQuality({ ...input, category: "laptops" }).score >
      assessAdQuality({ ...named, category: "laptops" }).score,
  );
});

test("numeric optional fields honor minimums, integer constraints and finite values", () => {
  const vehicle = { ...named, category: "motos" as const };
  const baseline = assessAdQuality(vehicle).score;
  for (const details of [
    { year: "1884" },
    { year: "2022.5" },
    { mileage: "-1" },
    { engine: "0" },
    { year: "Infinity" },
    { mileage: "NaN" },
    { engine: "1e309" },
    { mileage: "" },
  ]) {
    assert.equal(assessAdQuality({ ...vehicle, details }).score, baseline);
  }
  for (const details of [{ year: "2022" }, { mileage: "0" }, { engine: "150" }]) {
    assert.ok(assessAdQuality({ ...vehicle, details }).score > baseline);
  }
});

test("disclosed defects in free text are recognized without treating brand or battery capacity as disclosure", () => {
  const withoutDisclosure = assessAdQuality({
    ...named,
    features: "Marca Samsung; Batería de 5000 mAh",
  });
  const withDisclosure = assessAdQuality({
    ...named,
    features: "Marca Samsung; Un rayón en el lateral",
  });
  assert.ok(withoutDisclosure.recommendations.some(({ field }) => field === "details.defects"));
  assert.ok(!withDisclosure.recommendations.some(({ field }) => field === "details.defects"));
  assert.equal(withDisclosure.score, withoutDisclosure.score + 8);
});

test("furniture can identify construction and measurements instead of inventing a brand or model", () => {
  const input: ProductInput = {
    ...empty,
    name: "Mesa de comedor de pino",
    category: "muebles",
    price: 400,
    condition: "usado",
    location: "Lima",
    delivery: "Recojo por el comprador",
    features: "Se desmontan las patas",
    details: {
      material: "Madera de pino",
      dimensions: "120 × 60 × 75 cm",
      color: "Natural",
      usageTime: "2 años de uso",
    },
  };
  const quality = assessAdQuality(input);
  assert.equal(quality.score, 100);
  assert.ok(!quality.recommendations.some(({ field }) => field === "brand" || field === "model"));
});

test("negative but explicit accessory and charger answers remain useful information", () => {
  const laptop: ProductInput = { ...named, category: "laptops" };
  assert.ok(
    assessAdQuality({ ...laptop, details: { charger: "No" } }).score >
      assessAdQuality(laptop).score,
  );
  assert.equal(
    assessAdQuality({ ...laptop, details: { charger: "Tal vez" } }).score,
    assessAdQuality(laptop).score,
  );
});

test("numeric-detail score follows the form's two-decimal validation", () => {
  const vehicle: ProductInput = { ...named, category: "motos" };
  const baseline = assessAdQuality(vehicle).score;
  for (const mileage of ["12.345", "0.001"]) {
    assert.equal(assessAdQuality({ ...vehicle, details: { mileage } }).score, baseline);
  }
  for (const mileage of ["12.34", "0.01", "0", "12000"]) {
    assert.ok(assessAdQuality({ ...vehicle, details: { mileage } }).score > baseline);
  }
});

test("explicit battery percentages are useful without interpreting what was measured", () => {
  const baseline = assessAdQuality(named).score;
  for (const battery of ["87%", "87 %", "0%", "100 %", "87,5 %", "87"]) {
    assert.equal(assessAdQuality({ ...named, details: { battery } }).score, baseline + 6);
  }
  for (const battery of ["101%", "-1%", "%"]) {
    assert.equal(assessAdQuality({ ...named, details: { battery } }).score, baseline);
  }
});

test("numeric product models are valid identities while filler remains incomplete", () => {
  const complete: ProductInput = {
    ...named,
    name: "iPhone 13",
    brand: "Apple",
    price: 1200,
    condition: "usado",
    features: fiveFacts,
    location: "Lima",
    delivery: "Recojo coordinado",
    details: disclosed,
  };
  assert.equal(assessAdQuality(complete).score, 95);
  for (const model of ["13", "3310", "911", "3", " 13 "]) {
    const quality = assessAdQuality({ ...complete, model });
    assert.equal(quality.score, 100, model);
    assert.ok(!quality.recommendations.some(({ field }) => field === "model"), model);
  }
  for (const model of ["", "n/a", "no sé", "-", "aaaaaaa", "hola hola hola", "0000", "11111111"]) {
    const quality = assessAdQuality({ ...complete, model });
    assert.equal(quality.score, 95, model);
    assert.equal(
      quality.recommendations.some(({ field }) => field === "model"),
      model.trim() === "",
      model,
    );
  }
});

test("numeric storage, RAM and battery values count without being reported as missing", () => {
  const baseline = assessAdQuality(named).score;
  const quality = assessAdQuality({
    ...named,
    details: { storage: "128", ram: "4", battery: "87" },
  });
  assert.equal(quality.score, baseline + 18);
  for (const field of ["details.storage", "details.ram", "details.battery"]) {
    assert.ok(
      !quality.recommendations.some((recommendation) => recommendation.field === field),
      field,
    );
  }
});

test("fully filled fields never receive missing-data recommendations regardless of quality", () => {
  for (const category of Object.keys(categoryFields) as ProductCategory[]) {
    const input: ProductInput = {
      ...empty,
      category,
      name: "Producto",
      brand: "n/a",
      model: "0",
      price: -1,
      condition: "usado",
      features: "-",
      location: "13",
      delivery: "no sé",
      details: Object.fromEntries(categoryFields[category].map(({ key }) => [key, "n/a"])),
    };
    const quality = assessAdQuality(input);
    assert.ok(quality.score < 100, category);
    assert.deepEqual(quality.recommendations, [], category);
  }
});

test("whitespace remains empty for recommendations in general and category-specific fields", () => {
  const quality = assessAdQuality({
    ...named,
    name: " \t\n",
    brand: "  ",
    model: "\n",
    features: "\t",
    location: " \n ",
    delivery: "  ",
    details: { storage: "  ", ram: "\t", defects: "\n" },
  });
  for (const field of [
    "name",
    "brand",
    "model",
    "features",
    "location",
    "delivery",
    "details.storage",
    "details.ram",
    "details.defects",
  ]) {
    assert.ok(
      quality.recommendations.some((recommendation) => recommendation.field === field),
      field,
    );
  }
});

test("filled free text is preserved while recommendations target genuinely missing optional fields", () => {
  const input: ProductInput = {
    ...named,
    features: "Información breve",
    details: { storage: "n/a", ram: "4", battery: "87", color: "", defects: "No lo he revisado" },
  };
  const quality = assessAdQuality(input);
  assert.ok(!quality.recommendations.some(({ field }) => field === "features"));
  assert.ok(!quality.recommendations.some(({ field }) => field === "details.storage"));
  assert.ok(!quality.recommendations.some(({ field }) => field === "details.defects"));
  assert.ok(quality.recommendations.some(({ field }) => field === "details.color"));
  assert.ok(quality.recommendations.some(({ field }) => field === "details.carrier"));
  for (const { field } of quality.recommendations) {
    const value = field.startsWith("details.")
      ? input.details?.[field.slice("details.".length) as ProductDetailKey]
      : input[field as Exclude<keyof ProductInput, "details">];
    assert.ok(
      value === null || value === undefined || (typeof value === "string" && value.trim() === ""),
      field,
    );
  }
});
