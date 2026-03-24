import { useState } from "react";
import { TABS } from "../data";

export default function CharHeader({ char, activeTab, onTabChange, isFav, onToggleFav }) {
  const [starHover, setStarHover] = useState(false);

  return (
    <>
      {/* キャラクター名 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
        <div style={{
          width: 58, height: 58, borderRadius: 14, flexShrink: 0,
          background: char.color + "22", border: `2px solid ${char.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 900, color: char.color,
          overflow: "hidden",
        }}>
          <img
            src={`/chara/${char.id}.png`}
            width={58} height={58}
            draggable={false}
            style={{ objectFit: "cover", display: "block" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            {char.name[0]}
          </span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 25, fontWeight: 900, color: "var(--text-white)", letterSpacing: 2 }}>{char.name}</div>
            <button
              onClick={onToggleFav}
              onMouseEnter={() => setStarHover(true)}
              onMouseLeave={() => setStarHover(false)}
              title={isFav ? "お気に入り解除" : "お気に入りに追加"}
              style={{
                background: "none", border: "none",
                cursor: "pointer",
                fontSize: 16,
                color: isFav ? "#f1c40f" : starHover ? "#f1c40f99" : "var(--text-5)",
                transition: "color 0.15s",
                padding: 0,
                lineHeight: 1,
              }}
            >
              {isFav ? "★" : "☆"}
            </button>
          </div>
          <div style={{ fontSize: 10, color: char.color + "66", letterSpacing: 4 }}>{char.sub}</div>
        </div>
      </div>

      {/* タブ */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 22, overflowX: "auto" }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "none", border: "none",
                padding: "9px 13px", fontSize: 12,
                color: active ? char.color : "var(--text-4)",
                cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: active ? `2px solid ${char.color}` : "2px solid transparent",
                marginBottom: -1,
                fontFamily: "inherit",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--text-2)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--text-4)"; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
