import { CopyButton } from "@/components/CopyButton";

export function GeneratedResult({
  title,
  text,
  index,
  headingLevel = 3,
}: {
  title: string;
  text: string;
  index?: number;
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return (
    <section className="generated-result">
      <div className="result-heading">
        <Heading>
          {index !== undefined && (
            <span className="result-index">{String(index + 1).padStart(2, "0")}</span>
          )}
          {title}
        </Heading>
        {text.trim() && <CopyButton text={text} label={title} />}
      </div>
      <p className="result-text">
        {text.trim() ? text : "Añade información sobre tu producto para completar este resultado."}
      </p>
    </section>
  );
}
