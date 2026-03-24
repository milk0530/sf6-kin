import { useState } from "react";

export default function CommentSection({ color }) {
  const [input, setInput] = useState("");
  const [list, setList] = useState([
    { user: "SF6プレイヤー", text: "参考になりました！実戦で試してみます。", time: "2時間前" },
    { user: "格ゲー初心者",  text: "フレームの見方が分かりやすいです。",   time: "1日前"  },
  ]);

  const handlePost = () => {
    if (!input.trim()) return;
    setList(prev => [...prev, { user: "ゲスト", text: input, time: "たった今" }]);
    setInput("");
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-white)", marginBottom: 12, letterSpacing: 1 }}>
        コメント ({list.length})
      </h2>

      {/* コメント一覧 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {list.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: color + "22", border: `1px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color,
              }}>
                {c.user[0]}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)" }}>{c.user}</span>
              <span style={{ fontSize: 11, color: "var(--text-6)", marginLeft: "auto" }}>{c.time}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>{c.text}</p>
          </div>
        ))}
      </div>

      {/* 投稿フォーム */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="コメントを入力..."
          style={{
            width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "8px 12px", color: "var(--text)",
            fontSize: 12, resize: "vertical", minHeight: 64,
            fontFamily: "inherit", outline: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={handlePost}
            style={{
              background: color, border: "none", borderRadius: 6,
              padding: "6px 18px", color: "#fff", fontSize: 12,
              fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            投稿
          </button>
        </div>
      </div>
    </div>
  );
}
