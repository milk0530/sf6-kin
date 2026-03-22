export default function Header({ char, sidebarOpen, onToggleSidebar }) {
  return (
    <header style={{
      background: "#13131f",
      borderBottom: "1px solid #2a2a3e",
      padding: "0 16px",
      height: 50,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          background: "transparent",
          border: "1px solid #2a2a3e",
          borderRadius: 6,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#555", fontSize: 11,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1e1e2e"; e.currentTarget.style.color = char.color; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      <span style={{ fontWeight: 900, fontSize: 16, color: char.color, letterSpacing: 1, whiteSpace: "nowrap" }}>
        🚬 喫煙所
      </span>
      <span style={{
        fontSize: 11, color: char.color, fontWeight: 700,
        background: char.color + "18", border: `1px solid ${char.color}44`,
        borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap",
      }}>
        SF6支部
      </span>

      <span style={{ fontSize: 11, color: "#2a2a3e", marginLeft: "auto", whiteSpace: "nowrap" }}>
        by ミルク
      </span>
    </header>
  );
}
