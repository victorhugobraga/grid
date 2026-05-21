import type { F1Race } from "@/types/f1";

const MONTHS_SHORT: Record<"pt" | "en", string[]> = {
  pt: [
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
  ],
  en: [
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
  ],
};

const WEEKDAYS: Record<"pt" | "en", string[]> = {
  pt: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

interface F1FooterSlotProps {
  race: F1Race | null;
  lang: "pt" | "en";
}

export function F1FooterSlot({ race, lang }: F1FooterSlotProps) {
  const label = lang === "pt" ? "Próxima corrida" : "Next race";

  if (!race) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <MetaLabel>{label}</MetaLabel>
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

  // Race dates come as UTC YYYY-MM-DD; parse as UTC to avoid timezone shifts
  const raceDate = new Date(race.date + "T12:00:00Z");
  const monthsShort = MONTHS_SHORT[lang];
  const weekdays = WEEKDAYS[lang];
  const weekday = weekdays[raceDate.getUTCDay()];
  const day = raceDate.getUTCDate();
  const month = monthsShort[raceDate.getUTCMonth()];

  // Strip "Grand Prix" / "Grand Prix de" suffixes for compact display
  const gpName = race.raceName
    .replace(/ Grand Prix.*/i, "")
    .replace(/ Grande Prêmio.*/i, "")
    .trim();

  const timeStr = race.time ? race.time.substring(0, 5) : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <MetaLabel>{label}</MetaLabel>
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
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {gpName}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {weekday} · {day} {month}
          {timeStr ? ` · ${timeStr}` : ""}
        </span>
      </div>
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--fg-faint)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
