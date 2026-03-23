import { CHARACTERS } from "../data";

export default function Sidebar({ open, activeChar, onCharChange, showStats, onShowStats }) {
  return (
    <aside style={{
      width: open ? 196 : 0,
      opacity: open ? 1 : 0,
      background: "#13131f",
      borderRight: "1px solid #2a2a3e",
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
              border: showStats ? "1px solid #7c3aed66" : "1px solid #2a2a3e",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!showStats) { e.currentTarget.style.background = "#111120"; e.currentTarget.style.borderColor = "#7c3aed44"; }}}
            onMouseLeave={e => { if (!showStats) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#2a2a3e"; }}}
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
              <div style={{ fontSize: 13, fontWeight: 700, color: showStats ? "#a78bfa" : "#777" }}>
                戦績
              </div>
              <div style={{ fontSize: 9, color: showStats ? "#7c3aed88" : "#333", letterSpacing: 1 }}>
                BATTLE STATS
              </div>
            </div>
          </button>
        </div>

        <div style={{ padding: "0 14px 10px", fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: 2 }}>
          CHARACTERS
        </div>

        {CHARACTERS.map(c => {
          const active = activeChar === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onCharChange(c.id)}
              style={{
                width: "100%",
                background: active ? "#161626" : "transparent",
                border: "none",
                borderLeft: `3px solid ${active ? c.color : "transparent"}`,
                padding: "11px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#111120"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: c.color + "22",
                border: `1px solid ${active ? c.color + "66" : c.color + "22"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 900, color: c.color,
                transition: "border-color 0.15s",
              }}>
                {c.name[0]}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#fff" : "#777", transition: "color 0.15s" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 9, color: active ? c.color + "88" : "#333", letterSpacing: 1.5 }}>
                  {c.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
