import { useState } from "react";
import CommandRenderer from "../ui/CommandRenderer";
import SetplayPostForm from "./SetplayPostForm";

const OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  zIndex: 1000, overflowY: "auto", padding: "40px 16px",
};

export default function SetplayLinkModal({
  color,
  combo,
  allSetplays,
  linkedIds,
  onLink,
  onUnlink,
  onAddNew,
  onClose,
}) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = allSetplays.filter(sp => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sp.title?.toLowerCase().includes(q) ||
      sp.steps?.toLowerCase().includes(q) ||
      sp.situation?.toLowerCase().includes(q) ||
      sp.tags?.toLowerCase().includes(q)
    );
  });

  const linked = filtered.filter(sp => linkedIds.includes(sp.id));
  const unlinked = filtered.filter(sp => !linkedIds.includes(sp.id));

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 600, flexShrink: 0 }}>

        {/* ヘッダー */}
        <div style={{
          background: color + "22", border: `1px solid ${color}44`,
          borderRadius: "12px 12px 0 0", padding: "12px 18px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color, fontWeight: 700 }}>起き攻めを紐付ける</div>
            <div style={{ fontSize: 11, color: "var(--text-5)", marginTop: 2 }}>
              {combo.title || combo.route?.slice(0, 40)}
              {combo.down ? ` ／ DOWN ${combo.down}F` : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-4)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
          >×</button>
        </div>

        {/* 本体 */}
        <div style={{
          background: "var(--bg-surface)", border: `1px solid ${color}44`,
          borderTop: "none", borderRadius: "0 0 12px 12px",
          padding: "18px", display: "flex", flexDirection: "column", gap: 16,
        }}>

          {/* 新規作成トグル */}
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              width: "100%", padding: "8px 0", borderRadius: 7, fontSize: 12,
              cursor: "pointer", background: showForm ? color + "22" : "transparent",
              border: `1px dashed ${color}88`, color, fontWeight: 700,
            }}
          >{showForm ? "▲ 新規作成を閉じる" : "+ 新しい起き攻めを作成して追加"}</button>

          {showForm && (
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <SetplayPostForm
                color={color}
                defaultComboId={combo.id}
                asModalChild
                onSubmit={async v => { await onAddNew(v); setShowForm(false); }}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}

          {/* 既存の起き攻めから選ぶ */}
          {allSetplays.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8 }}>
                既存の起き攻めから選ぶ
              </div>

              {allSetplays.length > 4 && (
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="タイトル・状況・レシピで検索..."
                  style={{
                    width: "100%", boxSizing: "border-box", marginBottom: 10,
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
                    color: "var(--text)", fontSize: 12, padding: "7px 10px", outline: "none",
                  }}
                />
              )}

              {/* 紐付け済み */}
              {linked.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: color, fontWeight: 700, marginBottom: 6, paddingLeft: 2 }}>
                    ✓ 紐付け済み
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {linked.map(sp => (
                      <SetplayRow
                        key={sp.id}
                        sp={sp}
                        linked
                        color={color}
                        onToggle={() => onUnlink(sp.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 未紐付け */}
              {unlinked.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {unlinked.map(sp => (
                    <SetplayRow
                      key={sp.id}
                      sp={sp}
                      linked={false}
                      color={color}
                      onToggle={() => onLink(sp.id)}
                    />
                  ))}
                </div>
              )}

              {filtered.length === 0 && (
                <div style={{ fontSize: 12, color: "var(--text-6)", textAlign: "center", padding: "12px 0" }}>
                  一致する起き攻めがありません
                </div>
              )}
            </div>
          )}

          {allSetplays.length === 0 && !showForm && (
            <div style={{ fontSize: 12, color: "var(--text-6)", textAlign: "center", padding: "8px 0" }}>
              まだ起き攻めが登録されていません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SetplayRow({ sp, linked, color, onToggle }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: linked ? color + "0d" : "var(--bg)",
      border: `1px solid ${linked ? color + "44" : "var(--border-sub)"}`,
      borderRadius: 8, padding: "8px 10px",
      transition: "all 0.12s",
    }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {sp.situation && (
            <span style={{
              fontSize: 10, padding: "1px 6px", borderRadius: 3,
              background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-4)",
            }}>{sp.situation}</span>
          )}
          {sp.title && (
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{sp.title}</span>
          )}
          {sp.tags && sp.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
            <span key={t} style={{
              fontSize: 10, padding: "1px 5px", borderRadius: 3,
              background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-5)",
            }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-4)" }}>
          <CommandRenderer command={sp.steps} />
        </div>
      </div>
      <button
        onClick={onToggle}
        style={{
          flexShrink: 0, padding: "4px 12px", borderRadius: 6, fontSize: 11,
          cursor: "pointer", fontWeight: 700, transition: "all 0.12s",
          background: linked ? "#2a0a0a" : color + "22",
          border: `1px solid ${linked ? "#e74c3c88" : color}`,
          color: linked ? "#e74c3c" : color,
        }}
      >{linked ? "解除" : "追加"}</button>
    </div>
  );
}
