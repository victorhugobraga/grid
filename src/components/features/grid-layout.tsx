"use client";

import Link from "next/link";
import { BACKGROUNDS, getDailyBackground } from "@/lib/backgrounds";
import { useTheme } from "@/hooks/use-theme";
import {
  useF1Schedule,
  useFlamengoSchedule,
  useFootballLive,
  useLiveState,
} from "@/hooks/use-live-data";
import { useClock } from "@/hooks/use-clock";
import { Greeting } from "./greeting";
import { ThemePopover } from "./theme-popover";
import { FavoritesBar } from "./favorites-bar";
import { F1FooterSlot } from "./f1-footer-slot";
import { FootballFooterSlot } from "./football-footer-slot";

const dailyBg = getDailyBackground();

export function GridLayout() {
  const { theme, setTheme } = useTheme();
  const { nextRace } = useF1Schedule();
  const footballMatches = useFlamengoSchedule();
  const footballLive = useFootballLive();
  const { state: liveState } = useLiveState();
  const time = useClock();
  const bg = BACKGROUNDS.find((b) => b.id === theme.bg) ?? dailyBg;

  const glass = {
    backdropFilter: "blur(28px) saturate(160%)",
    WebkitBackdropFilter: "blur(28px) saturate(160%)",
    background: "var(--glass)",
    border: "1px solid var(--border)",
  } as React.CSSProperties;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        background: "var(--bg)",
        color: "var(--fg)",
        transition: "background .3s",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.92)",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--overlay)",
          backdropFilter: "brightness(0.95)",
        }}
      />

      {/* Top status bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "14px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "var(--accent)" }}>▸</span>
          <span>
            {time} · GRID · {liveState.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <span>brl/utc-3</span>
          <span style={{ color: "var(--fg)" }}>são paulo</span>
          <div style={{ pointerEvents: "auto" }}>
            <ThemePopover
              dark={theme.dark}
              accent={theme.accent}
              lang={theme.lang}
              name={theme.name}
              onName={(n) => setTheme({ name: n })}
              bg={theme.bg}
              onBg={(id) => setTheme({ bg: id })}
              onDark={(v) => setTheme({ dark: v })}
              onAccent={(id) => setTheme({ accent: id })}
              onLang={(l) => setTheme({ lang: l })}
              favorites={theme.favorites}
              onFavorites={(f) => setTheme({ favorites: f })}
            />
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "80%",
          zIndex: 5,
        }}
      >
        <FavoritesBar favorites={theme.favorites} />
      </div>

      {/* Centered greeting — 38% from top */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Greeting lang={theme.lang} name={theme.name} layout="center" />
      </div>

      {/* Glass footer */}
      <div
        style={{
          ...glass,
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 28,
          padding: "20px 28px",
          borderRadius: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          alignItems: "center",
          gap: 32,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 60px rgba(0,0,0,0.18)",
          transition: "background .3s, border-color .3s",
        }}
      >
        <F1FooterSlot race={nextRace} lang={theme.lang} />

        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 32 }}>
          <FootballFooterSlot
            matches={footballMatches}
            liveMatches={footballLive}
            lang={theme.lang}
          />
        </div>

        <Link
          href="/f1"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--fg)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 4px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {theme.lang === "pt" ? "Ver tudo" : "See all"}
          <span style={{ color: "var(--accent)" }}>→</span>
        </Link>
      </div>
    </div>
  );
}
