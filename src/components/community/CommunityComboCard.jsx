import { useState } from "react";
import CommandRenderer from "../ui/CommandRenderer";
import PostForm from "./PostForm";

const COMBO_FIELDS = [
  { key: "starter",    label: "始動技",     required: true, placeholder: "例: 弱P, 5強P" },
  { key: "route",      label: "コンボルート", required: true, placeholder: "例: 5強P▶236強P▶SA1" },
  { key: "damage",     label: "ダメージ",    type: "text",   placeholder: "例: 2800" },
  { key: "down",       label: "ダウン有利",  type: "text",   placeholder: "例: 20F" },
  { key: "meter",      label: "ゲージ消費",  type: "text",   placeholder: "例: SA1, ODx1" },
  { key: "difficulty", label: "難易度",      type: "select", options: ["易", "中", "難"] },
  { key: "note",       label: "メモ",        type: "textarea", placeholder: "補足・注意点など" },
];

export default function CommunityComboCard({ combo, index, color, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);

  const diff = combo.difficulty;
  const diffColor = diff === "難" ? "#e74c3c" : diff === "中" ? "#f59e0b" : "#27ae60";

  return (
    <>
      <div style={{
        background: "#0e0e16", border: "1px solid #1e1e30", borderRadius: 10,
        padding: "12px 14px", display: "flex", gap: 12,
      }}>
        {/* 左: 番号 + ビデオアイコン */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 6, flexShrink: 0, paddingTop: 2,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: color + "22", border: `1px solid ${color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color, fontWeight: 700,
          }}>{index}</div>
          <span style={{ fontSize: 11, color: "#2a2a3e" }}>🎬</span>
        </div>

        {/* 中央: コンテンツ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* コマンド */}
          <div style={{
            background: "#13131f", border: "1px solid #1e1e30", borderRadius: 6,
            padding: "8px 12px",
          }}>
            <CommandRenderer command={combo.route} />
          </div>

          {/* バッジ行 */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {combo.damage && (
              <span style={{ fontSize: 12, color: "#888" }}>
                DMG <span style={{ color, fontWeight: 700 }}>{combo.damage}</span>
              </span>
            )}
            {combo.down && (
              <span style={{ fontSize: 12, color: "#888" }}>
                DOWN <span style={{ color: "#3b82f6", fontWeight: 700 }}>{combo.down}</span>
              </span>
            )}
            {combo.meter && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#8e44ad",
              }}>{combo.meter}</span>
            )}
            {diff && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: diffColor + "22", border: `1px solid ${diffColor}`, color: diffColor, fontWeight: 700,
              }}>{diff}</span>
            )}
          </div>

          {/* メモ */}
          {combo.note && (
            <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>{combo.note}</p>
          )}

          {/* 編集・削除ボタン */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "none", border: "none", color: "#444", cursor: "pointer",
                fontSize: 11, padding: "0 2px",
              }}
            >編集</button>
            <button
              onClick={() => {
                if (window.confirm("このコンボを削除しますか？")) onDelete(combo.id);
              }}
              style={{
                background: "none", border: "none", color: "#2a2a3e", cursor: "pointer",
                fontSize: 12, padding: "0 2px",
              }}
            >✕</button>
          </div>
        </div>

        {/* 右: 再生ボタン */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "#1a1a2e", border: "1px solid #2a2a3e",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#444", fontSize: 12,
          }}>▶</div>
        </div>
      </div>

      {editing && (
        <PostForm
          title="コンボを編集"
          fields={COMBO_FIELDS}
          initialValues={combo}
          color={color}
          onSubmit={values => onUpdate(combo.id, values)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
