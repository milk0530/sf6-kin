export default function Header({ char, sidebarOpen, onToggleSidebar, darkMode, onToggleTheme, showHelp, onToggleHelp, defaultMode, onToggleDefaultMode }) {
  return (
    <header style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
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
          border: "1px solid var(--border)",
          borderRadius: 6,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-4)", fontSize: 11,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = char.color; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-4)"; }}
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

      <span style={{ fontSize: 11, color: "var(--text-dim)", whiteSpace: "nowrap", marginLeft: "auto" }}>
        by ミルク
      </span>

      <button
        onClick={onToggleDefaultMode}
        title={`デフォルト入力タイプ: ${defaultMode === "classic" ? "クラシック" : "モダン"}（クリックで切替）`}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          height: 32,
          padding: "0 10px",
          display: "flex", alignItems: "center", gap: 5,
          cursor: "pointer",
          fontSize: 11, fontWeight: 700,
          color: defaultMode === "classic" ? char.color : "#a78bfa",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{ fontSize: 13 }}>{defaultMode === "classic" ? "🕹️" : "⚡"}</span>
        {defaultMode === "classic" ? "C" : "M"}
      </button>

      <button
        onClick={onToggleHelp}
        title="使い方"
        style={{
          background: showHelp ? "var(--bg-hover)" : "transparent",
          border: `1px solid ${showHelp ? "var(--border)" : "var(--border)"}`,
          borderRadius: 6,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: showHelp ? "var(--text)" : "var(--text-4)",
          fontSize: 13, fontWeight: 700,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = showHelp ? "var(--bg-hover)" : "transparent"; }}
      >
        ?
      </button>

      <button
        onClick={onToggleTheme}
        title={darkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 14,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
