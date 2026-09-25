import { ToolPage } from "@/components/ToolPage";
import { tools } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

const tool = tools[0];
export const metadata = pageMetadata(
  "Crear anuncio de venta gratis",
  tool.description,
  "/crear-anuncio",
);
export default function CreateAdPage() {
  return <ToolPage tool={tool} />;
}
