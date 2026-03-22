import { TABS } from "../data";

export default function CharHeader({ char, activeTab, onTabChange }) {
  return (
    <>
      {/* キャラクター名 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
        <div style={{
          width: 58, height: 58, borderRadius: 14, flexShrink: 0,
          background: char.color + "22", border: `2px solid ${char.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 900, color: char.color,
        }}>
          {char.name[0]}
        </div>
        <div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>{char.name}</div>
          <div style={{ fontSize: 10, color: char.color + "66", letterSpacing: 4 }}>{char.sub}</div>
        </div>
      </div>

      {/* タブ */}
      <div style={{ display: "flex", borderBottom: "1px solid #2a2a3e", marginBottom: 22, overflowX: "auto" }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "none", border: "none",
                padding: "9px 13px", fontSize: 12,
                color: active ? char.color : "#555",
                cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: active ? `2px solid ${char.color}` : "2px solid transparent",
                marginBottom: -1,
                fontFamily: "inherit",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#888"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#555"; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
