"use client";

import { useState, useRef, useEffect } from "react";
import { ACCENTS, type AccentId } from "@/hooks/use-theme";
import { BACKGROUNDS } from "@/lib/backgrounds";
import { normalizeUrl, type Favorite } from "@/lib/favorites";

interface ThemePopoverProps {
  dark: boolean;
  accent: AccentId;
  lang: "pt" | "en";
  name: string;
  onName: (n: string) => void;
  bg: string;
  onBg: (id: string) => void;
  onDark: (v: boolean) => void;
  onAccent: (id: AccentId) => void;
  onLang: (l: "pt" | "en") => void;
  favorites: Favorite[];
  onFavorites: (f: Favorite[]) => void;
}

export function ThemePopover({
  dark,
  accent,
  lang,
  name,
  onName,
  bg,
  onBg,
  onDark,
  onAccent,
  onLang,
  favorites,
  onFavorites,
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
    <div ref={ref} style={{ position: "relative", zIndex: 20 }}>
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
          <PopoverSection label="Nome">
            <input
              type="text"
              value={name}
              maxLength={30}
              onChange={(e) => onName(e.target.value)}
              placeholder="Seu nome"
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                outline: "none",
              }}
            />
          </PopoverSection>

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

          <PopoverSection label="Fundo">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <PopoverButton selected={bg === ""} onClick={() => onBg("")}>
                Auto
              </PopoverButton>
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onBg(b.id)}
                  aria-label={b.label}
                  title={b.label}
                  style={{
                    width: 36,
                    height: 26,
                    borderRadius: 6,
                    padding: 0,
                    cursor: "pointer",
                    backgroundImage: `url(${b.url.replace("w=2400", "w=120")})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border:
                      bg === b.id
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    outline: bg === b.id ? "1px solid var(--accent)" : "none",
                    outlineOffset: 2,
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

          <PopoverSection label={lang === "pt" ? "Favoritos" : "Favorites"}>
            <FavoritesEditor
              lang={lang}
              favorites={favorites}
              onChange={onFavorites}
            />
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

function FavoritesEditor({
  lang,
  favorites,
  onChange,
}: {
  lang: "pt" | "en";
  favorites: Favorite[];
  onChange: (f: Favorite[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pt = lang === "pt";

  const input: React.CSSProperties = {
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--fg)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const add = () => {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError(pt ? "URL inválida" : "Invalid URL");
      return;
    }
    const label =
      name.trim() || new URL(normalized).hostname.replace(/^www\./, "");
    onChange([
      ...favorites,
      { id: `${Date.now()}-${favorites.length}`, name: label, url: normalized },
    ]);
    setName("");
    setUrl("");
    setError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <PopoverButton selected={open} onClick={() => setOpen((v) => !v)}>
        {pt ? "Favoritos" : "Favorites"} ({favorites.length})
      </PopoverButton>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {favorites.map((f) => (
            <div
              key={f.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--fg-muted)",
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {f.name}
              </span>
              <button
                onClick={() => onChange(favorites.filter((x) => x.id !== f.id))}
                aria-label={pt ? `Remover ${f.name}` : `Remove ${f.name}`}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--fg-faint)",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}

          <input
            style={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={pt ? "Nome" : "Name"}
            aria-label={pt ? "Nome do site" : "Site name"}
          />
          <input
            style={input}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="https://..."
            aria-label="URL"
          />
          {error && (
            <span style={{ fontSize: 10.5, color: "var(--accent)" }}>
              {error}
            </span>
          )}
          <PopoverButton selected={false} onClick={add}>
            {pt ? "Adicionar" : "Add"}
          </PopoverButton>
        </div>
      )}
    </div>
  );
}
