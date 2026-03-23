import { useState } from "react";
import CommandRenderer from "../ui/CommandRenderer";
import SetplayPostForm from "./SetplayPostForm";
import MediaModal from "./MediaModal";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function CommunitySetplayCard({ sp, index, color, onDelete, onUpdate, onSelect, selected }) {
  const [editing, setEditing] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const isMobile = useIsMobile();
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

  const hitVal  = sp.hit   ? Number(sp.hit.replace(/[^0-9\-]/g, ""))  : null;
  const guardVal = sp.guard ? Number(sp.guard.replace(/[^0-9\-]/g, "")) : null;

  return (
    <>
      <div
        onClick={() => onSelect?.(sp)}
        style={{
          background: selected ? "#1a1a2e" : "#0e0e16",
          border: `1px solid ${selected ? color + "55" : "#1e1e30"}`,
          borderRadius: 10, padding: "12px 14px",
          display: "flex", gap: 12, cursor: onSelect ? "pointer" : "default",
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
          <span style={{ fontSize: 11, color: hasMedia ? color + "88" : "#2a2a3e" }}>🎬</span>
        </div>

        {/* 中央: コンテンツ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {sp.title && (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#e8e8f0" }}>{sp.title}</span>
          )}

          {/* コマンド */}
          <div style={{
            background: "#13131f", border: "1px solid #1e1e30", borderRadius: 6,
            padding: "8px 12px",
          }}>
            <CommandRenderer command={sp.steps} />
          </div>

          {/* バッジ行 */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {sp.damage && (
              <span style={{ fontSize: 12, color: "#888" }}>
                DMG <span style={{ color: "#22d3ee", fontWeight: 700 }}>{sp.damage}</span>
              </span>
            )}
            {sp.down && (
              <span style={{ fontSize: 12, color: "#888" }}>
                DOWN <span style={{ color: "#e8e8f0", fontWeight: 700 }}>{sp.down}</span>
              </span>
            )}
            {sp.hit && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "#0a2a14", border: "1px solid #27ae6066", color: "#27ae60", fontWeight: 700,
              }}>HIT {hitVal >= 0 ? `+${hitVal}` : sp.hit}</span>
            )}
            {sp.guard && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: guardVal >= 0 ? "#0a2a14" : "#2a0a0a",
                border: `1px solid ${guardVal >= 0 ? "#27ae6066" : "#e74c3c66"}`,
                color: guardVal >= 0 ? "#27ae60" : "#e74c3c", fontWeight: 700,
              }}>G {guardVal >= 0 ? `+${guardVal}` : sp.guard}</span>
            )}
            {sp.tags && sp.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 3,
                background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#555",
              }}>{t}</span>
            ))}
          </div>

          {sp.note && (
            <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>{sp.note}</p>
          )}

          {/* 編集・削除 */}
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

        {/* 右: 再生ボタン */}
        <div
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
          onClick={e => {
            if (!hasMedia) return;
            e.stopPropagation();
            if (isMobile) setShowMedia(true);
            else onSelect?.(sp);
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: hasMedia ? color + "22" : "#1a1a2e",
            border: `1px solid ${hasMedia ? color : "#2a2a3e"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: hasMedia ? color : "#444", fontSize: 12,
            cursor: hasMedia ? "pointer" : "default",
          }}>▶</div>
        </div>
      </div>

      {showMedia && sp.media_url && (
        <MediaModal
          url={sp.media_url}
          title={sp.title}
          onClose={() => setShowMedia(false)}
        />
      )}
    </>
  );
}
