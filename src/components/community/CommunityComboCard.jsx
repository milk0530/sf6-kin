import { useState } from "react";
import CommandRenderer from "../ui/CommandRenderer";
import ComboPostForm from "./ComboPostForm";
import MediaModal from "./MediaModal";
import { useIsMobile } from "../../hooks/useIsMobile";
import { formatDate } from "../../utils/formatDate";

export default function CommunityComboCard({ combo, index, color, onDelete, onUpdate, onSelect, selected }) {
  const [editing, setEditing] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const isMobile = useIsMobile();

  const diff = combo.difficulty;
  const diffColor = diff === "難" ? "#e74c3c" : diff === "中" ? "#f59e0b" : "#27ae60";
  const hasMedia = !!combo.media_url;

  if (editing) {
    return (
      <ComboPostForm
        initialValues={combo}
        color={color}
        onSubmit={values => onUpdate(combo.id, values)}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      <div
        onClick={() => onSelect(combo)}
        style={{
          background: selected ? "var(--bg-elevated)" : "var(--bg)",
          border: `1px solid ${selected ? color + "55" : "var(--border-sub)"}`,
          borderRadius: 8, padding: "9px 12px",
          display: "flex", gap: 10, cursor: "pointer",
          transition: "all 0.12s",
        }}
      >
        {/* 左: 番号 */}
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: color + "22", border: `1px solid ${color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color, fontWeight: 700,
          }}>{index}</div>
        </div>

        {/* 中央: コンテンツ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
          {/* タイトル + 編集・削除 を1行に */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={e => e.stopPropagation()}>
            {combo.title && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{combo.title}</span>
            )}
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: hasMedia ? color + "99" : "var(--border)" }}>🎬</span>
            {combo.created_at && (
              <span style={{ fontSize: 10, color: "var(--text-6)" }}>{formatDate(combo.created_at)}</span>
            )}
            <button
              onClick={() => setEditing(true)}
              style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer", fontSize: 11, padding: "0 2px" }}
            >編集</button>
            <button
              onClick={() => { if (window.confirm("このコンボを削除しますか？")) onDelete(combo.id); }}
              style={{ background: "none", border: "none", color: "var(--border)", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
            >✕</button>
          </div>

          {/* バッジ行 */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {combo.damage && (
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                <span style={{ color: "#22d3ee", fontWeight: 700 }}>{combo.damage}</span>
                <span style={{ color: "var(--text-5)", fontSize: 10 }}>dmg</span>
              </span>
            )}
            {combo.down && (
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>{combo.down}</span>
                <span style={{ color: "var(--text-5)", fontSize: 10 }}>F↓</span>
              </span>
            )}
            {combo.drive && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 3,
                background: "#0a2a2a", border: "1px solid #06b6d4", color: "#67e8f9",
              }}>DR {combo.drive}</span>
            )}
            {combo.sa && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 3,
                background: "#1e1240", border: "1px solid #7c3aed", color: "#a78bfa",
              }}>{combo.sa}</span>
            )}
            {diff && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 3,
                background: diffColor + "22", border: `1px solid ${diffColor}`, color: diffColor, fontWeight: 700,
              }}>{diff}</span>
            )}
            {combo.tags && combo.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 3,
                background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-4)",
              }}>{t}</span>
            ))}
          </div>

          {/* コマンド */}
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border-sub)", borderRadius: 5,
            padding: "5px 10px",
          }}>
            <CommandRenderer command={combo.route} />
          </div>

          {combo.note && (
            <p style={{ fontSize: 11, color: "var(--text-5)", margin: 0, lineHeight: 1.5 }}>{combo.note}</p>
          )}
        </div>

        {/* 右: 再生ボタン */}
        <div
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
          onClick={e => {
            if (!hasMedia) return;
            e.stopPropagation();
            if (isMobile) setShowMedia(true);
            else onSelect(combo);
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 5,
            background: hasMedia ? color + "22" : "var(--bg-elevated)",
            border: `1px solid ${hasMedia ? color : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: hasMedia ? color : "var(--text-5)", fontSize: 11,
            cursor: hasMedia ? "pointer" : "default",
          }}>▶</div>
        </div>
      </div>

      {showMedia && combo.media_url && (
        <MediaModal
          url={combo.media_url}
          title={combo.title}
          onClose={() => setShowMedia(false)}
        />
      )}

    </>
  );
}
