"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus("idle"), 4000);
  }
  return (
    <span className="copy-control">
      <button type="button" className="copy-button" onClick={copy} aria-label={`Copiar ${label}`}>
        <Icon name={status === "copied" ? "check" : "copy"} size={16} />
        {status === "copied" ? "Copiado" : "Copiar"}
      </button>
      <span className={status === "error" ? "copy-error" : "sr-only"} role="status">
        {status === "error"
          ? "No se pudo copiar. Selecciona el texto y cópialo manualmente."
          : status === "copied"
            ? `${label} copiado`
            : ""}
      </span>
    </span>
  );
}
