import { useState, useMemo } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import CommunityComboCard from "../components/community/CommunityComboCard";
import PostForm from "../components/community/PostForm";
import { useCombos } from "../hooks/useCombos";

const COMBO_FIELDS = [
  { key: "starter",    label: "始動技",     required: true, placeholder: "例: 弱P, 5強P" },
  { key: "route",      label: "コンボルート", required: true, placeholder: "例: 5強P▶236強P▶SA1" },
  { key: "damage",     label: "ダメージ",    type: "text",   placeholder: "例: 2800" },
  { key: "down",       label: "ダウン有利",  type: "text",   placeholder: "例: 20F" },
  { key: "meter",      label: "ゲージ消費",  type: "text",   placeholder: "例: SA1, ODx1" },
  { key: "difficulty", label: "難易度",      type: "select", options: ["易", "中", "難"] },
  { key: "note",       label: "メモ",        type: "textarea", placeholder: "補足・注意点など" },
];

export default function ComboPage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [activeStarter, setActiveStarter] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const color = char?.color ?? "#ff6b2b";
  const { combos, loading, add, remove, update } = useCombos(char.id, mode);

  const filtered = useMemo(() => {
    if (!search) return combos;
    const q = search.toLowerCase();
    return combos.filter(c =>
      c.route?.toLowerCase().includes(q) ||
      c.starter?.toLowerCase().includes(q) ||
      c.note?.toLowerCase().includes(q)
    );
  }, [combos, search]);

  const { groupOrder, groupMap } = useMemo(() => {
    const map = {};
    const order = [];
    filtered.forEach(c => {
      const s = c.starter || "その他";
      if (!map[s]) { map[s] = []; order.push(s); }
      map[s].push(c);
    });
    return { groupOrder: order, groupMap: map };
  }, [filtered]);

  const visibleGroups = activeStarter
    ? groupOrder.filter(g => g === activeStarter)
    : groupOrder;

  const toggleCollapse = g =>
    setCollapsed(prev => ({ ...prev, [g]: !prev[g] }));

  const handleModeChange = m => {
    setMode(m);
    setActiveStarter(null);
    setSearch("");
    setCollapsed({});
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <ModeToggle mode={mode} onChange={handleModeChange} />
        <span style={{ flex: 1 }} />
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer",
            background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700,
          }}
        >+ 投稿</button>
      </div>

      {!loading && combos.length > 0 && (
        <>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="レシピ・タグで検索..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 8,
              color: "#e8e8f0", fontSize: 12, padding: "9px 14px",
              outline: "none", marginBottom: 10,
            }}
          />
          {groupOrder.length > 1 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {groupOrder.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveStarter(prev => prev === g ? null : g)}
                  style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: activeStarter === g ? `1px solid ${color}` : "1px solid #2a2a3e",
                    background: activeStarter === g ? color + "22" : "#13131f",
                    color: activeStarter === g ? color : "#666",
                    fontWeight: 700, transition: "all 0.12s",
                  }}
                >
                  {g}
                  <span style={{ marginLeft: 6, fontSize: 11, color: activeStarter === g ? color : "#444" }}>
                    ({groupMap[g].length})
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {loading ? (
        <div style={{ color: "#333", fontSize: 12, padding: "24px 0", textAlign: "center" }}>読み込み中…</div>
      ) : combos.length === 0 ? (
        <div style={{ color: "#2a2a3e", fontSize: 12, padding: "24px 0", textAlign: "center" }}>まだ投稿がありません</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#444", fontSize: 12, padding: "24px 0", textAlign: "center" }}>一致するコンボがありません</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {visibleGroups.map(group => (
            <div key={group}>
              <button
                onClick={() => toggleCollapse(group)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 8, background: "#13131f", border: "none",
                  borderBottom: `2px solid ${color}33`, cursor: "pointer",
                  padding: "6px 10px", borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0" }}>{group}</span>
                <span style={{
                  fontSize: 10, color: "#555", background: "#1a1a2e",
                  border: "1px solid #2a2a3e", borderRadius: 4, padding: "1px 6px",
                }}>{groupMap[group].length}件</span>
                <span style={{ flex: 1 }} />
                <span style={{
                  color: "#444", fontSize: 11,
                  transform: collapsed[group] ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 0.15s", display: "inline-block",
                }}>∨</span>
              </button>
              {!collapsed[group] && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {groupMap[group].map((c, i) => (
                    <CommunityComboCard
                      key={c.id}
                      combo={c}
                      index={i + 1}
                      color={color}
                      onDelete={remove}
                      onUpdate={update}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PostForm
          title="コンボを投稿"
          fields={COMBO_FIELDS}
          color={color}
          onSubmit={add}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
