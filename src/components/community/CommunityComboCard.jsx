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
          borderRadius: 10, padding: "12px 14px",
          display: "flex", gap: 12, cursor: "pointer",
          transition: "all 0.12s",
        }}
      >
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
          <span style={{ fontSize: 11, color: hasMedia ? color + "88" : "var(--border)" }}>🎬</span>
        </div>

        {/* 中央: コンテンツ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {combo.title && (
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{combo.title}</span>
          )}

          {/* コマンド */}
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border-sub)", borderRadius: 6,
            padding: "8px 12px",
          }}>
            <CommandRenderer command={combo.route} />
          </div>

          {/* バッジ行 */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {combo.damage && (
              <span style={{ fontSize: 12, color: "var(--text-2)" }}>
                DMG <span style={{ color: "#22d3ee", fontWeight: 700 }}>{combo.damage}</span>
              </span>
            )}
            {combo.down && (
              <span style={{ fontSize: 12, color: "var(--text-2)" }}>
                DOWN <span style={{ color: "var(--text)", fontWeight: 700 }}>{combo.down}</span>
              </span>
            )}
            {combo.drive && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "#0a2a2a", border: "1px solid #06b6d4", color: "#67e8f9",
              }}>DR {combo.drive}</span>
            )}
            {combo.sa && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "#1e1240", border: "1px solid #7c3aed", color: "#a78bfa",
              }}>{combo.sa}</span>
            )}
            {diff && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: diffColor + "22", border: `1px solid ${diffColor}`, color: diffColor, fontWeight: 700,
              }}>{diff}</span>
            )}
            {combo.tags && combo.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-4)",
              }}>{t}</span>
            ))}
          </div>

          {combo.note && (
            <p style={{ fontSize: 12, color: "var(--text-4)", margin: 0, lineHeight: 1.6 }}>{combo.note}</p>
          )}

          {/* 編集・削除・日付 */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
            {combo.created_at && (
              <span style={{ fontSize: 10, color: "var(--text-6)", marginRight: "auto" }}>
                {formatDate(combo.created_at)}
              </span>
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
            width: 28, height: 28, borderRadius: 6,
            background: hasMedia ? color + "22" : "var(--bg-elevated)",
            border: `1px solid ${hasMedia ? color : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: hasMedia ? color : "var(--text-5)", fontSize: 12,
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
