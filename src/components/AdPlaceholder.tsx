// Layout-only integration point. Before adding AdSense, review consent, policies,
// placement and cumulative layout shift. Never insert an ad ID in this component.
export function AdPlaceholder({ placement }: { placement: "home-bottom" | "tool-bottom" }) {
  if (process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS !== "true") return null;
  return (
    <aside
      className="ad-placeholder"
      data-ad-placement={placement}
      aria-label="Espacio reservado para publicidad"
    >
      <span>Espacio publicitario · Vista previa</span>
    </aside>
  );
}
