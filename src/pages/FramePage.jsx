import { useState } from "react";

export default function FramePage({ data, char }) {
  const [mode, setMode] = useState("classic");

  const moves = mode === "classic"
    ? (data.moves ?? [])
    : (data.modernMoves ?? data.moves ?? []);

  // group別に分類（定義順を保持）
  const groupOrder = [];
  const groupMap = {};
  moves.forEach(m => {
    const g = m.group ?? "その他";
    if (!groupMap[g]) {
      groupMap[g] = [];
      groupOrder.push(g);
    }
    groupMap[g].push(m);
  });

  const advantageColor = val => {
    const s = String(val);
    if (s.startsWith("+")) return "#27ae60";
    if (s.startsWith("-")) return "#e74c3c";
    if (s === "D" || s === "ダウン") return "#e67e22";
    return "#888";
  };

  const HEADERS = ["技名", "コマンド", "発生", "持続", "硬直", "ヒット", "ガード", "キャンセル", "DMG", "属性", "備考"];

  const color = char?.color ?? "#ff6b2b";

  return (
    <div>
      {/* モード切り替え */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["classic", "クラシック"], ["modern", "モダン"]].map(([key, label]) => {
          const active = mode === key;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                padding: "6px 18px",
                borderRadius: 6,
                border: active ? `1px solid ${color}` : "1px solid #2a2a3e",
                background: active ? color + "22" : "transparent",
                color: active ? color : "#555",
                fontWeight: active ? 700 : 400,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {moves.length === 0 ? (
        <div style={{ color: "#333", padding: "48px 0", textAlign: "center", fontSize: 13 }}>
          フレームデータなし
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {groupOrder.map(group => (
            <div key={group}>
              <h3 style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: 10, marginTop: 0,
              }}>
                <span style={{
                  width: 4, height: 20, borderRadius: 2,
                  background: `linear-gradient(to bottom, ${color}, #7c3aed)`,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#e8e8f0" }}>{group}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#888",
                  background: "#1a1a2e", border: "1px solid #2a2a3e",
                  borderRadius: 4, padding: "2px 6px",
                }}>
                  {groupMap[group].length}技
                </span>
              </h3>

              <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 12, overflow: "hidden", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#0e0e16" }}>
                      {HEADERS.map(h => (
                        <th key={h} style={{
                          padding: "9px 12px", color: "#444", fontWeight: 700,
                          textAlign: "left", borderBottom: "1px solid #2a2a3e",
                          letterSpacing: 0.5, whiteSpace: "nowrap",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupMap[group].map((m, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid #1a1a2e", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1a1a2e")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "9px 12px", color: "#e8e8f0", fontWeight: 700, whiteSpace: "nowrap" }}>{m.label}</td>
                        <td style={{ padding: "9px 12px", color: "#888", fontFamily: "monospace", whiteSpace: "nowrap" }}>{m.command ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#ff6b2b", whiteSpace: "nowrap" }}>
                          {m.startup != null && m.startup !== "-" ? (typeof m.startup === "number" ? m.startup + "F" : m.startup) : "-"}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#555", whiteSpace: "nowrap" }}>{m.active ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#555", whiteSpace: "nowrap" }}>{m.recovery ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: advantageColor(m.onHit), fontWeight: 700, whiteSpace: "nowrap" }}>{m.onHit}</td>
                        <td style={{ padding: "9px 12px", color: advantageColor(m.onBlock), fontWeight: 700, whiteSpace: "nowrap" }}>{m.onBlock}</td>
                        <td style={{ padding: "9px 12px", color: m.cancel === "○" ? "#27ae60" : "#444", textAlign: "center", whiteSpace: "nowrap" }}>{m.cancel ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#666", whiteSpace: "nowrap" }}>{m.damage ?? "-"}</td>
                        <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                          {m.attribute && m.attribute !== "-"
                            ? <span style={{
                                display: "inline-block", padding: "2px 6px", borderRadius: 3,
                                fontSize: 10, fontWeight: 700,
                                background: "#1a1a2e", color: "#666", border: "1px solid #2a2a3e",
                              }}>{m.attribute}</span>
                            : <span style={{ color: "#333" }}>-</span>
                          }
                        </td>
                        <td style={{ padding: "9px 12px", color: "#444", fontSize: 11, minWidth: 160 }}>{m.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
