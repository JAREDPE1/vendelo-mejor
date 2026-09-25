import Link from "next/link";
import type { ToolDefinition } from "@/data/tools";
import { Icon } from "@/components/Icon";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link href={`/${tool.slug}`} className="tool-card">
      <span className={`icon-box ${tool.color}`}>
        <Icon name={tool.icon} size={24} />
      </span>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <span className="card-action">
        {tool.action}
        <Icon name="arrow" size={17} />
      </span>
    </Link>
  );
}
