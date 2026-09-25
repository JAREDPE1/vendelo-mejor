import type { ProductCategory, ProductDetailKey } from "../types/product.ts";

export interface CategoryField {
  key: ProductDetailKey;
  label: string;
  placeholder: string;
  kind?: "textarea" | "number" | "select";
  options?: string[];
  min?: number;
  max?: number;
  step?: string;
  maxLength?: number;
  hint?: string;
}

const storage: CategoryField = {
  key: "storage",
  label: "Almacenamiento",
  placeholder: "Ej. 256 GB",
};
const ram: CategoryField = { key: "ram", label: "RAM", placeholder: "Ej. 8 GB" };
const color: CategoryField = { key: "color", label: "Color", placeholder: "Ej. Azul oscuro" };
const accessories: CategoryField = {
  key: "accessories",
  label: "Accesorios incluidos",
  placeholder: "Indica exactamente qué entregas",
  maxLength: 240,
};
const defects: CategoryField = {
  key: "defects",
  label: "Detalles o fallas",
  placeholder: "Ej. Rayón en un lateral. Si lo revisaste, cuenta lo que observaste.",
  kind: "textarea",
  maxLength: 800,
  hint: "Describe lo que conoces, aunque sea un detalle pequeño.",
};
const year: CategoryField = {
  key: "year",
  label: "Año",
  placeholder: "Ej. 2022",
  kind: "number",
  min: 1885,
  step: "1",
};
const mileage: CategoryField = {
  key: "mileage",
  label: "Kilometraje (km)",
  placeholder: "Ej. 25000",
  kind: "number",
  min: 0,
  step: "0.01",
};
const documents: CategoryField = {
  key: "documents",
  label: "Documentos",
  placeholder: "Indica qué documentación puedes mostrar",
  maxLength: 240,
  hint: "No publiques números de documento ni datos personales.",
};
const usageTime: CategoryField = {
  key: "usageTime",
  label: "Tiempo de uso",
  placeholder: "Ej. 2 años de uso",
};

/** Single source for form fields and facts admitted into generated text. */
export const categoryFields: Record<ProductCategory, CategoryField[]> = {
  celulares: [
    storage,
    ram,
    color,
    {
      key: "battery",
      label: "Estado de batería",
      placeholder: "Ej. Salud de batería: 87 %, consultada en ajustes",
    },
    {
      key: "carrier",
      label: "Operador / liberado",
      placeholder: "Ej. Operador actual o liberado, si lo comprobaste",
    },
    accessories,
    defects,
  ],
  laptops: [
    { key: "processor", label: "Procesador", placeholder: "Ej. Intel Core i5-1135G7" },
    ram,
    { ...storage, placeholder: "Ej. SSD de 512 GB" },
    { key: "graphics", label: "Tarjeta gráfica", placeholder: "Ej. Intel Iris Xe" },
    { key: "screen", label: "Tamaño de pantalla", placeholder: "Ej. 15,6 pulgadas" },
    {
      key: "charger",
      label: "Cargador incluido",
      placeholder: "Selecciona una opción",
      kind: "select",
      options: ["Sí", "No"],
    },
    defects,
  ],
  motos: [
    year,
    mileage,
    {
      key: "engine",
      label: "Cilindrada (cc)",
      placeholder: "Ej. 150",
      kind: "number",
      min: 1,
      step: "1",
    },
    documents,
    color,
    defects,
  ],
  autos: [
    year,
    mileage,
    { key: "fuel", label: "Combustible", placeholder: "Ej. Gasolina, diésel, eléctrico" },
    { key: "transmission", label: "Transmisión", placeholder: "Ej. Manual o automática" },
    documents,
    color,
    defects,
  ],
  muebles: [
    { key: "material", label: "Material", placeholder: "Ej. Madera de pino" },
    { key: "dimensions", label: "Medidas", placeholder: "Ej. 120 × 60 × 75 cm" },
    color,
    usageTime,
    { ...defects, label: "Detalles" },
  ],
  electrodomesticos: [
    { key: "capacity", label: "Capacidad", placeholder: "Ej. 8 kg o 300 litros" },
    {
      key: "voltage",
      label: "Voltaje (si corresponde)",
      placeholder: "Ej. 220 V, según la placa del equipo",
    },
    usageTime,
    accessories,
    defects,
  ],
  otros: [],
};
