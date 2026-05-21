"use client";

import { useState } from "react";
import type { FootballMatch } from "@/types/football";
import type { Copy } from "@/lib/copy";
import { getFootballInfo } from "@/lib/team-colors";
import { TeamMark } from "@/components/ui/team-mark";
import { LivePulse } from "@/components/ui/live-pulse";
import { MetaLabel } from "@/components/ui/meta-label";

interface MatchCardProps {
  match: FootballMatch;
  copy: Copy;
  big?: boolean;
}

export function MatchCard({ match, copy, big = false }: MatchCardProps) {
  const [hovered, setHovered] = useState(false);

  const isLive = match.status.short === "LIVE" || match.status.short === "HT";
  const homeInfo = getFootballInfo(match.home.name);
  const awayInfo = getFootballInfo(match.away.name);

  const time = new Date(match.date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  const stage = match.league.round ?? "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 10,
        padding: big ? "16px 20px" : "12px 14px",
        background: "var(--bg-elev)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color .2s, transform .2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MetaLabel>
          {match.league.name}
          {stage ? ` · ${stage}` : ""}
        </MetaLabel>
        {isLive ? (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LivePulse size={6} color="#EF4444" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#EF4444",
                letterSpacing: "0.06em",
              }}
            >
              {match.status.elapsed != null
                ? `${match.status.elapsed}'`
                : copy.live}
            </span>
          </span>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {time}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TeamMark
            short={homeInfo.short}
            accent={homeInfo.accent}
            size={big ? 36 : 28}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight:
                "var(--display-weight, 350)" as React.CSSProperties["fontWeight"],
              fontSize: big ? 22 : 17,
              color: "var(--fg)",
            }}
          >
            {match.home.name}
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight:
              "var(--display-weight, 350)" as React.CSSProperties["fontWeight"],
            fontSize: big ? 32 : 22,
            color: "var(--fg)",
            fontVariantNumeric: "tabular-nums",
            minWidth: 60,
            textAlign: "center",
          }}
        >
          {isLive ? (
            `${match.home.goals ?? 0} – ${match.away.goals ?? 0}`
          ) : (
            <span style={{ color: "var(--fg-faint)", fontStyle: "italic" }}>
              ×
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight:
                "var(--display-weight, 350)" as React.CSSProperties["fontWeight"],
              fontSize: big ? 22 : 17,
              color: "var(--fg)",
            }}
          >
            {match.away.name}
          </span>
          <TeamMark
            short={awayInfo.short}
            accent={awayInfo.accent}
            size={big ? 36 : 28}
          />
        </div>
      </div>
    </div>
  );
}
