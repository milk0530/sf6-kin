const S = {
  card:   { background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 12 },
  label:  { fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 },
};

export default function TopPage({ data, char }) {
  return (
    <div>
      {/* 概要 */}
      <div style={{ ...S.card, padding: 20, marginBottom: 14 }}>
        <h2 style={{ ...S.label, color: "#fff", marginBottom: 10 }}>キャラクター概要</h2>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.85 }}>{data.overview}</p>
      </div>

      {/* 基本ステータス */}
      <div style={{ ...S.card, padding: 18, marginBottom: 14 }}>
        <h3 style={{ ...S.label, color: "#fff" }}>基本ステータス</h3>

        {/* 体力 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: "#555" }}>体力</span>
          <span style={{ fontSize: 36, fontWeight: 900, color: char.color, letterSpacing: 2 }}>
            {data.hp.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, color: "#555" }}>HP</span>
        </div>

        {/* その他ステータス */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {data.stats.map(s => (
            <div key={s.label} style={{
              background: "#0e0e16", border: "1px solid #2a2a3e",
              borderRadius: 8, padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 11, color: "#555" }}>{s.label}</span>
              <span style={{
                fontSize: 14, fontWeight: 700,
                color: s.value === "無" ? "#e74c3c" : s.value === "有" ? "#27ae60" : char.color,
              }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 強み・弱み */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ ...S.card, padding: 18 }}>
          <h3 style={{ ...S.label, color: "#27ae60" }}>▲ 強み</h3>
          {data.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: "#bbb", alignItems: "flex-start" }}>
              <span style={{ color: "#27ae60", flexShrink: 0, marginTop: 1 }}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{ ...S.card, padding: 18 }}>
          <h3 style={{ ...S.label, color: "#e74c3c" }}>▼ 弱み</h3>
          {data.weaknesses.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: "#bbb", alignItems: "flex-start" }}>
              <span style={{ color: "#e74c3c", flexShrink: 0, marginTop: 1 }}>✕</span>{s}
            </div>
          ))}
        </div>
      </div>

      {/* クラシック / モダンの違い */}
      <div style={{ ...S.card, padding: 18 }}>
        <h3 style={{ ...S.label, color: "#fff" }}>🕹️ クラシック / ⚡ モダンの違い</h3>

        {/* モダンで使えない通常技 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#e74c3c", fontWeight: 700, marginBottom: 8 }}>
            モダンで使用不可の通常技
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {data.modernUnavailable.map((m, i) => (
              <span key={i} style={{
                fontSize: 12, padding: "4px 10px", borderRadius: 6,
                background: "#e74c3c18", border: "1px solid #e74c3c44", color: "#e74c3c",
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* モダン入力不可の必殺技 */}
        {data.modernInputOnly?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#e67e22", fontWeight: 700, marginBottom: 8 }}>
              モダン入力不可の必殺技（コマンドなら使用可）
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {data.modernInputOnly.map((m, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 6,
                  background: "#e67e2218", border: "1px solid #e67e2244", color: "#e67e22",
                }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* クラシックとモダンの比較 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 8 }}>🕹️ クラシックが有利な点</div>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.75 }}>{data.classicAdvantage}</p>
          </div>
          <div style={{ background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 8 }}>⚡ モダンが有利な点</div>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.75 }}>{data.modernAdvantage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
