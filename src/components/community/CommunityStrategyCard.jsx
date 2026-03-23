import { useState } from "react";
import PostForm from "./PostForm";

const TAG_STYLE = {
  共通:       { bg: "#1a1a2e", border: "#2a2a3e", color: "#666" },
  クラシック: { bg: "#0d1f3c", border: "#3b82f6", color: "#93c5fd" },
  モダン:     { bg: "#2d0e3a", border: "#c026d3", color: "#e879f9" },
};

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

export default function CommunityStrategyCard({ strategy, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const tag = strategy.tag;
  const ts = TAG_STYLE[tag] ?? TAG_STYLE["共通"];

  return (
    <>
      <div style={{
        background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 10,
        padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {tag && (
            <span style={{
              flexShrink: 0, fontSize: 10, fontWeight: 700,
              padding: "2px 7px", borderRadius: 3,
              background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color,
            }}>{tag}</span>
          )}
          <p style={{ fontSize: 13, color: "#aaa", margin: 0, lineHeight: 1.7, flex: 1, whiteSpace: "pre-wrap" }}>
            {strategy.content}
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "none", border: "none", color: "#444", cursor: "pointer",
                fontSize: 11, padding: "0 2px",
              }}
            >編集</button>
            <button
              onClick={() => {
                if (window.confirm("この攻略メモを削除しますか？")) onDelete(strategy.id);
              }}
              style={{
                background: "none", border: "none", color: "#333", cursor: "pointer",
                fontSize: 13, padding: "0 2px", lineHeight: 1,
              }}
            >✕</button>
          </div>
        </div>
      </div>

      {editing && (
        <PostForm
          title="攻略メモを編集"
          fields={STRATEGY_FIELDS}
          initialValues={strategy}
          onSubmit={values => onUpdate(strategy.id, values)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
