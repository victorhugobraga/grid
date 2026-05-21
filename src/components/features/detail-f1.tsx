"use client";

import type { CSSProperties } from "react";
import type { Theme } from "@/hooks/use-theme";
import type { Copy } from "@/lib/copy";
import { getCopy } from "@/lib/copy";
import {
  useF1Schedule,
  useF1Standings,
  useF1LastResult,
  useLiveState,
} from "@/hooks/use-live-data";
import { ThemePopover } from "@/components/features/theme-popover";
import { DetailHeader } from "@/components/features/detail-header";
import { Card } from "@/components/ui/card";
import { MetaLabel } from "@/components/ui/meta-label";
import { LivePulse } from "@/components/ui/live-pulse";
import { LapBar } from "@/components/ui/lap-bar";
import { F1StandingsTable } from "@/components/features/f1-standings-table";
import { RacePodium } from "@/components/features/race-podium";

interface DetailF1Props {
  theme: Theme;
  onTheme: (patch: Partial<Theme>) => void;
  onNav: (section: "f1" | "football") => void;
}

function formatRaceDate(dateStr: string, lang: "pt" | "en") {
  const d = new Date(dateStr + "T00:00:00");
  const months =
    lang === "pt"
      ? [
          "jan",
          "fev",
          "mar",
          "abr",
          "mai",
          "jun",
          "jul",
          "ago",
          "set",
          "out",
          "nov",
          "dez",
        ]
      : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
  return {
    day: d.getDate(),
    monthShort: months[d.getMonth()],
  };
}

function stripGP(name: string) {
  return name
    .replace(/\s*Grand Prix$/i, "")
    .replace(/\s*GP$/i, "")
    .trim();
}

export function DetailF1({ theme, onTheme, onNav }: DetailF1Props) {
  const copy: Copy = getCopy(theme.lang);
  const { nextRace, schedule } = useF1Schedule();
  const standings = useF1Standings();
  const lastResult = useF1LastResult();
  const { state: liveState } = useLiveState();

  const isLive = liveState === "live";

  const today = new Date().toISOString().split("T")[0];
  const upcoming = schedule.filter((r) => r.date >= today).slice(0, 3);

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
      <DetailHeader active="f1" copy={copy} onNav={onNav} />

      <ThemePopover
        dark={theme.dark}
        accent={theme.accent}
        lang={theme.lang}
        onDark={(v) => onTheme({ dark: v })}
        onAccent={(id) => onTheme({ accent: id })}
        onLang={(l) => onTheme({ lang: l })}
      />

      <div
        style={{
          padding: "32px 40px 60px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Hero */}
        {isLive ? (
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <LivePulse color="#EF4444" />
              <MetaLabel color="#EF4444">{copy.live}</MetaLabel>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight:
                  "var(--display-weight, 350)" as CSSProperties["fontWeight"],
                fontSize: 48,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "var(--fg)",
              }}
            >
              {copy.live.toUpperCase()}
            </div>
            <LapBar lap={0} total={1} color="var(--accent)" />
          </Card>
        ) : nextRace ? (
          <Card
            title={`${stripGP(nextRace.raceName)} GP`}
            subtitle={copy.nextRace}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 32,
                alignItems: "baseline",
              }}
            >
              <div>
                <MetaLabel>{copy.circuit}</MetaLabel>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight:
                      "var(--display-weight, 350)" as CSSProperties["fontWeight"],
                    fontSize: 22,
                    marginTop: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {nextRace.circuit.name}
                </div>
              </div>
              <div>
                <MetaLabel>{copy.date}</MetaLabel>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight:
                      "var(--display-weight, 350)" as CSSProperties["fontWeight"],
                    fontSize: 22,
                    marginTop: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {(() => {
                    const { day, monthShort } = formatRaceDate(
                      nextRace.date,
                      theme.lang,
                    );
                    const time = nextRace.time?.slice(0, 5) ?? "—";
                    return `${day} ${monthShort} · ${time}`;
                  })()}
                </div>
              </div>
              <div>
                <MetaLabel>{copy.round}</MetaLabel>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 22,
                    marginTop: 6,
                  }}
                >
                  R{String(parseInt(nextRace.round)).padStart(2, "0")} / 24
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <MetaLabel>{copy.noData}</MetaLabel>
          </Card>
        )}

        {/* Two-column body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          {/* Left — standings */}
          <Card
            title={copy.drivers}
            subtitle={copy.standings}
            accent={String(new Date().getFullYear())}
          >
            {standings.length > 0 ? (
              <F1StandingsTable standings={standings} copy={copy} />
            ) : (
              <MetaLabel>{copy.noData}</MetaLabel>
            )}
          </Card>

          {/* Right — podium + upcoming */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card>
              <RacePodium result={lastResult} copy={copy} />
            </Card>

            <Card
              title={copy.upcoming}
              subtitle={
                upcoming.length >= 2
                  ? `r${String(parseInt(upcoming[0].round)).padStart(2, "0")} → r${String(parseInt(upcoming[upcoming.length - 1].round)).padStart(2, "0")}`
                  : undefined
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {upcoming.map((r, i) => {
                  const { day, monthShort } = formatRaceDate(
                    r.date,
                    theme.lang,
                  );
                  const time = r.time?.slice(0, 5) ?? "—";
                  return (
                    <div
                      key={r.round}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "36px 1fr auto",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderTop: i === 0 ? "none" : "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--fg-faint)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        R{String(parseInt(r.round)).padStart(2, "0")}
                      </span>
                      <span>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight:
                              "var(--display-weight, 350)" as CSSProperties["fontWeight"],
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {stripGP(r.raceName)}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10.5,
                            color: "var(--fg-muted)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {r.circuit.name}
                        </div>
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11.5,
                          color: "var(--fg)",
                          letterSpacing: "0.04em",
                          textAlign: "right",
                          lineHeight: 1.6,
                        }}
                      >
                        {day} {monthShort}
                        <br />
                        <span style={{ color: "var(--fg-faint)" }}>{time}</span>
                      </span>
                    </div>
                  );
                })}
                {upcoming.length === 0 && <MetaLabel>{copy.noData}</MetaLabel>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
