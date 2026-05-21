import type { CSSProperties } from "react";

interface TeamMarkProps {
  short: string;
  accent?: string;
  size?: number;
  style?: CSSProperties;
}

function pickFg(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#fff";
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.62 ? "#1a1612" : "#fafafa";
}

export function TeamMark({
  short,
  accent = "#888888",
  size = 28,
  style,
}: TeamMarkProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: Math.max(2, size * 0.14),
        background: accent,
        color: pickFg(accent),
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: size * 0.34,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {short}
    </span>
  );
}
