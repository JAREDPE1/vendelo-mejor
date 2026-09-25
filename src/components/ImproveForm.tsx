"use client";

import { useRef, useState, type FormEvent } from "react";
import { improveAd } from "@/lib/generators";
import type { ImprovedAd } from "@/types/product";
import { FormField } from "@/components/FormField";
import { GeneratedResult } from "@/components/GeneratedResult";
import { Icon } from "@/components/Icon";

export function ImproveForm() {
  const [result, setResult] = useState<ImprovedAd | null>(null);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const original = String(new FormData(event.currentTarget).get("original") || "");
    if (!original.trim()) {
      setError("Pega o escribe el anuncio que quieres mejorar.");
      return;
    }
    setResult(improveAd(original));
    setError("");
    setDirty(false);
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  return (
    <div className="workspace-grid">
      <form className="form-panel" onSubmit={submit} onChange={() => setDirty(true)}>
        <div className="panel-title">
          <span className="icon-box rose">
            <Icon name="edit" />
          </span>
          <div>
            <h2>Tu anuncio actual</h2>
            <p>Un buen punto de partida para mejorarlo.</p>
          </div>
        </div>
        <FormField
          id="original"
          label="Pega aquí tu anuncio"
          hint="Se ajustan espacios y saltos de línea. Las sugerencias te ayudan a completar la información."
        >
          <textarea
            id="original"
            name="original"
            rows={10}
            required
            maxLength={6000}
            placeholder="Vendo escritorio de madera, usado. Medidas: 120 × 60 cm..."
            aria-describedby="original-hint"
          />
        </FormField>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary submit-button" type="submit">
          <Icon name="edit" size={18} />
          Mejorar mi anuncio
          <Icon name="arrow" size={18} />
        </button>
        <p className="form-privacy">
          <Icon name="shield" size={14} /> Tu texto se procesa en este navegador.
        </p>
      </form>
      <div className="results-panel" ref={resultRef} tabIndex={-1} aria-label="Anuncio revisado">
        <h2>Más orden, la misma información</h2>
        {dirty && result && (
          <p role="status" className="notice">
            Vuelve a mejorar el anuncio para revisar tus cambios.
          </p>
        )}
        {result ? (
          <>
            <GeneratedResult title="Anuncio revisado" text={result.text} />
            <div className="improvement-tips">
              <h3>Qué puedes mejorar</h3>
              <ul className="checklist">
                {result.suggestions.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={17} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="empty-result">
            <span className="empty-icon">
              <Icon name="edit" size={34} />
            </span>
            <h3>Una segunda mirada a tu anuncio</h3>
            <p>Recibe un texto con el formato limpio y sugerencias para completar los detalles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
