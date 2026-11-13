"use client";

import { useSyncExternalStore } from "react";

const COPY = {
  pt: {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    weekdays: [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ],
    months: [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ],
  },
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
} as const;

function buildGreeting(lang: "pt" | "en"): string {
  const c = COPY[lang];
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return c.morning;
  if (h >= 12 && h < 18) return c.afternoon;
  return c.evening;
}

function formatDate(lang: "pt" | "en"): string {
  const c = COPY[lang];
  const d = new Date();
  const wd = c.weekdays[d.getDay()];
  const day = d.getDate();
  const month = c.months[d.getMonth()];
  if (lang === "en") {
    return `${wd.charAt(0).toUpperCase() + wd.slice(1)}, ${month} ${day}`;
  }
  return `${wd}, ${day} de ${month}`;
}

interface GreetingProps {
  lang: "pt" | "en";
  name: string;
  layout?: "center" | "left" | "italic";
}

const noopSubscribe = () => () => {};

export function Greeting({ lang, name, layout = "center" }: GreetingProps) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const greeting = mounted ? buildGreeting(lang) : "";
  const dateStr = mounted ? formatDate(lang) : "";
  const isCenter = layout === "center";
  const isItalic = layout === "italic";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isCenter ? "center" : "flex-start",
        textAlign: isCenter ? "center" : "left",
        gap: 18,
        animation: "gridFadeIn 700ms ease-out",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: "var(--display-weight, 350)" as unknown as number,
          fontVariationSettings: "var(--display-settings, normal)",
          fontStyle: isItalic ? "italic" : "normal",
          fontSize: 76,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "var(--fg)",
          textShadow: "0 2px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)",
        }}
      >
        {name.trim() ? `${greeting}, ${name.trim()}` : greeting}
        <span style={{ color: "var(--accent)" }}>.</span>
      </h1>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          textShadow: "0 1px 12px rgba(0,0,0,0.3)",
        }}
      >
        {dateStr}
      </div>
    </div>
  );
}
