import { useState, useMemo } from "react";
import CommandRenderer from "../components/ui/CommandRenderer";

const CHIP_BASE = {
  padding: "4px 10px", borderRadius: 20, fontSize: 11,
  cursor: "pointer", border: "1px solid #2a2a3e",
  background: "transparent", color: "#555",
  fontWeight: 600, transition: "all 0.12s", whiteSpace: "nowrap",
};

function Chip({ label, active, color = "#ff6b2b", onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...CHIP_BASE,
        border: active ? `1px solid ${color}` : "1px solid #2a2a3e",
        background: active ? color + "22" : "transparent",
        color: active ? color : "#555",
      }}
    >
      {label}
    </button>
  );
}

export default function FramePage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const [search, setSearch] = useState("");
  const [filterBlock, setFilterBlock] = useState(null); // "+" | "0" | "-"
  const [filterAttr, setFilterAttr] = useState(null);   // "上" | "中" | "下"
  const [filterCancel, setFilterCancel] = useState(false);

  const color = char?.color ?? "#ff6b2b";

  const allMoves = mode === "classic"
    ? (data.moves ?? [])
    : (data.modernMoves ?? data.moves ?? []);

  const hasFilter = search || filterBlock || filterAttr || filterCancel;

  const filtered = useMemo(() => allMoves.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      if (!m.label?.toLowerCase().includes(q) && !m.note?.toLowerCase().includes(q)) return false;
    }
    if (filterBlock) {
      const s = String(m.onBlock ?? "");
      if (filterBlock === "+" && !s.startsWith("+")) return false;
      if (filterBlock === "0" && s !== "0") return false;
      if (filterBlock === "-" && !s.startsWith("-")) return false;
    }
    if (filterAttr && !(m.attribute ?? "").includes(filterAttr)) return false;
    if (filterCancel && m.cancel !== "○") return false;
    return true;
  }), [allMoves, search, filterBlock, filterAttr, filterCancel]);

  // group別に分類（定義順を保持）
  const { groupOrder, groupMap } = useMemo(() => {
    const order = [];
    const map = {};
    filtered.forEach(m => {
      const g = m.group ?? "その他";
      if (!map[g]) { map[g] = []; order.push(g); }
      map[g].push(m);
    });
    return { groupOrder: order, groupMap: map };
  }, [filtered]);

  const advantageColor = val => {
    const s = String(val);
    if (s.startsWith("+")) return "#27ae60";
    if (s.startsWith("-")) return "#e74c3c";
    if (s === "D" || s === "ダウン") return "#e67e22";
    return "#888";
  };

  const HEADERS = ["技名", "コマンド", "発生", "持続", "硬直", "ヒット", "ガード", "キャンセル", "DMG", "属性", "備考"];

  const clearFilters = () => {
    setSearch(""); setFilterBlock(null); setFilterAttr(null); setFilterCancel(false);
  };

  const toggleBlock = v => setFilterBlock(prev => prev === v ? null : v);
  const toggleAttr  = v => setFilterAttr(prev  => prev === v ? null : v);

  return (
    <div>
      {/* モード切り替え */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["classic", "クラシック"], ["modern", "モダン"]].map(([key, label]) => {
          const active = mode === key;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                padding: "6px 18px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: active ? `1px solid ${color}` : "1px solid #2a2a3e",
                background: active ? color + "22" : "transparent",
                color: active ? color : "#555",
                fontWeight: active ? 700 : 400, transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* フィルタバー */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8,
        padding: "10px 14px", marginBottom: 20,
        background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 10,
      }}>
        {/* テキスト検索 */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="技名で検索…"
          style={{
            background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 6,
            color: "#e8e8f0", fontSize: 12, padding: "4px 10px",
            outline: "none", width: 140,
          }}
        />

        <span style={{ color: "#2a2a3e", fontSize: 12 }}>|</span>

        {/* ガード時有利 */}
        <span style={{ color: "#444", fontSize: 11 }}>ガード</span>
        <Chip label="+有利" active={filterBlock === "+"} color="#27ae60" onClick={() => toggleBlock("+")} />
        <Chip label="±0" active={filterBlock === "0"} color="#888" onClick={() => toggleBlock("0")} />
        <Chip label="-不利" active={filterBlock === "-"} color="#e74c3c" onClick={() => toggleBlock("-")} />

        <span style={{ color: "#2a2a3e", fontSize: 12 }}>|</span>

        {/* 属性 */}
        <span style={{ color: "#444", fontSize: 11 }}>属性</span>
        {["上", "中", "下"].map(a => (
          <Chip key={a} label={a} active={filterAttr === a} onClick={() => toggleAttr(a)} />
        ))}

        <span style={{ color: "#2a2a3e", fontSize: 12 }}>|</span>

        {/* キャンセル可 */}
        <Chip label="キャンセル可" active={filterCancel} color="#27ae60" onClick={() => setFilterCancel(p => !p)} />

        {/* クリアボタン */}
        {hasFilter && (
          <button
            onClick={clearFilters}
            style={{
              ...CHIP_BASE, marginLeft: "auto",
              border: "1px solid #444", color: "#666",
            }}
          >
            × クリア
          </button>
        )}

        {/* ヒット数 */}
        {hasFilter && (
          <span style={{ color: "#555", fontSize: 11, whiteSpace: "nowrap" }}>
            {filtered.length}件
          </span>
        )}
      </div>

      {/* テーブル */}
      {allMoves.length === 0 ? (
        <div style={{ color: "#333", padding: "48px 0", textAlign: "center", fontSize: 13 }}>
          フレームデータなし
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#444", padding: "48px 0", textAlign: "center", fontSize: 13 }}>
          条件に一致する技がありません
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {groupOrder.map(group => (
            <div key={group}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, marginTop: 0 }}>
                <span style={{
                  width: 4, height: 20, borderRadius: 2, flexShrink: 0,
                  background: `linear-gradient(to bottom, ${color}, #7c3aed)`,
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
                        <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}><CommandRenderer command={m.command ?? "-"} /></td>
                        <td style={{ padding: "9px 12px", color: "#ff6b2b", whiteSpace: "nowrap" }}>
                          {m.startup != null && m.startup !== "-" ? (typeof m.startup === "number" ? m.startup + "F" : m.startup) : "-"}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#555", whiteSpace: "nowrap" }}>{m.active ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: "#555", whiteSpace: "nowrap" }}>{m.recovery ?? "-"}</td>
                        <td style={{ padding: "9px 12px", color: advantageColor(m.onHit),   fontWeight: 700, whiteSpace: "nowrap" }}>{m.onHit}</td>
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
