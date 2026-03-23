import { useState, useMemo } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import CommunitySetplayCard from "../components/community/CommunitySetplayCard";
import PostForm from "../components/community/PostForm";
import { useSetplays } from "../hooks/useSetplays";

const SETPLAY_FIELDS = [
  { key: "situation", label: "状況",     required: true, placeholder: "例: +4有利, ダウン後" },
  { key: "title",     label: "タイトル", required: true, placeholder: "例: 重ね択" },
  { key: "steps",     label: "内容",     required: true, type: "textarea", placeholder: "手順を記入" },
  { key: "damage",    label: "ダメージ", type: "text",   placeholder: "択が通った場合など" },
  { key: "note",      label: "メモ",     type: "textarea", placeholder: "補足・注意点など" },
];

export default function SetplayPage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const [showForm, setShowForm] = useState(false);
  const color = char?.color ?? "#ff6b2b";

  const { setplays, loading, add, remove } = useSetplays(char.id, mode);

  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    setplays.forEach(sp => {
      const s = sp.situation || "その他";
      if (!map[s]) { map[s] = []; order.push(s); }
      map[s].push(sp);
    });
    return { order, map };
  }, [setplays]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <ModeToggle mode={mode} onChange={setMode} />
        <span style={{ flex: 1 }} />
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
      ) : setplays.length === 0 ? (
        <div style={{ color: "#2a2a3e", fontSize: 12, padding: "24px 0", textAlign: "center" }}>まだ投稿がありません</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {grouped.order.map(situation => (
            <div key={situation}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  width: 3, height: 14, borderRadius: 2, flexShrink: 0,
                  background: `linear-gradient(to bottom, ${color}, #7c3aed)`,
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>{situation}</span>
                <span style={{
                  fontSize: 10, color: "#555", background: "#1a1a2e",
                  border: "1px solid #2a2a3e", borderRadius: 4, padding: "1px 5px",
                }}>{grouped.map[situation].length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 11 }}>
                {grouped.map[situation].map(sp => (
                  <CommunitySetplayCard key={sp.id} sp={sp} color={color} onDelete={remove} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PostForm
          title="セットプレイを投稿"
          fields={SETPLAY_FIELDS}
          color={color}
          onSubmit={add}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
