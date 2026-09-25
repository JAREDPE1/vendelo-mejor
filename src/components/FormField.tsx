import type { ReactNode } from "react";

export function FormField({
  id,
  label,
  optional,
  hint,
  children,
  className = "",
  error,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span>Opcional</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
