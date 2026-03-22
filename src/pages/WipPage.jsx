export default function WipPage({ char }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: 320, gap: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
        {char.name} は準備中です
      </div>
      <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
        現在コンテンツを作成中です。<br />
        しばらくお待ちください。
      </div>
      <div style={{
        fontSize: 11, padding: "6px 16px", borderRadius: 6,
        background: char.color + "18", border: `1px solid ${char.color}44`,
        color: char.color, marginTop: 8,
      }}>
        COMING SOON
      </div>
    </div>
  );
}
