"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import type { Theme } from "@/hooks/use-theme";
import { ThemePopover } from "@/components/features/theme-popover";

interface DetailHeaderProps {
  active: "f1" | "football";
  copy: Copy;
  onNav: (section: "f1" | "football") => void;
  theme?: Theme;
  onTheme?: (patch: Partial<Theme>) => void;
}

export function DetailHeader({
  active,
  copy,
  onNav,
  theme,
  onTheme,
}: DetailHeaderProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "14px 32px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 24,
        transition: "background .3s, border-color .3s",
      }}
    >
      <Link
        href="/"
        aria-label={copy.backToHome}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--fg)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          fontWeight:
            "var(--display-weight, 350)" as CSSProperties["fontWeight"],
          padding: 0,
          textDecoration: "none",
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: "var(--fg-muted)",
            fontStyle: "normal",
            fontFamily: "var(--font-mono)",
          }}
        >
          ←
        </span>
        Grid<span style={{ color: "var(--accent)" }}>.</span>
      </Link>

      <nav style={{ display: "flex", gap: 4, marginLeft: 32 }}>
        {[
          { id: "f1" as const, label: copy.f1Section },
          { id: "football" as const, label: copy.footballSection },
        ].map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNav(tab.id)}
              style={{
                background: selected ? "var(--bg-elev-2)" : "transparent",
                border: "none",
                color: selected ? "var(--fg)" : "var(--fg-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "8px 14px",
                borderRadius: 6,
                cursor: "pointer",
                position: "relative",
                transition: "background .15s, color .15s",
              }}
            >
              {tab.label}
              {selected && (
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 4,
                    height: 1.5,
                    background: "var(--accent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {theme && onTheme && (
        <div style={{ marginLeft: "auto" }}>
          <ThemePopover
            dark={theme.dark}
            accent={theme.accent}
            lang={theme.lang}
            name={theme.name}
            onName={(n) => onTheme({ name: n })}
            bg={theme.bg}
            onBg={(id) => onTheme({ bg: id })}
            onDark={(v) => onTheme({ dark: v })}
            onAccent={(id) => onTheme({ accent: id })}
            onLang={(l) => onTheme({ lang: l })}
          />
        </div>
      )}
    </div>
  );
}
