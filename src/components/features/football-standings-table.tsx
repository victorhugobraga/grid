import type { FootballStanding } from "@/types/football";
import type { Copy } from "@/lib/copy";
import { getFootballInfo } from "@/lib/team-colors";
import { TeamMark } from "@/components/ui/team-mark";

const th: React.CSSProperties = {
  padding: "8px 6px",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 500,
};

const td: React.CSSProperties = {
  padding: "10px 6px",
  fontSize: 12.5,
};

interface FootballStandingsTableProps {
  standings: FootballStanding[];
  copy: Copy;
}

export function FootballStandingsTable({
  standings,
  copy,
}: FootballStandingsTableProps) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--fg)",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr style={{ color: "var(--fg-faint)", textAlign: "left" }}>
          <th style={{ ...th, width: 32 }}>{copy.pos}</th>
          <th style={th}>{copy.team}</th>
          <th style={{ ...th, textAlign: "right", width: 36 }}>{copy.j}</th>
          <th style={{ ...th, textAlign: "right", width: 36 }}>{copy.sg}</th>
          <th style={{ ...th, textAlign: "right", width: 40 }}>{copy.pts}</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s) => {
          const info = getFootballInfo(s.team.name);
          return (
            <tr
              key={s.team.id}
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <td style={td}>
                <span style={{ color: "var(--fg-faint)" }}>
                  {String(s.rank).padStart(2, "0")}
                </span>
              </td>
              <td style={td}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TeamMark short={info.short} accent={info.accent} size={18} />
                  {s.team.name}
                </span>
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--fg-muted)",
                }}
              >
                {s.played}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color:
                    s.goalsDiff > 0
                      ? "var(--accent)"
                      : s.goalsDiff < 0
                        ? "#EF4444"
                        : "var(--fg-muted)",
                }}
              >
                {s.goalsDiff > 0 ? `+${s.goalsDiff}` : s.goalsDiff}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                }}
              >
                {s.points}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
