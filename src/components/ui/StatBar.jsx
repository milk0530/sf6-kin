export default function StatBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color }}>{typeof value === "number" ? value.toLocaleString() : value}</span>
      </div>
      <div style={{ height: 5, background: "#1e1e2e", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, borderRadius: 3 }} />
      </div>
    </div>
  );
}
