interface LapBarProps {
  lap: number;
  total: number;
  color?: string;
}

export function LapBar({ lap, total, color }: LapBarProps) {
  const pct = Math.min(100, Math.max(0, (lap / total) * 100));
  return (
    <div
      style={{
        width: "100%",
        height: 2,
        background: "rgba(255,255,255,0.12)",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: pct + "%",
          height: "100%",
          background: color ?? "var(--accent)",
          transition: "width .4s ease",
        }}
      />
    </div>
  );
}
