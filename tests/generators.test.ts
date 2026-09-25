import assert from "node:assert/strict";
import test from "node:test";
import {
  formatPrice,
  generateAd,
  generateHashtags,
  generateShortDescription,
  generateTitles,
  generateWhatsApp,
  improveAd,
} from "../src/lib/generators.ts";
import { calculateSalePrice } from "../src/lib/pricing.ts";
import type { ProductCategory, ProductDetails, ProductInput } from "../src/types/product.ts";
import { categoryFields } from "../src/data/category-fields.ts";

const product: ProductInput = {
  name: "iPhone 13",
  category: "celulares",
  brand: "Apple",
  model: "iPhone 13",
  price: 1250.5,
  currency: "PEN",
  condition: "usado",
  features: "128 GB; Pantalla de 6.1 pulgadas\nUna marca en la carcasa",
  location: "Lima",
  delivery: "Recojo previa coordinación",
};

test("generates complete results using the seller's actual information", () => {
  const ad = generateAd(product);
  assert.match(ad.title, /Apple iPhone 13 - Usado/u);
  assert.equal(ad.title.match(/iPhone 13/gu)?.length, 1);
  assert.ok(ad.features.includes("Pantalla de 6.1 pulgadas"));
  assert.match(ad.description, /Una marca en la carcasa/u);
  assert.match(ad.description, /Lima/u);
  assert.match(ad.description, /Recojo previa coordinación/u);
  assert.ok(ad.description.includes(formatPrice(1250.5, "PEN")));
  assert.ok(ad.marketplace.includes(ad.description));
  assert.doesNotMatch(
    ad.description,
    /garantía|sin detalles|original|cargador|funciona perfectamente/iu,
  );
});

test("does not invent missing brand, model, price, location, delivery or accessories", () => {
  const ad = generateAd({
    ...product,
    brand: "",
    model: "",
    price: null,
    features: "",
    location: "",
    delivery: "",
  });
  assert.deepEqual(ad.features, ["Estado: Usado"]);
  assert.doesNotMatch(ad.description, /Precio:|Marca:|Modelo:|Ubicación:|Entrega:/u);
  assert.equal(formatPrice(Number.NaN, "PEN"), "");
  assert.equal(formatPrice(-1, "PEN"), "");
  assert.ok(formatPrice(0, "PEN").includes("0.00"));
});

test("varies category advice and retains the selected condition without extra claims", () => {
  const furniture = generateAd({ ...product, category: "muebles", condition: "como-nuevo" });
  const vehicle = generateAd({ ...product, category: "autos", condition: "nuevo" });
  assert.match(furniture.description, /medidas.*traslado/u);
  assert.match(furniture.description, /Estado: Como nuevo/u);
  assert.match(vehicle.description, /documentación/u);
  assert.match(vehicle.description, /Estado: Nuevo/u);
  assert.doesNotMatch(vehicle.description, /papeles al día|garantizado|sin uso/iu);
});

test("deduplicates repeated features without splitting decimals or comma values", () => {
  const ad = generateAd({
    ...product,
    features: "• Medidas: 1,20 x 0,80 m\n- Peso: 2.5 kg; Peso: 2.5 kg",
  });
  assert.ok(ad.features.includes("Medidas: 1,20 x 0,80 m"));
  assert.equal(ad.features.filter((value) => value === "Peso: 2.5 kg").length, 1);
});

