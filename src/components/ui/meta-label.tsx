import type { CSSProperties } from "react";

interface MetaLabelProps {
  children: React.ReactNode;
  color?: string;
  style?: CSSProperties;
}

export function MetaLabel({ children, color, style }: MetaLabelProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: color ?? "var(--fg-faint)",
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
