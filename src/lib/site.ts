const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const parsedOrigin = new URL(configuredOrigin || "http://localhost:3000");
if (
  !["http:", "https:"].includes(parsedOrigin.protocol) ||
  parsedOrigin.pathname !== "/" ||
  parsedOrigin.search ||
  parsedOrigin.hash ||
  parsedOrigin.username ||
  parsedOrigin.password
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL debe ser un origen HTTP(S), sin ruta, parámetros ni credenciales.",
  );
}

export const site = {
  name: "Véndelo Mejor",
  tagline: "Publica mejor. Vende más fácil.",
  url: parsedOrigin.origin,
  isPublic:
    Boolean(configuredOrigin) &&
    !["localhost", "127.0.0.1", "[::1]"].includes(parsedOrigin.hostname),
  contactEmail: process.env.CONTACT_EMAIL?.trim() || "",
};

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
