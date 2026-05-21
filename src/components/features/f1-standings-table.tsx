import type { F1Standing } from "@/types/f1";
import type { Copy } from "@/lib/copy";
import { getF1Color } from "@/lib/team-colors";

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

interface F1StandingsTableProps {
  standings: F1Standing[];
  copy: Copy;
}

export function F1StandingsTable({ standings, copy }: F1StandingsTableProps) {
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
          <th style={th}>{copy.pos}</th>
          <th style={{ ...th, width: "50%" }}>{copy.driver}</th>
          <th style={th}>{copy.team}</th>
          <th style={{ ...th, textAlign: "right" }}>{copy.pts}</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s) => (
          <tr
            key={s.driver.driverId}
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <td style={td}>
              <span
                style={{
                  color: "var(--fg-faint)",
                  display: "inline-block",
                  width: 18,
                }}
              >
                {String(parseInt(s.position)).padStart(2, "0")}
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
                <span
                  style={{
                    width: 3,
                    height: 14,
                    background: getF1Color(s.driver.constructor),
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
                {s.driver.familyName}
              </span>
            </td>
            <td style={{ ...td, color: "var(--fg-muted)" }}>
              {s.driver.constructor}
            </td>
            <td
              style={{
                ...td,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
                fontWeight: 600,
              }}
            >
              {s.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
