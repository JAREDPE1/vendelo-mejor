export type ProductCategory =
  | "celulares"
  | "laptops"
  | "motos"
  | "autos"
  | "muebles"
  | "electrodomesticos"
  | "otros";

export type ProductCondition = "" | "nuevo" | "como-nuevo" | "usado";
export type Currency = "PEN" | "USD" | "EUR" | "MXN" | "COP";

export type ProductDetailKey =
  | "storage"
  | "ram"
  | "color"
  | "battery"
  | "carrier"
  | "accessories"
  | "defects"
  | "processor"
  | "graphics"
  | "screen"
  | "charger"
  | "year"
  | "mileage"
  | "engine"
  | "documents"
  | "fuel"
  | "transmission"
  | "material"
  | "dimensions"
  | "usageTime"
  | "capacity"
  | "voltage";

export type ProductDetails = Partial<Record<ProductDetailKey, string>>;

export interface ProductInput {
  name: string;
  category: ProductCategory;
  brand: string;
  model: string;
  price: number | null;
  currency: Currency;
  condition: ProductCondition;
  features: string;
  location: string;
  delivery: string;
  details?: ProductDetails;
}

export interface GeneratedAd {
  title: string;
  titles: string[];
  shortDescription: string;
  description: string;
  features: string[];
  whatsapp: string;
  marketplace: string;
  instagram: string;
  hashtags: string[];
}

export interface ImprovedAd {
  text: string;
  suggestions: string[];
}

export const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "celulares", label: "Celulares" },
  { value: "laptops", label: "Laptops" },
  { value: "motos", label: "Motos" },
  { value: "autos", label: "Autos" },
  { value: "muebles", label: "Muebles" },
  { value: "electrodomesticos", label: "Electrodomésticos" },
  { value: "otros", label: "Otros productos" },
];

export const conditionOptions: { value: ProductCondition; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "como-nuevo", label: "Como nuevo" },
  { value: "usado", label: "Usado" },
];

export const currencyOptions: { value: Currency; label: string }[] = [
  { value: "PEN", label: "Soles (PEN)" },
  { value: "USD", label: "Dólares (USD)" },
  { value: "EUR", label: "Euros (EUR)" },
  { value: "MXN", label: "Pesos mexicanos (MXN)" },
  { value: "COP", label: "Pesos colombianos (COP)" },
];
