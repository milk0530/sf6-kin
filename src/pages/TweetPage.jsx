import { useState, useEffect, useRef } from "react";
import { useTweets } from "../hooks/useTweets";

// Twitter widget script を一度だけロード
function loadTwitterScript(cb) {
  if (window.twttr?.widgets) { cb(); return; }
  if (!document.getElementById("twitter-wjs")) {
    const s = document.createElement("script");
    s.id = "twitter-wjs";
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = cb;
    document.body.appendChild(s);
  } else {
    const wait = setInterval(() => {
      if (window.twttr?.widgets) { clearInterval(wait); cb(); }
    }, 200);
  }
}

// タグ名から色を生成
function tagColor(tag) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) & 0xffffff;
  const hue = h % 360;
  return `hsl(${hue},55%,55%)`;
}

function parseTags(str) {
  return str ? str.split(/[,\s]+/).map(t => t.trim()).filter(Boolean) : [];
}

// ツイート埋め込みカード
function TweetCard({ tweet, color, onDelete }) {
  const ref = useRef();
  const [confirmed, setConfirmed] = useState(false);
  const tags = parseTags(tweet.tags);

  useEffect(() => {
    loadTwitterScript(() => {
      if (ref.current) window.twttr?.widgets?.load(ref.current);
    });
  }, [tweet.url]);

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "14px 16px",
    }}>
      {/* ヘッダー行 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* タグ */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
              {tags.map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 7px",
                  borderRadius: 10, background: tagColor(t) + "22",
                  border: `1px solid ${tagColor(t)}55`, color: tagColor(t),
                }}>{t}</span>
              ))}
            </div>
          )}
          {/* メモ */}
          {tweet.note && (
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0, lineHeight: 1.6 }}>{tweet.note}</p>
          )}
        </div>
        {/* 削除ボタン */}
        {!confirmed ? (
          <button
            onClick={() => setConfirmed(true)}
            style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer", fontSize: 14, flexShrink: 0, padding: 2 }}
          >×</button>
        ) : (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button onClick={() => onDelete(tweet.id)} style={{ fontSize: 10, cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "#e74c3c22", border: "1px solid #e74c3c55", color: "#e74c3c" }}>削除</button>
            <button onClick={() => setConfirmed(false)} style={{ fontSize: 10, cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)" }}>戻る</button>
          </div>
        )}
      </div>

      {/* Twitter 埋め込み */}
      <div ref={ref} style={{ maxWidth: 550 }}>
        <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
          <a href={tweet.url}></a>
        </blockquote>
      </div>
    </div>
  );
}

// 投稿フォーム
function AddForm({ color, onAdd, onClose }) {
  const [url,  setUrl]  = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  const INPUT = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text)", fontSize: 12, padding: "7px 10px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };

  const handleAdd = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setErr("URLを入力してください"); return; }
    if (!/x\.com|twitter\.com/.test(trimmed)) { setErr("X (Twitter) のURLを入力してください"); return; }
    setBusy(true);
    await onAdd({ url: trimmed, tags: tags.trim(), note: note.trim() });
    setBusy(false);
    onClose();
  };

  return (
    <div style={{
      background: "var(--bg-surface)", border: `1px solid ${color}44`,
      borderRadius: 12, padding: "18px 20px", marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>ポストを保存</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 3 }}>X (Twitter) の URL <span style={{ color: "#e74c3c" }}>*</span></div>
          <input style={INPUT} value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://x.com/user/status/..." />
          {err && <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 3 }}>{err}</div>}
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 3 }}>タグ <span style={{ fontSize: 9, color: "var(--text-5)" }}>スペースまたはカンマ区切り</span></div>
          <input style={INPUT} value={tags} onChange={e => setTags(e.target.value)} placeholder="コンボ 起き攻め SA2始動" />
          {tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
              {parseTags(tags).map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10,
                  background: tagColor(t) + "22", border: `1px solid ${tagColor(t)}55`, color: tagColor(t),
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 3 }}>メモ <span style={{ fontSize: 9, color: "var(--text-5)" }}>任意</span></div>
          <input style={INPUT} value={note} onChange={e => setNote(e.target.value)} placeholder="このポストについてのメモ" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)" }}>
          キャンセル
        </button>
        <button onClick={handleAdd} disabled={busy} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700 }}>
          {busy ? "保存中…" : "保存"}
        </button>
      </div>
    </div>
  );
}

export default function TweetPage({ char }) {
  const color = char?.color ?? "#ff6b2b";
  const { tweets, loading, add, remove } = useTweets(char.id);
  const [showForm, setShowForm] = useState(false);
  const [filterTag, setFilterTag] = useState(null);

  // 全タグ集計
  const allTags = [...new Set(tweets.flatMap(t => parseTags(t.tags)))];

  const filtered = filterTag
    ? tweets.filter(t => parseTags(t.tags).includes(filterTag))
    : tweets;

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-4)" }}>
            {tweets.length} 件保存済み
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: color + "22", border: `1px solid ${color}55`, color, fontWeight: 700,
            }}
          >
            + ポストを保存
          </button>
        )}
      </div>

      {/* 追加フォーム */}
      {showForm && <AddForm color={color} onAdd={add} onClose={() => setShowForm(false)} />}

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <button
            onClick={() => setFilterTag(null)}
            style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 10, cursor: "pointer",
              background: !filterTag ? "var(--bg-elevated)" : "transparent",
              border: `1px solid ${!filterTag ? "var(--border)" : "var(--border-sub)"}`,
              color: !filterTag ? "var(--text-sub)" : "var(--text-4)",
              fontWeight: !filterTag ? 700 : 400,
            }}
          >すべて</button>
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setFilterTag(prev => prev === t ? null : t)}
              style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 10, cursor: "pointer",
                background: filterTag === t ? tagColor(t) + "22" : "transparent",
                border: `1px solid ${filterTag === t ? tagColor(t) + "88" : tagColor(t) + "44"}`,
                color: tagColor(t), fontWeight: filterTag === t ? 700 : 400,
              }}
            >{t}</button>
          ))}
        </div>
      )}

      {/* ツイート一覧 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>読み込み中…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>
          {filterTag ? `「${filterTag}」タグのポストはありません` : "まだ保存されたポストがありません"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(t => (
            <TweetCard key={t.id} tweet={t} color={color} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
