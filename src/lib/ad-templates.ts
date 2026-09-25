import type { ProductCategory, ProductCondition } from "../types/product.ts";

interface CategoryTemplate {
  fallbackName: string;
  hashtags: string[];
  introductions: [string, string, string];
  closings: [string, string, string];
}

/** Templates describe a sale or invite a question; they never certify a product. */
export const categoryTemplates: Record<ProductCategory, CategoryTemplate> = {
  celulares: {
    fallbackName: "Celular",
    hashtags: ["Celulares", "Tecnologia"],
    introductions: [
      "Vendo {name}.",
      "Pongo a la venta {name}.",
      "¿Buscas un celular? Tengo en venta {name}.",
    ],
    closings: [
      "Escríbeme para consultar sobre este celular y confirmar los detalles que necesites antes de comprar.",
      "Si quieres confirmar la memoria, la batería o la compatibilidad con tu operador, podemos conversarlo antes de la compra.",
      "Puedes consultarme qué incluye la venta y resolver tus dudas sobre el equipo antes de decidir.",
    ],
  },
  laptops: {
    fallbackName: "Laptop",
    hashtags: ["Laptops", "Computacion"],
    introductions: [
      "Pongo a la venta {name}.",
      "Vendo {name}; puedes consultar sus especificaciones antes de decidir.",
      "Tengo en venta {name}.",
    ],
    closings: [
      "Si necesitas confirmar alguna especificación o compatibilidad de esta laptop, escríbeme.",
      "Cuéntame qué especificación necesitas comprobar y resolvemos las dudas antes de la compra.",
      "Podemos conversar sobre las conexiones y la configuración de la laptop antes de coordinar la compra.",
    ],
  },
  motos: {
    fallbackName: "Moto",
    hashtags: ["Motos", "Motociclismo"],
    introductions: [
      "Vendo {name}.",
      "Pongo en venta {name}; puedes consultarme los datos de la moto antes de decidir.",
      "Tengo a la venta {name}.",
    ],
    closings: [
      "Escríbeme para consultar los detalles de la moto y coordinar una revisión antes de decidir.",
      "Podemos conversar sobre la moto y la documentación que necesitas revisar antes de la compra.",
      "Si te interesa, conversemos sobre los datos de la moto y cómo coordinar una revisión.",
    ],
  },
  autos: {
    fallbackName: "Auto",
    hashtags: ["Autos", "Vehiculos"],
    introductions: [
      "Tengo a la venta {name}.",
      "Vendo {name}; puedes consultarme los datos del vehículo antes de decidir.",
      "Pongo en venta {name}.",
    ],
    closings: [
      "Contáctame para consultar sobre el auto y coordinar una revisión del vehículo y su documentación.",
      "Si te interesa el auto, conversemos sobre una revisión y la documentación antes de avanzar con la compra.",
      "Puedes escribirme para consultar sobre el vehículo, revisar la documentación y coordinar los siguientes pasos.",
    ],
  },
  muebles: {
    fallbackName: "Mueble",
    hashtags: ["Muebles", "Hogar"],
    introductions: [
      "Vendo {name}.",
      "Pongo a la venta {name}; puedes consultarme los detalles antes de decidir si encaja en tu espacio.",
      "Tengo en venta {name}.",
    ],
    closings: [
      "Escríbeme para confirmar medidas y acordar los detalles del traslado antes de comprar.",
      "Podemos confirmar las medidas y conversar sobre el traslado antes de coordinar la compra.",
      "Si te interesa, conversemos sobre las medidas, el acceso al lugar y cómo organizar el traslado.",
    ],
  },
  electrodomesticos: {
    fallbackName: "Electrodoméstico",
    hashtags: ["Electrodomesticos", "Hogar"],
    introductions: [
      "Pongo a la venta {name}.",
      "Vendo {name}; puedes consultarme los datos del equipo antes de decidir.",
      "Tengo en venta {name}.",
    ],
    closings: [
      "Contáctame para consultar dimensiones, conexiones y otros detalles de este electrodoméstico.",
      "Podemos confirmar las conexiones, la capacidad y los detalles que necesites para valorar la compra.",
      "Si te interesa, conversemos sobre el espacio y las conexiones que requiere el equipo antes de comprar.",
    ],
  },
  otros: {
    fallbackName: "Producto",
    hashtags: ["CompraVenta", "Productos"],
    introductions: ["Vendo {name}.", "Pongo a la venta {name}.", "Tengo en venta {name}."],
    closings: [
      "Escríbeme para consultar más detalles y resolver tus dudas antes de comprar.",
      "Si te interesa, podemos conversar sobre el producto antes de coordinar la compra.",
      "Puedes consultarme la información que necesites para decidir.",
    ],
  },
};

export const conditionLabels: Record<ProductCondition, string> = {
  "": "",
  nuevo: "Nuevo",
  "como-nuevo": "Como nuevo",
  usado: "Usado",
};

/** No inferred warranties, accessories, service history or condition claims. */
export function conditionContext(condition: ProductCondition, hasUsageDetails: boolean): string {
  if (condition === "usado") {
    return hasUsageDetails
      ? "Ten en cuenta también los detalles de uso indicados al valorar la compra."
      : "Si necesitas conocer algún detalle de uso, puedes consultármelo antes de comprar.";
  }
  if (condition === "como-nuevo") {
    return "Puedes consultarme los detalles del estado antes de coordinar la compra.";
  }
  return "";
}
