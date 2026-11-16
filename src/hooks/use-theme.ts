"use client";

import { useState, useEffect, useCallback } from "react";
import type { Favorite } from "@/lib/favorites";

export const ACCENTS = [
  { id: "red" as const, hex: "#E8002D", name: "Vermelho" },
  { id: "emerald" as const, hex: "#10B981", name: "Esmeralda" },
  { id: "cobalt" as const, hex: "#3B82F6", name: "Cobalto" },
  { id: "amber" as const, hex: "#F59E0B", name: "Âmbar" },
  { id: "violet" as const, hex: "#8B5CF6", name: "Violeta" },
];

export type AccentId = (typeof ACCENTS)[number]["id"];

const FONT_PAIRS = {
  fraunces: {
    display: '"Fraunces", Georgia, serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Inter Tight", system-ui, sans-serif',
    displayWeight: 350,
    displaySettings: '"opsz" 144, "SOFT" 50',
  },
  instrument: {
    display: '"Instrument Serif", "Times New Roman", serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    sans: '"Inter Tight", system-ui, sans-serif',
    displayWeight: 400,
    displaySettings: "normal",
  },
  newsreader: {
    display: '"Newsreader", Georgia, serif',
    mono: '"Space Grotesk", ui-monospace, monospace',
    sans: '"Space Grotesk", system-ui, sans-serif',
    displayWeight: 300,
    displaySettings: '"opsz" 60',
  },
} as const;

export type FontPairId = keyof typeof FONT_PAIRS;

export interface Theme {
  dark: boolean;
  accent: AccentId;
  lang: "pt" | "en";
  fontPair: FontPairId;
  name: string;
  /** Background id; empty string = daily rotation. */
  bg: string;
  favorites: Favorite[];
}

const DEFAULT_THEME: Theme = {
  dark: true,
  accent: "red",
  lang: "pt",
  fontPair: "fraunces",
  name: "",
  bg: "",
  favorites: [],
};

const STORAGE_KEY = "grid:theme";

function readSavedTheme(): Partial<Theme> | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Partial<Theme>) : null;
  } catch {
    return null;
  }
}

function applyVars(theme: Theme) {
  const el = document.documentElement;
  const accent = ACCENTS.find((a) => a.id === theme.accent) ?? ACCENTS[0];
  const pair = FONT_PAIRS[theme.fontPair] ?? FONT_PAIRS.fraunces;

  el.style.setProperty("--accent", accent.hex);
  el.style.setProperty("--font-display", pair.display);
  el.style.setProperty("--font-mono", pair.mono);
  el.style.setProperty("--font-sans", pair.sans);
  el.style.setProperty("--display-weight", String(pair.displayWeight));
  el.style.setProperty("--display-settings", pair.displaySettings);

  if (theme.dark) {
    el.style.setProperty("--bg", "#0a0a0c");
    el.style.setProperty("--bg-elev", "#131316");
    el.style.setProperty("--fg", "#f4f4f0");
    el.style.setProperty("--fg-muted", "rgba(244,244,240,0.62)");
    el.style.setProperty("--fg-faint", "rgba(244,244,240,0.36)");
    el.style.setProperty("--border", "rgba(244,244,240,0.10)");
    el.style.setProperty("--overlay", "rgba(8,8,10,0.55)");
    el.style.setProperty("--glass", "rgba(20,20,24,0.42)");
  } else {
    el.style.setProperty("--bg", "#f7f5f0");
    el.style.setProperty("--bg-elev", "#ffffff");
    el.style.setProperty("--fg", "#1a1612");
    el.style.setProperty("--fg-muted", "rgba(26,22,18,0.62)");
    el.style.setProperty("--fg-faint", "rgba(26,22,18,0.36)");
    el.style.setProperty("--border", "rgba(26,22,18,0.10)");
    el.style.setProperty("--overlay", "rgba(255,253,248,0.40)");
    el.style.setProperty("--glass", "rgba(255,253,248,0.55)");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = readSavedTheme();
    return saved ? { ...DEFAULT_THEME, ...saved } : DEFAULT_THEME;
  });

  useEffect(() => {
    applyVars(theme);
  }, [theme]);

  const setTheme = useCallback((patch: Partial<Theme>) => {
    setThemeState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — continue without persistence
      }
      return next;
    });
  }, []);

  return { theme, setTheme };
}
