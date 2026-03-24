export default function ModeToggle({ mode, onChange, color = "#ff6b2b" }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
      {["classic", "modern"].map(m => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            style={{
              background: active ? "var(--bg-elevated)" : "transparent",
              border: `1px solid ${active ? color + "66" : "var(--border)"}`,
              borderRadius: 6,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              color: active ? color : "var(--text-4)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {m === "classic" ? "🕹️ クラシック" : "⚡ モダン"}
          </button>
        );
      })}
    </div>
  );
}
