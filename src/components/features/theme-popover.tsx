"use client";

import { useState, useRef, useEffect } from "react";
import { ACCENTS, type AccentId } from "@/hooks/use-theme";

interface ThemePopoverProps {
  dark: boolean;
  accent: AccentId;
  lang: "pt" | "en";
  onDark: (v: boolean) => void;
  onAccent: (id: AccentId) => void;
  onLang: (l: "pt" | "en") => void;
}

export function ThemePopover({
  dark,
  accent,
  lang,
  onDark,
  onAccent,
  onLang,
}: ThemePopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentAccent = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, [open]);

  const glass = {
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    border: "1px solid var(--border)",
    background: "var(--glass)",
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      style={{ position: "absolute", top: 24, right: 24, zIndex: 20 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Opções de tema"
        style={{
          ...glass,
          borderRadius: 999,
          height: 34,
          padding: "0 14px 0 10px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          color: "var(--fg)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          transition: "border-color .15s",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: currentAccent.hex,
            flexShrink: 0,
          }}
        />
        Tema
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M2 3.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            ...glass,
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            borderRadius: 14,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 200,
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06) inset",
            animation: "gridFadeIn 160ms ease-out",
          }}
        >
          <PopoverSection label="Modo">
            <div style={{ display: "flex", gap: 6 }}>
              {(
                [
                  { val: false, label: "Claro" },
                  { val: true, label: "Escuro" },
                ] as const
              ).map((opt) => (
                <PopoverButton
                  key={String(opt.val)}
                  selected={dark === opt.val}
                  onClick={() => onDark(opt.val)}
                >
                  {opt.label}
                </PopoverButton>
              ))}
            </div>
          </PopoverSection>

          <PopoverSection label="Cor de acento">
            <div style={{ display: "flex", gap: 8 }}>
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onAccent(a.id)}
                  aria-label={a.name}
                  title={a.name}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: a.hex,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    outline: a.id === accent ? `2px solid ${a.hex}` : "none",
                    outlineOffset: 3,
                    transition: "outline-offset .15s, transform .15s",
                    transform: a.id === accent ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </PopoverSection>

          <PopoverSection label="Idioma">
            <div style={{ display: "flex", gap: 6 }}>
              {(
                [
                  { val: "pt" as const, label: "Português" },
                  { val: "en" as const, label: "English" },
                ] as const
              ).map((opt) => (
                <PopoverButton
                  key={opt.val}
                  selected={lang === opt.val}
                  onClick={() => onLang(opt.val)}
                >
                  {opt.label}
                </PopoverButton>
              ))}
            </div>
          </PopoverSection>
        </div>
      )}
    </div>
  );
}

function PopoverSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-faint)",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function PopoverButton({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 10px",
        borderRadius: 8,
        cursor: "pointer",
        background: selected ? "var(--bg-elev)" : "transparent",
        border: selected
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        color: selected ? "var(--fg)" : "var(--fg-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        transition: "background .15s, border-color .15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
