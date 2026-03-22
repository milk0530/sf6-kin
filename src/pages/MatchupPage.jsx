import { RATING_COLOR } from "../constants/styles";

export default function MatchupPage({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.matchups.map((m, i) => (
        <div
          key={i}
          style={{
            background: "#13131f", border: "1px solid #2a2a3e",
            borderRadius: 10, padding: "14px 18px",
            display: "flex", gap: 14, alignItems: "flex-start",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = m.color + "44")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a3e")}
        >
          {/* キャラアイコン */}
          <div style={{
            width: 42, height: 42, borderRadius: 9, flexShrink: 0,
            background: m.color + "22", border: `1px solid ${m.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: 900, color: m.color,
          }}>
            {m.char[0]}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{m.char}</span>
              <span style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 700,
                background: (RATING_COLOR[m.rating] || "#555") + "22",
                color: RATING_COLOR[m.rating] || "#888",
                border: `1px solid ${RATING_COLOR[m.rating] || "#555"}44`,
              }}>
                {m.rating}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>{m.tips}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
