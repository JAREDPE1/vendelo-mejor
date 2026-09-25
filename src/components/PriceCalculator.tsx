"use client";

import { useRef, useState, type FormEvent } from "react";
import { calculateSalePrice, type SalePriceResult } from "@/lib/pricing";
import { formatPrice } from "@/lib/generators";
import { currencyOptions, type Currency } from "@/types/product";
import { FormField } from "@/components/FormField";
import { GeneratedResult } from "@/components/GeneratedResult";
import { Icon } from "@/components/Icon";

export function PriceCalculator() {
  const [result, setResult] = useState<(SalePriceResult & { currency: Currency }) | null>(null);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const calculated = calculateSalePrice({
        cost: Number(data.get("cost")),
        expenses: Number(data.get("expenses")),
        margin: Number(data.get("margin")),
        fee: Number(data.get("fee")),
      });
      setResult({ ...calculated, currency: data.get("currency") as Currency });
      setDirty(false);
      setError("");
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revisa los valores introducidos.");
      setResult(null);
    }
  }
  return (
    <div className="workspace-grid">
      <form className="form-panel" onSubmit={submit} onChange={() => setDirty(true)}>
        <div className="panel-title">
          <span className="icon-box teal">
            <Icon name="calculator" />
          </span>
          <div>
            <h2>Los números de tu venta</h2>
            <p>Introduce los importes por unidad.</p>
          </div>
        </div>
        <div className="form-grid">
          <FormField id="cost" label="Costo del producto">
            <input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              max="999999999"
              required
              placeholder="Ej. 100.00"
              inputMode="decimal"
            />
          </FormField>
          <FormField
            id="expenses"
            label="Gastos adicionales"
            hint="Embalaje, transporte u otros costos."
          >
            <input
              id="expenses"
              name="expenses"
              type="number"
              step="0.01"
              min="0"
              max="999999999"
              required
              defaultValue="0"
              inputMode="decimal"
              aria-describedby="expenses-hint"
            />
          </FormField>
          <FormField id="margin" label="Margen deseado (%)" hint="Beneficio sobre el precio final.">
            <input
              id="margin"
              name="margin"
              type="number"
              step="0.01"
              min="0"
              max="99.99"
              required
              defaultValue="20"
              inputMode="decimal"
              aria-describedby="margin-hint"
            />
          </FormField>
          <FormField
            id="fee"
            label="Comisión de venta (%)"
            hint="Porcentaje sobre el precio final."
          >
            <input
              id="fee"
              name="fee"
              type="number"
              step="0.01"
              min="0"
              max="99.99"
              required
              defaultValue="0"
              inputMode="decimal"
              aria-describedby="fee-hint"
            />
          </FormField>
          <FormField id="currency" label="Moneda" className="full">
            <select id="currency" name="currency" defaultValue="PEN">
              {currencyOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary submit-button" type="submit">
          Calcular precio de venta
          <Icon name="arrow" size={18} />
        </button>
        <p className="field-hint">La suma del margen y la comisión debe ser menor que 100 %.</p>
      </form>
      <div
        className="results-panel"
        ref={resultRef}
        tabIndex={-1}
        aria-label="Resultado del cálculo"
      >
        <h2>Un precio con tus costos en cuenta</h2>
        {dirty && result && (
          <p role="status" className="notice">
            Vuelve a calcular para actualizar los importes.
          </p>
        )}
        {result ? (
          <>
            <div className="price-total">
              <span>Precio de venta calculado</span>
              <strong>{formatPrice(result.price, result.currency)}</strong>
              <span>Redondeado para cubrir el margen y la comisión.</span>
            </div>
            <dl className="price-breakdown">
              <div>
                <dt>Costos y gastos</dt>
                <dd>{formatPrice(result.totalCost, result.currency)}</dd>
              </div>
              <div>
                <dt>Comisión de venta</dt>
                <dd>{formatPrice(result.commission, result.currency)}</dd>
              </div>
              <div>
                <dt>Beneficio estimado</dt>
                <dd>{formatPrice(result.profit, result.currency)}</dd>
              </div>
            </dl>
            <GeneratedResult
              title="Resumen del cálculo"
              text={`Precio de venta: ${formatPrice(result.price, result.currency)}\nCostos y gastos: ${formatPrice(result.totalCost, result.currency)}\nComisión: ${formatPrice(result.commission, result.currency)}\nBeneficio estimado: ${formatPrice(result.profit, result.currency)}`}
            />
          </>
        ) : (
          <div className="empty-result">
            <span className="empty-icon">
              <Icon name="calculator" size={34} />
            </span>
            <h3>Menos cuentas. Más claridad.</h3>
            <p>Completa tus costos y el margen deseado para ver el desglose.</p>
          </div>
        )}
        <p className="result-footnote">
          Es una estimación basada en tus datos; no representa el valor de mercado ni incluye
          impuestos o costos que no hayas introducido.
        </p>
      </div>
    </div>
  );
}