test("normalizes accents and punctuation in hashtags and deduplicates case-insensitively", () => {
  const hashtags = generateHashtags({
    ...product,
    name: "¡Cámara Ágil!",
    brand: "Cámara Ágil",
    model: "###",
    location: "Jesús María",
  });
  assert.ok(hashtags.includes("#CamaraAgil"));
  assert.equal(hashtags.filter((tag) => tag.toLowerCase() === "#camaraagil").length, 1);
  assert.ok(hashtags.includes("#JesusMaria"));
  assert.ok(hashtags.every((tag) => /^#[\p{L}\p{N}_]+$/u.test(tag)));
});

test("title suggestions are unique and bounded for long seller input", () => {
  const titles = generateTitles({
    ...product,
    name: "Producto con una descripción muy extensa ".repeat(20),
  });
  assert.equal(titles.length, 3);
  assert.ok(titles.every((title) => title.length <= 90));
  assert.equal(titles.length, new Set(titles).size);
});

test("keeps WhatsApp messages short while prioritizing disclosed defects", () => {
  const message = generateWhatsApp({
    ...product,
    features: `${"Especificaciones extensas del equipo. ".repeat(90)}\nPantalla con una grieta en la esquina.\n128 GB`,
  });
  assert.ok(message.length <= 650);
  assert.ok(message.includes("Pantalla con una grieta en la esquina."));
  assert.ok(message.includes("128 GB"));
  assert.ok(message.includes("descripción completa"));
  assert.ok(message.includes(formatPrice(product.price, product.currency)));
  assert.doesNotMatch(message, /Especificaciones extensas/u);
});

test("omits overlong facts and URL tokens as whole units instead of cutting them", () => {
  const url = `https://ejemplo.com/${"a".repeat(800)}`;
  const message = generateWhatsApp({
    ...product,
    name: "Nombrecompletoparaconservar ".repeat(12),
    features: `Ficha: ${url}\nPeso: 2.5 kg`,
  });
  assert.ok(message.length <= 650);
  assert.ok(message.includes("Nombrecompletoparaconservar"));
  assert.ok(message.includes("Peso: 2.5 kg"));
  assert.doesNotMatch(message, /https:|Ficha:/u);
  assert.ok(message.includes("descripción completa"));
});

test("improves spacing without damaging decimal prices, URLs or punctuation", () => {
  const original =
    "  Vendo   laptop. Precio: S/ 1,250.50.\r\n\r\n\r\nVer: https://ejemplo.com/producto?v=2.5&ref=venta. Estado: usado.  ";
  const improved = improveAd(original);
  assert.equal(
    improved.text,
    "Vendo laptop. Precio: S/ 1,250.50.\n\nVer: https://ejemplo.com/producto?v=2.5&ref=venta. Estado: usado.",
  );
  assert.ok(improved.suggestions.some((suggestion) => suggestion.includes("entrega")));
  assert.equal(improveAd(" \n ").text, "");
});

test("leaves an unspecified condition absent in every generated format", () => {
  const ad = generateAd({
    ...product,
    name: "Artículo",
    brand: "",
    model: "",
    condition: "",
    price: null,
    features: "",
    location: "",
    delivery: "",
    details: {},
  });
  assert.deepEqual(ad.features, []);
  assert.equal(ad.titles.length, 3);
  assert.doesNotMatch(
    JSON.stringify(ad),
    /Estado:|Usado|Como nuevo|Nuevo|sin fallas|perfecto estado|original|garantizado/iu,
  );
  assert.doesNotMatch(JSON.stringify(ad), /undefined|null/u);
});

const detailedProducts: { category: ProductCategory; name: string; details: ProductDetails }[] = [
  {
    category: "celulares",
    name: "Celular X",
    details: {
      storage: "128 GB",
      ram: "8 GB",
      color: "Azul",
      battery: "87 %, según ajustes",
      carrier: "Operador A; no comprobé otros operadores",
      accessories: "Cable; sin cargador",
      defects: "No funciona la cámara frontal",
    },
  },
  {
    category: "laptops",
    name: "Laptop Y",
    details: {
      processor: "Intel Core i5-1135G7",
      ram: "16 GB",
      storage: "SSD 512 GB",
      graphics: "Intel Iris Xe",
      screen: "15,6 pulgadas",
      charger: "No",
      defects: "Una tecla no responde",
    },
  },
  {
    category: "motos",
    name: "Moto Z",
    details: {
      year: "2021",
      mileage: "25000.5",
      engine: "150",
      documents: "Tarjeta de propiedad; revisión pendiente",
      color: "Rojo",
      defects: "Rayón en el tanque",
    },
  },
  {
    category: "autos",
    name: "Auto A",
    details: {
      year: "2018",
      mileage: "87500.25",
      fuel: "Gasolina",
      transmission: "Manual",
      documents: "Tarjeta de propiedad",
      color: "Gris",
      defects: "El aire acondicionado no enfría",
    },
  },
  {
    category: "muebles",
    name: "Mesa B",
    details: {
      material: "Madera de pino",
      dimensions: "1,20 × 0,80 × 0,75 m",
      color: "Natural",
      usageTime: "2 años",
      defects: "Marca en una esquina",
    },
  },
  {
    category: "electrodomesticos",
    name: "Lavadora C",
    details: {
      capacity: "8 kg",
      voltage: "220 V",
      usageTime: "3 años",
      accessories: "Manguera de desagüe",
      defects: "Hace ruido en el centrifugado",
    },
  },
];

for (const fixture of detailedProducts) {
  test(`includes every supplied ${fixture.category} field without changing values or qualifiers`, () => {
    const ad = generateAd({ ...product, ...fixture, brand: "", model: "", features: "" });
    for (const field of categoryFields[fixture.category]) {
      const value = fixture.details[field.key];
      assert.ok(value);
      const label = field.label.replace(/ \((?:km|cc)\)$/u, "");
      const unit = field.key === "mileage" ? " km" : field.key === "engine" ? " cc" : "";
      const fact = `${label}: ${value}${unit}`;
      assert.ok(ad.features.includes(fact), fact);
      for (const text of [ad.description, ad.marketplace, ad.instagram]) {
        assert.ok(text.includes(fact), fact);
      }
    }
    assert.ok(ad.shortDescription.includes(fixture.details.defects!));
    assert.ok(ad.whatsapp.includes(fixture.details.defects!));
    assert.ok(ad.shortDescription.length <= 300);
    assert.ok(ad.whatsapp.length <= 650);
    assert.equal(ad.titles.length, 3);
  });
}

test("ignores hidden details from a previously selected category in all formats", () => {
  const ad = generateAd({
    ...product,
    details: {
      processor: "stale-processor",
      mileage: "stale-mileage",
      dimensions: "stale-dimensions",
      storage: "256 GB",
    },
  });
  assert.doesNotMatch(JSON.stringify(ad), /stale-/u);
  assert.ok(ad.features.includes("Almacenamiento: 256 GB"));
  const other = generateAd({
    ...product,
    category: "otros",
    details: { storage: "stale-storage" },
  });
  assert.doesNotMatch(JSON.stringify(other), /stale-/u);
});

test("preserves exceptions and negatives as whole facts in short formats", () => {
  const exception = "Batería al 100 %, pero no mantiene la carga; requiere reemplazo.";
  const input = {
    ...product,
    features: exception,
    details: { defects: "No carga sin conectar el cable de repuesto." },
  };
  for (const text of [generateShortDescription(input), generateWhatsApp(input)]) {
    assert.ok(text.includes(exception));
    assert.ok(text.includes(input.details.defects));
  }
});

test("separates short-description facts into readable complete sentences", () => {
  const text = generateShortDescription({
    ...product,
    name: "Celular",
    brand: "",
    model: "",
    features: "",
    location: "",
    delivery: "",
    details: { storage: "128 GB", ram: "8 GB" },
  });
  assert.match(text, /128 GB de almacenamiento; 8 GB de RAM\./u);
});

test("omits an overlong assertion together with its following-line exception", () => {
  const input = {
    ...product,
    features: `Funciona con las condiciones siguientes.\nExcepto cuando ${"se presenta una condición adicional ".repeat(40)}`,
  };
  for (const text of [generateShortDescription(input), generateWhatsApp(input)]) {
    assert.doesNotMatch(text, /Funciona con las condiciones/u);
    assert.match(text, /detalles o fallas en la descripción completa/u);
  }
});

test("always produces three unique bounded titles, even for colliding or unbroken names", () => {
  for (const name of ["En venta", "Vendo", "Venta de", "x".repeat(1000), "Producto ".repeat(100)]) {
    const titles = generateTitles({
      ...product,
      name,
      brand: "",
      model: "",
      price: null,
      condition: "",
      features: "",
      location: "",
    });
    assert.equal(titles.length, 3, name);
    assert.equal(new Set(titles.map((title) => title.toLocaleLowerCase("es"))).size, 3);
    assert.ok(titles.every((title) => title.length <= 90));
  }
});

test("short formats remain bounded when an atomic price or specification cannot fit", () => {
  const input = {
    ...product,
    price: Number.MAX_VALUE,
    details: { storage: "a".repeat(1000), defects: "Pantalla rota" },
  };
  assert.ok(generateShortDescription(input).length <= 300);
  assert.ok(generateWhatsApp(input).length <= 650);
  assert.ok(generateShortDescription(input).includes("Pantalla rota"));
  assert.doesNotMatch(generateShortDescription(input), /Almacenamiento:/u);
});

test("regeneration changes templates deterministically while retaining all facts", () => {
  const input = { ...product, details: detailedProducts[0].details };
  const original = generateAd(input, 0);
  const variant = generateAd(input, 1);
  assert.deepEqual(generateAd(input, 0), original);
  assert.notEqual(original.description, variant.description);
  assert.notDeepEqual(original.titles, variant.titles);
  assert.deepEqual(original.features, variant.features);
  assert.deepEqual(original.hashtags, variant.hashtags);
  assert.notEqual(original.instagram, original.marketplace);
  assert.notEqual(original.whatsapp, original.instagram);
  assert.ok(variant.marketplace.includes(variant.description));
});

test("keeps replacement-pattern characters in seller names literal", () => {
  for (const name of ["Equipo $& A", "Equipo $' B", "Equipo $` C", "Equipo $$ D"]) {
    const ad = generateAd({ ...product, name, brand: "", model: "" });
    assert.ok(ad.description.includes(name), name);
    assert.ok(ad.marketplace.includes(name), name);
    assert.doesNotMatch(ad.description, /\{name\}/u);
  }
});

test("only repeats seller-supplied claims about condition or warranties", () => {
  const sparse = {
    ...product,
    brand: "",
    model: "",
    features: "",
    details: {},
    condition: "" as const,
  };
  for (const condition of ["", "nuevo", "usado"] as const) {
    const ad = generateAd({ ...sparse, condition });
    assert.doesNotMatch(
      JSON.stringify(ad),
      /sin fallas|como nuevo|perfecto estado|original|garantizado/iu,
    );
  }
  const supplied = generateAd({
    ...sparse,
    features: "Cargador original; sin fallas detectadas en la revisión de hoy",
  });
  assert.ok(supplied.description.includes("Cargador original"));
  assert.ok(supplied.description.includes("sin fallas detectadas en la revisión de hoy"));
});

test("presents natural phone titles with a single identity and supplied facts", () => {
  const titles = generateTitles({
    ...product,
    name: "iphone 13",
    brand: "apple",
    model: "iphone 13",
    price: 1800,
    location: "lima",
    features: "",
    details: { storage: "128", ram: "4", color: "azul", carrier: "liberado" },
  }).map((title) => title.replace(/\s/gu, " "));
  assert.deepEqual(titles, [
    "Apple iPhone 13 128 GB Azul - Usado",
    "iPhone 13 128 GB liberado - S/ 1,800",
    "Apple iPhone 13 usado en Lima - 128 GB",
  ]);
  for (const title of titles) {
    assert.equal(title.match(/iPhone 13/gu)?.length, 1);
    assert.ok((title.match(/Apple/gu)?.length ?? 0) <= 1);
    assert.doesNotMatch(title, /Almacenamiento:|Color:/u);
  }
});

test("adds units to numeric details across generated channels without duplicating existing units", () => {
  for (const details of [
    { storage: "128", ram: "4", battery: "87" },
    { storage: "128 GB", ram: "4 GB", battery: "87%" },
  ]) {
    const ad = generateAd({ ...product, features: "", details });
    for (const text of [ad.description, ad.features.join("\n"), ad.marketplace, ad.instagram]) {
      assert.match(text, /Almacenamiento: 128 GB/u);
      assert.match(text, /RAM: 4 GB/u);
      assert.match(text, /Estado de batería: 87\s*%/u);
      assert.doesNotMatch(text, /GB\s*GB|%\s*%/u);
    }
  }
  const vehicle = generateAd({
    ...product,
    category: "motos",
    details: { mileage: "25000", engine: "150" },
  });
  assert.ok(vehicle.features.includes("Kilometraje: 25000 km"));
  assert.ok(vehicle.features.includes("Cilindrada: 150 cc"));
});

test("short copy selects highlights instead of reproducing the technical sheet", () => {
  const ad = generateAd({
    ...product,
    features: "",
    price: 1800,
    details: detailedProducts[0].details,
  });
  assert.ok(ad.shortDescription.length <= 300);
  assert.ok(ad.whatsapp.length <= 450);
  assert.ok(ad.shortDescription.length < ad.description.length / 2);
  assert.ok(ad.whatsapp.length < ad.marketplace.length / 2);
  assert.ok(ad.shortDescription.split(/[.!?]+(?:\s+|$)/u).filter(Boolean).length <= 4);
  for (const text of [ad.shortDescription, ad.whatsapp]) {
    assert.match(text, /Apple iPhone 13/u);
    assert.match(text, /Lima/u);
    assert.ok(text.includes(formatPrice(1800, "PEN")));
    assert.match(text, /No funciona la cámara frontal/u);
    assert.doesNotMatch(text, /Operador \/ liberado:|Accesorios incluidos:|Estado de batería:/u);
  }
  assert.ok(ad.whatsapp.includes("\n"));
  assert.ok(ad.marketplace.includes("Operador A; no comprobé otros operadores"));
  assert.ok(ad.marketplace.includes("Cable; sin cargador"));
  assert.ok(ad.instagram.endsWith(ad.hashtags.join(" ")));
});

test("normalizing names and units never infers a brand, condition or missing specification", () => {
  const ad = generateAd({
    ...product,
    name: "iphone 13",
    brand: "",
    model: "iphone 13",
    condition: "",
    price: null,
    location: "",
    delivery: "",
    features: "",
    details: {},
  });
  assert.ok(ad.description.includes("iPhone 13"));
  assert.doesNotMatch(
    JSON.stringify(ad),
    /Apple|Usado|Nuevo|Lima|GB|%|liberado|original|garantizado|sin fallas/iu,
  );
  for (const title of ad.titles) assert.equal(title.match(/iPhone 13/gu)?.length, 1);
});

test("calculates margin on sale price instead of treating it as a cost markup", () => {
  assert.deepEqual(calculateSalePrice({ cost: 100, expenses: 0, margin: 20, fee: 0 }), {
    price: 125,
    totalCost: 100,
    commission: 0,
    profit: 25,
  });
  assert.deepEqual(calculateSalePrice({ cost: 100, expenses: 10, margin: 20, fee: 10 }), {
    price: 157.15,
    totalCost: 110,
    commission: 15.72,
    profit: 31.43,
  });
});

test("uses exact cents and basis points rather than adding a cent from float error", () => {
  assert.deepEqual(calculateSalePrice({ cost: 100000, expenses: 0, margin: 80, fee: 0 }), {
    price: 500000,
    totalCost: 100000,
    commission: 0,
    profit: 400000,
  });
  assert.equal(calculateSalePrice({ cost: 50000, expenses: 0, margin: 90, fee: 0 }).price, 500000);
  assert.equal(calculateSalePrice({ cost: 0.1, expenses: 0.2, margin: 0, fee: 0 }).price, 0.3);
});

test("preserves the requested margin after rounding the commission to cents", () => {
  assert.deepEqual(calculateSalePrice({ cost: 1, expenses: 0, margin: 30, fee: 10 }), {
    price: 1.68,
    totalCost: 1,
    commission: 0.17,
    profit: 0.51,
  });
  for (const [margin, fee] of [
    [30, 10],
    [99.98, 0.01],
    [0.01, 99.98],
    [33.33, 33.33],
  ]) {
    const result = calculateSalePrice({ cost: 1.01, expenses: 0.01, margin, fee });
    assert.ok((result.profit / result.price) * 100 >= margin - 1e-10);
    assert.equal(
      Math.round(result.profit * 100),
      Math.round(result.price * 100) -
        Math.round(result.totalCost * 100) -
        Math.round(result.commission * 100),
    );
  }
});

test("returns exact zero amounts when the product and expenses cost zero", () => {
  assert.deepEqual(calculateSalePrice({ cost: 0, expenses: 0, margin: 90, fee: 9.99 }), {
    price: 0,
    totalCost: 0,
    commission: 0,
    profit: 0,
  });
});

test("rejects impossible percentages and invalid numbers instead of returning misleading prices", () => {
  for (const input of [
    { cost: 100, expenses: 0, margin: 90, fee: 10 },
    { cost: 100, expenses: 0, margin: 101, fee: 0 },
    { cost: -1, expenses: 0, margin: 20, fee: 0 },
    { cost: 100, expenses: Number.NaN, margin: 20, fee: 0 },
    { cost: Number.POSITIVE_INFINITY, expenses: 0, margin: 20, fee: 0 },
    { cost: Number.MAX_VALUE, expenses: Number.MAX_VALUE, margin: 20, fee: 0 },
    { cost: 1.005, expenses: 0, margin: 20, fee: 0 },
    { cost: 100, expenses: 0, margin: 20.001, fee: 0 },
  ]) {
    assert.throws(() => calculateSalePrice(input), RangeError);
  }
  assert.equal(calculateSalePrice({ cost: 0, expenses: 0, margin: 0, fee: 0 }).price, 0);
});
