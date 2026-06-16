"use client";

import type { Theme } from "@/hooks/use-theme";
import type { Copy } from "@/lib/copy";
import { getCopy } from "@/lib/copy";
import {
  useFootballToday,
  useFootballLive,
  useFootballStandings,
  useFlamengoSchedule,
  useLiveState,
} from "@/hooks/use-live-data";
import { DetailHeader } from "@/components/features/detail-header";
import { Card } from "@/components/ui/card";
import { MetaLabel } from "@/components/ui/meta-label";
import { FootballStandingsTable } from "@/components/features/football-standings-table";
import { MatchCard } from "@/components/features/match-card";

interface DetailFootballProps {
  theme: Theme;
  onTheme: (patch: Partial<Theme>) => void;
  onNav: (section: "f1" | "football") => void;
}

export function DetailFootball({ theme, onTheme, onNav }: DetailFootballProps) {
  const copy: Copy = getCopy(theme.lang);
  const today = useFootballToday();
  const live = useFootballLive();
  const brasileirao = useFootballStandings("brasileirao");
  const champions = useFootballStandings("champions");
  const flamengo = useFlamengoSchedule();
  const { state: liveState } = useLiveState();

  const isLive = liveState === "live" && live.length > 0;
  const heroMatch = isLive ? live[0] : today[0];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: "var(--font-sans)",
        transition: "background .3s, color .3s",
      }}
    >
      <DetailHeader
        active="football"
        copy={copy}
        onNav={onNav}
        theme={theme}
        onTheme={onTheme}
      />

      <div
        style={{
          padding: "32px 40px 60px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Hero match */}
        {heroMatch ? (
          <MatchCard match={heroMatch} copy={copy} big />
        ) : (
          <Card>
            <MetaLabel>{copy.noData}</MetaLabel>
          </Card>
        )}

        {/* Two-column body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          {/* Left — today's matches + Flamengo upcoming */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card title={copy.todayMatches} subtitle="hoje">
              {today.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {today.map((m) => (
                    <MatchCard key={m.id} match={m} copy={copy} />
                  ))}
                </div>
              ) : (
                <MetaLabel>{copy.noData}</MetaLabel>
              )}
            </Card>

            <Card title="Flamengo" subtitle={copy.nextMatches}>
              {flamengo.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {flamengo.map((m) => (
                    <MatchCard key={m.id} match={m} copy={copy} />
                  ))}
                </div>
              ) : (
                <MetaLabel>{copy.noData}</MetaLabel>
              )}
            </Card>
          </div>

          {/* Right — standings */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card
              title="Brasileirão"
              subtitle={copy.standings}
              accent={String(new Date().getFullYear())}
            >
              {brasileirao.length > 0 ? (
                <FootballStandingsTable standings={brasileirao} copy={copy} />
              ) : (
                <MetaLabel>{copy.noData}</MetaLabel>
              )}
            </Card>

            <Card
              title="Champions League"
              subtitle={copy.standings}
              accent={String(new Date().getFullYear())}
            >
              {champions.length > 0 ? (
                <FootballStandingsTable standings={champions} copy={copy} />
              ) : (
                <MetaLabel>{copy.noData}</MetaLabel>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
