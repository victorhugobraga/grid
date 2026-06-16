import type { FootballMatch } from "@/types/football";

interface FootballFooterSlotProps {
  matches: FootballMatch[];
  liveMatches: FootballMatch[];
  lang: "pt" | "en";
}

export function FootballFooterSlot({
  matches,
  liveMatches,
  lang,
}: FootballFooterSlotProps) {
  const liveLabel = lang === "pt" ? "Ao vivo" : "Live";

  const liveMatch =
    liveMatches.find(
      (m) =>
        (m.home.name.toLowerCase().includes("flamengo") ||
          m.away.name.toLowerCase().includes("flamengo")) &&
        (m.status.short === "LIVE" || m.status.short === "HT"),
    ) ??
    liveMatches[0] ??
    null;

  const nextMatch =
    matches.find((m) => m.status.short === "NS") ?? matches[0] ?? null;

  if (liveMatch) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LivePulse />
          <MetaLabel color="#EF4444">
            {liveLabel} · {liveMatch.league.name}
          </MetaLabel>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            color: "var(--fg)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: "var(--display-weight, 350)" as unknown as number,
              fontSize: 22,
              lineHeight: 1.1,
            }}
          >
            {liveMatch.home.name}{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontStyle: "normal",
                fontSize: 20,
              }}
            >
              {liveMatch.home.goals ?? 0} – {liveMatch.away.goals ?? 0}
            </span>{" "}
            {liveMatch.away.name}
          </span>
        </div>
        {liveMatch.status.elapsed !== undefined && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {liveMatch.status.elapsed}&apos;
          </span>
        )}
      </div>
    );
  }

  if (!nextMatch) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-end",
        }}
      >
        <MetaLabel>Flamengo</MetaLabel>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "var(--display-weight, 350)" as unknown as number,
            fontSize: 22,
            color: "var(--fg-muted)",
          }}
        >
          —
        </span>
      </div>
    );
  }

  const matchDate = new Date(nextMatch.date);
  const today = new Date();
  const isToday =
    matchDate.getFullYear() === today.getFullYear() &&
    matchDate.getMonth() === today.getMonth() &&
    matchDate.getDate() === today.getDate();

  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const matchTime = matchDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const matchDateLabel = isToday
    ? matchTime
    : matchDate.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
      }) +
      " · " +
      matchTime;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "flex-end",
      }}
    >
      <MetaLabel>Flamengo</MetaLabel>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          color: "var(--fg)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "var(--display-weight, 350)" as unknown as number,
            fontSize: 22,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {nextMatch.home.name}{" "}
          <span style={{ color: "var(--fg-faint)", fontStyle: "italic" }}>
            ×
          </span>{" "}
          {nextMatch.away.name}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-muted)",
          letterSpacing: "0.04em",
        }}
      >
        {matchDateLabel} · {nextMatch.league.name}
      </span>
    </div>
  );
}

function LivePulse() {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: 8,
        height: 8,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#EF4444",
          animation: "gridLivePulse 1.6s ease-out infinite",
          opacity: 0.55,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#EF4444",
        }}
      />
    </span>
  );
}

function MetaLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: color ?? "var(--fg-faint)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
