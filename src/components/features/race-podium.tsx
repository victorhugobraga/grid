import type { CSSProperties } from "react";
import type { F1RaceResult } from "@/types/f1";
import type { Copy } from "@/lib/copy";
import { getF1Color } from "@/lib/team-colors";
import { MetaLabel } from "@/components/ui/meta-label";

function pickFg(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#fff";
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.62 ? "#1a1612" : "#fafafa";
}

interface RacePodiumProps {
  result: F1RaceResult | null;
  copy: Copy;
}

export function RacePodium({ result, copy }: RacePodiumProps) {
  if (!result || result.results.length < 3) {
    return (
      <div
        style={{
          height: 196,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MetaLabel>{copy.noData}</MetaLabel>
      </div>
    );
  }

  const [first, second, third] = result.results;

  const gpName = result.raceName
    .replace(/\s*Grand Prix$/i, "")
    .replace(/\s*GP$/i, "");

  const bar = (
    driver: (typeof result.results)[number],
    height: number,
    idx: number,
  ) => {
    const accent = getF1Color(driver.constructor);
    const isFirst = idx === 0;
    return (
      <div
        key={driver.driverCode}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight:
                "var(--display-weight, 350)" as CSSProperties["fontWeight"],
              fontSize: isFirst ? 32 : 22,
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            {driver.driverCode}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
              letterSpacing: "0.06em",
            }}
          >
            {driver.constructor}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height,
            background: isFirst
              ? "var(--accent)"
              : "var(--border-strong, rgba(244,244,240,0.20))",
            opacity: isFirst ? 1 : 0.4 + (3 - idx) * 0.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: isFirst ? 56 : 38,
            fontWeight:
              "var(--display-weight, 350)" as CSSProperties["fontWeight"],
            color: isFirst ? pickFg(accent) : "var(--fg)",
          }}
        >
          {parseInt(driver.position)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <MetaLabel>
        {copy.lastResult} · {gpName}
      </MetaLabel>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: 180,
          marginTop: 16,
        }}
      >
        {bar(second, 100, 1)}
        {bar(first, 140, 0)}
        {bar(third, 70, 2)}
      </div>
    </div>
  );
}
