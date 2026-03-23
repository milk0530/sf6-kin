export default function CommunitySetplayCard({ sp, color, onDelete }) {
  return (
    <div style={{
      background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 10,
      padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0", flex: 1 }}>{sp.title}</span>
        {sp.damage && (
          <span style={{ fontSize: 11, color: "#ff6b2b", fontWeight: 700, flexShrink: 0 }}>{sp.damage}pt</span>
        )}
        <button
          onClick={() => {
            if (window.confirm("このセットプレイを削除しますか？")) onDelete(sp.id);
          }}
          style={{
            background: "none", border: "none", color: "#333", cursor: "pointer",
            fontSize: 13, padding: "0 2px", lineHeight: 1,
          }}
        >✕</button>
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
        {sp.steps}
      </p>
      {sp.note && (
        <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.6 }}>{sp.note}</p>
      )}
    </div>
  );
}
