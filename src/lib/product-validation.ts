import { categoryFields } from "../data/category-fields.ts";
import type { ProductInput } from "../types/product.ts";

export type ProductErrors = Record<string, string>;

export function validateProductInput(
  input: ProductInput,
  options: { requirePrice?: boolean; requireFeatures?: boolean } = {},
): ProductErrors {
  const errors: ProductErrors = {};
  if (!input.name.trim() || !/[\p{L}\p{N}]/u.test(input.name))
    errors.name = "Escribe el nombre de tu producto.";
  if (input.price === null && options.requirePrice) errors.price = "Añade el precio del producto.";
  if (
    input.price !== null &&
    (!Number.isFinite(input.price) ||
      input.price < 0 ||
      input.price > 999999999 ||
      Number(input.price.toFixed(2)) !== input.price)
  )
    errors.price = "Introduce un precio entre 0 y 999 999 999, con hasta dos decimales.";
  if (options.requireFeatures && !input.features.trim())
    errors.features = "Añade al menos una característica real del producto.";
  for (const field of categoryFields[input.category]) {
    const value = input.details?.[field.key]?.trim();
    if (!value) continue;
    if (field.kind === "number") {
      const number = Number(value);
      if (
        !Number.isFinite(number) ||
        number < (field.min ?? 0) ||
        (field.step === "1" ? !Number.isInteger(number) : Number(number.toFixed(2)) !== number)
      ) {
        errors[`detail-${field.key}`] =
          field.step === "1"
            ? `Introduce un número entero a partir de ${field.min ?? 0}.`
            : "Introduce un número mayor o igual a cero, con hasta dos decimales.";
      }
    }
    if (field.options && !field.options.includes(value))
      errors[`detail-${field.key}`] = "Selecciona una de las opciones disponibles.";
  }
  return errors;
}
