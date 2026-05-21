"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { MetaLabel } from "@/components/ui/meta-label";

interface CardProps {
  title?: string;
  subtitle?: string;
  accent?: string;
  padding?: number;
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({
  title,
  subtitle,
  accent,
  padding = 20,
  children,
  style,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 12,
        background: "var(--bg-elev)",
        padding,
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
        transition: "border-color .2s, transform .2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontWeight:
                    "var(--display-weight, 350)" as CSSProperties["fontWeight"],
                  fontVariationSettings: "var(--display-settings, normal)",
                  fontSize: 20,
                  color: "var(--fg)",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div style={{ marginTop: 4 }}>
                <MetaLabel>{subtitle}</MetaLabel>
              </div>
            )}
          </div>
          {accent && (
            <MetaLabel
              style={{ letterSpacing: "0.14em", color: "var(--accent)" }}
            >
              {accent}
            </MetaLabel>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
