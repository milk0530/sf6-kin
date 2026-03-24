import { useState } from "react";
import { CHARACTERS } from "../data";

function CharButton({ c, active, isFav, onSelect, onToggleFav }) {
  const [hover, setHover] = useState(false);
  const [starHover, setStarHover] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setStarHover(false); }}
    >
      <button
        onClick={() => onSelect(c.id)}
        style={{
          width: "100%",
          background: active ? "var(--bg-active)" : hover ? "var(--bg-hover)" : "transparent",
          border: "none",
          borderLeft: `3px solid ${active ? c.color : "transparent"}`,
          padding: "7px 12px",
          paddingRight: hover || isFav ? 36 : 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.15s",
          fontFamily: "inherit",
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 6, flexShrink: 0,
          background: c.color + "22",
          border: `1px solid ${active ? c.color + "66" : c.color + "22"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 900, color: c.color,
          transition: "border-color 0.15s",
          overflow: "hidden",
        }}>
          <img
            src={`/chara/${c.id}.png`}
            width={26} height={26}
            draggable={false}
            style={{ objectFit: "cover", display: "block" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            {c.name[0]}
          </span>
        </div>
        <div style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "var(--text)" : "var(--text-3)", transition: "color 0.15s" }}>
          {c.name}
        </div>
      </button>

      {/* お気に入りボタン */}
      {(hover || isFav) && (
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(c.id); }}
          onMouseEnter={() => setStarHover(true)}
          onMouseLeave={() => setStarHover(false)}
          title={isFav ? "お気に入り解除" : "お気に入りに追加"}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, lineHeight: 1,
            color: isFav ? "#f1c40f" : starHover ? "#f1c40f88" : "var(--text-5)",
            transition: "color 0.15s",
            padding: 2,
          }}
        >
          {isFav ? "★" : "☆"}
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ open, activeChar, onCharChange, showStats, onShowStats, favorites = [], onToggleFav }) {
  const favChars = CHARACTERS.filter(c => favorites.includes(c.id));
  const allChars = CHARACTERS;

  return (
    <aside style={{
      width: open ? 196 : 0,
      opacity: open ? 1 : 0,
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      flexShrink: 0,
      overflowY: "auto",
      overflowX: "hidden",
      transition: "width 0.25s ease, opacity 0.2s ease",
    }}>
      <div style={{ minWidth: 196, padding: "16px 0" }}>

        {/* 戦績ボタン */}
        <div style={{ padding: "0 10px 12px" }}>
          <button
            onClick={onShowStats}
            style={{
              width: "100%",
              background: showStats ? "#7c3aed22" : "transparent",
              border: showStats ? "1px solid #7c3aed66" : "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!showStats) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.borderColor = "#7c3aed44"; }}}
            onMouseLeave={e => { if (!showStats) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: showStats ? "#7c3aed33" : "#7c3aed11",
              border: `1px solid ${showStats ? "#7c3aed88" : "#7c3aed33"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              📊
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: showStats ? "#a78bfa" : "var(--text-4)" }}>
                戦績
              </div>
              <div style={{ fontSize: 9, color: showStats ? "#7c3aed88" : "var(--text-6)", letterSpacing: 1 }}>
                BATTLE STATS
              </div>
            </div>
          </button>
        </div>

        {/* お気に入りセクション */}
        {favChars.length > 0 && (
          <>
            <div style={{ padding: "0 14px 6px", fontSize: 10, color: "#f1c40f", fontWeight: 700, letterSpacing: 2 }}>
              ★ FAVORITES
            </div>
            {favChars.map(c => (
              <CharButton
                key={c.id}
                c={c}
                active={activeChar === c.id}
                isFav={true}
                onSelect={onCharChange}
                onToggleFav={onToggleFav}
              />
            ))}
            <div style={{ margin: "10px 14px 8px", borderTop: "1px solid var(--border)" }} />
          </>
        )}

        {/* 全キャラ */}
        <div style={{ padding: "0 14px 8px", fontSize: 10, color: "var(--text-6)", fontWeight: 700, letterSpacing: 2 }}>
          CHARACTERS
        </div>
        {allChars.map(c => (
          <CharButton
            key={c.id}
            c={c}
            active={activeChar === c.id}
            isFav={favorites.includes(c.id)}
            onSelect={onCharChange}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    </aside>
  );
}
