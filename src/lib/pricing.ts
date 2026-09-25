export interface SalePriceInput {
  cost: number;
  expenses: number;
  /** Desired profit as a percentage of the final sale price. */
  margin: number;
  /** Platform commission as a percentage of the final sale price. */
  fee: number;
}

export interface SalePriceResult {
  price: number;
  profit: number;
  totalCost: number;
  commission: number;
}

const PERCENT_SCALE = 10_000n;
const MAX_SAFE_CENTS = BigInt(Number.MAX_SAFE_INTEGER);

/** Parse the same two decimal places accepted by the form, without float math. */
function hundredths(value: number): bigint {
  if (value > Number.MAX_SAFE_INTEGER / 100) {
    throw new RangeError("Los valores son demasiado grandes para calcular un precio válido.");
  }
  const decimal = value.toFixed(2);
  if (Number(decimal) !== value) {
    throw new RangeError("Utiliza como máximo dos decimales en los importes y porcentajes.");
  }
  return BigInt(decimal.replace(".", ""));
}

function divideUp(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator;
}

function commissionCents(price: bigint, fee: bigint): bigint {
  // Round a half cent upwards, as with the monetary amounts shown in the UI.
  return (price * fee + PERCENT_SCALE / 2n) / PERCENT_SCALE;
}

/** sale price = (product cost + expenses) / (1 - margin - commission). */
export function calculateSalePrice(input: SalePriceInput): SalePriceResult {
  const { cost, expenses, margin, fee } = input;

  if ([cost, expenses, margin, fee].some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError("Todos los valores deben ser números finitos mayores o iguales a cero.");
  }
  const costInCents = hundredths(cost) + hundredths(expenses);
  const marginInBasisPoints = hundredths(margin);
  const feeInBasisPoints = hundredths(fee);
  const denominator = PERCENT_SCALE - marginInBasisPoints - feeInBasisPoints;

  if (denominator <= 0n) {
    throw new RangeError("La suma del margen y la comisión debe ser menor que 100 %.");
  }

  let priceInCents = divideUp(costInCents * PERCENT_SCALE, denominator);
  let commissionInCents = commissionCents(priceInCents, feeInBasisPoints);
  let profitInCents = priceInCents - costInCents - commissionInCents;

  // A commission rounded up can lower the displayed margin. Raise the price
  // only as needed so even the final cent-based breakdown meets the target.
  while (profitInCents * PERCENT_SCALE < priceInCents * marginInBasisPoints) {
    priceInCents += 1n;
    commissionInCents = commissionCents(priceInCents, feeInBasisPoints);
    profitInCents = priceInCents - costInCents - commissionInCents;
  }

  if (priceInCents > MAX_SAFE_CENTS || costInCents > MAX_SAFE_CENTS) {
    throw new RangeError("Los valores son demasiado grandes para calcular un precio válido.");
  }

  return {
    price: Number(priceInCents) / 100,
    profit: Number(profitInCents) / 100,
    totalCost: Number(costInCents) / 100,
    commission: Number(commissionInCents) / 100,
  };
}
