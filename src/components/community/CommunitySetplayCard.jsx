import { useState } from "react";
import SetplayPostForm from "./SetplayPostForm";

export default function CommunitySetplayCard({ sp, color, onDelete, onUpdate, onSelect, selected }) {
  const [editing, setEditing] = useState(false);
  const hasMedia = !!sp.media_url;

  if (editing) {
    return (
      <SetplayPostForm
        initialValues={sp}
        color={color}
        onSubmit={values => onUpdate(sp.id, values)}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      onClick={() => onSelect?.(sp)}
      style={{
        background: selected ? "#1a1a2e" : "#0e0e16",
        border: `1px solid ${selected ? color + "55" : "#2a2a3e"}`,
        borderRadius: 10, padding: "12px 14px",
        display: "flex", gap: 12, cursor: onSelect ? "pointer" : "default",
        transition: "all 0.12s",
      }}
    >
      {/* コンテンツ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0", flex: 1 }}>{sp.title}</span>
          {sp.damage && (
            <span style={{ fontSize: 11, color: "#22d3ee", fontWeight: 700, flexShrink: 0 }}>{sp.damage}pt</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
          {sp.steps}
        </p>
        {sp.note && (
          <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.6 }}>{sp.note}</p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setEditing(true)}
            style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 11, padding: "0 2px" }}
          >編集</button>
          <button
            onClick={() => { if (window.confirm("このセットプレイを削除しますか？")) onDelete(sp.id); }}
            style={{ background: "none", border: "none", color: "#2a2a3e", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
          >✕</button>
        </div>
      </div>

      {/* 再生ボタン */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: hasMedia ? color + "22" : "#1a1a2e",
          border: `1px solid ${hasMedia ? color : "#2a2a3e"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hasMedia ? color : "#444", fontSize: 12,
        }}>▶</div>
      </div>
    </div>
  );
}
