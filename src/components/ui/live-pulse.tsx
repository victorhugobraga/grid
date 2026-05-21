interface LivePulseProps {
  size?: number;
  color?: string;
}

export function LivePulse({ size = 8, color = "#EF4444" }: LivePulseProps) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          animation: "gridLivePulse 1.6s ease-out infinite",
          opacity: 0.55,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
}
