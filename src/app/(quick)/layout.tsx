export default function QuickLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {children}
    </div>
  );
}
