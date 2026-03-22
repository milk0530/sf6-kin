export default function MovePage({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* クラシック */}
      <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "#2a2a3e", color: "#888", fontWeight: 700 }}>
            🕹️ クラシック
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.85 }}>{data.classic.playstyle}</p>
      </div>

      {/* モダン */}
      <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "#2a2a3e", color: "#888", fontWeight: 700 }}>
            ⚡ モダン
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.85 }}>{data.modern.playstyle}</p>
      </div>
    </div>
  );
}
