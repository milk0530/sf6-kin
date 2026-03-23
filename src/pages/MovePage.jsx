import { useState } from "react";
import CommunityStrategyCard from "../components/community/CommunityStrategyCard";
import PostForm from "../components/community/PostForm";
import { useStrategies } from "../hooks/useStrategies";

const STRATEGY_FIELDS = [
  {
    key: "category", label: "カテゴリ", required: true,
    type: "select", options: ["立ち回り", "起き攻め", "対空", "崩し", "その他"],
  },
  {
    key: "tag", label: "対象モード",
    type: "select", options: ["共通", "クラシック", "モダン"],
  },
  {
    key: "content", label: "内容", required: true,
    type: "textarea", placeholder: "攻略メモを記入…",
  },
];

export default function MovePage({ data, char }) {
  const [showForm, setShowForm] = useState(false);
  const color = char?.color ?? "#ff6b2b";

  const { strategies, loading, add, remove, update } = useStrategies(char.id);

  const grouped = {};
  const groupOrder = [];
  strategies.forEach(s => {
    const c = s.category || "その他";
    if (!grouped[c]) { grouped[c] = []; groupOrder.push(c); }
    grouped[c].push(s);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer",
            background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700,
          }}
        >+ 投稿</button>
      </div>

      {loading ? (
        <div style={{ color: "#333", fontSize: 12, padding: "24px 0", textAlign: "center" }}>読み込み中…</div>
      ) : strategies.length === 0 ? (
        <div style={{ color: "#2a2a3e", fontSize: 12, padding: "24px 0", textAlign: "center" }}>まだ投稿がありません</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {groupOrder.map(cat => (
            <div key={cat}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  width: 3, height: 14, borderRadius: 2, flexShrink: 0,
                  background: `linear-gradient(to bottom, ${color}, #7c3aed)`,
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>{cat}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 11 }}>
                {grouped[cat].map(s => (
                  <CommunityStrategyCard key={s.id} strategy={s} onDelete={remove} onUpdate={update} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PostForm
          title="攻略メモを投稿"
          fields={STRATEGY_FIELDS}
          color={color}
          onSubmit={add}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
