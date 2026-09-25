import type { CSSProperties } from "react";

const paths: Record<string, string[]> = {
  arrow: ["M5 12h14m-5-5 5 5-5 5"],
  check: ["m5 12 4 4L19 6"],
  plus: ["M12 5v14M5 12h14"],
  pin: ["M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z", "M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
  sparkles: ["m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z", "M20 2v4m-2-2h4"],
  type: ["M4 5h16M12 5v15m-4 0h8M4 5v3m16-3v3"],
  align: ["M5 5h14M5 10h14M5 15h10M5 20h13"],
  hash: ["m10 3-4 18M18 3l-4 18M3 9h18M2 15h18"],
  message: [
    "M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.8-5.1a8.5 8.5 0 1 1 16.2-4.4Z",
    "M8 9h8M8 13h5",
  ],
  calculator: [
    "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
    "M8 7h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1",
  ],
  edit: ["m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Z"],
  phone: [
    "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z",
    "M10 18h4M10 5h4",
  ],
  laptop: ["M5 4h14v12H5V4Z", "M2 20h20l-3-4H5l-3 4Z"],
  motorbike: [
    "M8 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    "m5 16 5-7 5 7H5m5-7H7m8 7L13 5h4",
  ],
  car: ["m5 6-2 8v5h3v-2h12v2h3v-5l-2-8H5Z", "M4 12h16M6 14h1m10 0h1"],
  sofa: ["M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 17v3m14-3v3", "M5 13V9H2v8h20V9h-3v4H5Z"],
  appliance: ["M5 3h14v18H5V3ZM5 8h14M8 5.5h1m3 0h1", "M16 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"],
  copy: ["M9 8h11v13H9V8Z", "M15 8V3H4v13h5"],
  shield: ["m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z", "m8 12 3 3 5-6"],
  bolt: ["m13 2-9 12h7l-1 8 10-13h-8l1-7Z"],
  tag: ["M3 3h8l10 10-8 8L3 11V3Z", "M7 7h.01"],
  chevron: ["m9 5 7 7-7 7"],
  menu: ["M4 6h16M4 12h16M4 18h16"],
  close: ["m6 6 12 12M6 18 18 6"],
  info: ["M12 11v6m0-10v.01", "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"],
};

export function Icon({
  name,
  size = 22,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {(paths[name] || paths.tag).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
