import type { GeneratedAd } from "@/types/product";
import { GeneratedResult } from "@/components/GeneratedResult";

export function AdResults({ ad }: { ad: GeneratedAd }) {
  const results = [
    { title: "Descripción corta", text: ad.shortDescription },
    { title: "Descripción completa", text: ad.description },
    { title: "Lista de características", text: ad.features.map((item) => `• ${item}`).join("\n") },
    { title: "Texto para WhatsApp", text: ad.whatsapp },
    { title: "Texto para Marketplace", text: ad.marketplace },
    { title: "Texto para Instagram", text: ad.instagram },
    { title: "Hashtags", text: ad.hashtags.join(" ") },
  ];
  return (
    <>
      <div className="ad-title-options">
        <h3>Tres títulos para elegir</h3>
        <p>Elige el que mejor represente tu producto.</p>
        <div className="title-options-grid">
          {ad.titles.map((text, index) => (
            <GeneratedResult
              key={index}
              title={`Título ${index + 1}`}
              text={text}
              headingLevel={4}
            />
          ))}
        </div>
      </div>
      <div className="ad-results-grid">
        {results.map((result) => (
          <GeneratedResult key={result.title} {...result} />
        ))}
      </div>
    </>
  );
}
