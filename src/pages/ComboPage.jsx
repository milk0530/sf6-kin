import { useState, useMemo } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import CommunityComboCard from "../components/community/CommunityComboCard";
import ComboPostForm from "../components/community/ComboPostForm";
import { useCombos } from "../hooks/useCombos";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ComboPage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [activeStarter, setActiveStarter] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [selected, setSelected] = useState(null);

  const color = char?.color ?? "#ff6b2b";
  const isMobile = useIsMobile();
  const { combos, loading, add, remove, update } = useCombos(char.id, mode);

  const filtered = useMemo(() => {
    if (!search) return combos;
    const q = search.toLowerCase();
    return combos.filter(c =>
      c.route?.toLowerCase().includes(q) ||
      c.starter?.toLowerCase().includes(q) ||
      c.title?.toLowerCase().includes(q) ||
      c.tags?.toLowerCase().includes(q) ||
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

  const handleModeChange = m => {
    setMode(m); setActiveStarter(null); setSearch(""); setCollapsed({}); setSelected(null);
  };

  const handleSelect = combo => {
    setSelected(prev => prev?.id === combo.id ? null : combo);
  };

  const isVideo = url => url && (url.includes(".mp4") || url.includes(".webm"));

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* 左: コンボリスト */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {showForm && (
          <div style={{ marginBottom: 20 }}>
            <ComboPostForm
              color={color}
              onSubmit={add}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <ModeToggle mode={mode} onChange={handleModeChange} color={color} />
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
                background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8,
                color: "var(--text)", fontSize: 12, padding: "9px 14px",
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
                      border: activeStarter === g ? `1px solid ${color}` : "1px solid var(--border)",
                      background: activeStarter === g ? color + "22" : "var(--bg-surface)",
                      color: activeStarter === g ? color : "var(--text-3)",
                      fontWeight: 700, transition: "all 0.12s",
                    }}
                  >
                    {g}
                    <span style={{ marginLeft: 6, fontSize: 11, color: activeStarter === g ? color : "var(--text-5)" }}>
                      ({groupMap[g].length})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {loading ? (
          <div style={{ color: "var(--text-6)", fontSize: 12, padding: "24px 0", textAlign: "center" }}>読み込み中…</div>
        ) : combos.length === 0 ? (
          <div style={{ color: "var(--text-dim)", fontSize: 12, padding: "24px 0", textAlign: "center" }}>まだ投稿がありません</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "var(--text-5)", fontSize: 12, padding: "24px 0", textAlign: "center" }}>一致するコンボがありません</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {visibleGroups.map(group => (
              <div key={group}>
                <button
                  onClick={() => setCollapsed(p => ({ ...p, [group]: !p[group] }))}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 8, background: "var(--bg-surface)", border: "none",
                    borderBottom: `2px solid ${color}33`, cursor: "pointer",
                    padding: "6px 10px", borderRadius: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{group}</span>
                  <span style={{
                    fontSize: 10, color: "var(--text-4)", background: "var(--bg-elevated)",
                    border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px",
                  }}>{groupMap[group].length}件</span>
                  <span style={{ flex: 1 }} />
                  <span style={{
                    color: "var(--text-5)", fontSize: 11,
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
                        selected={selected?.id === c.id}
                        onSelect={handleSelect}
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
      </div>

      {/* 右: メディアパネル（PC only） */}
      {!isMobile && <div style={{
        width: 260, flexShrink: 0, position: "sticky", top: 0,
        background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
        overflow: "hidden",
      }}>
        {selected?.media_url ? (
          <>
            {isVideo(selected.media_url) ? (
              <video
                key={selected.id}
                src={selected.media_url}
                style={{ width: "100%", display: "block" }}
                controls autoPlay
              />
            ) : (
              <img
                src={selected.media_url}
                style={{ width: "100%", display: "block", objectFit: "contain" }}
                alt=""
              />
            )}
            {selected.title && (
              <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-2)" }}>
                {selected.title}
              </div>
            )}
          </>
        ) : (
          <div style={{
            height: 180, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 24, color: "var(--border)" }}>▷</span>
            <span style={{ fontSize: 11, color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6 }}>
              コンボをクリックすると<br />動画が再生されます
            </span>
          </div>
        )}
      </div>}

    </div>
  );
}
