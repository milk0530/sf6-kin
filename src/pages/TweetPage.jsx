import { useState, useEffect, useRef } from "react";
import { useTweets } from "../hooks/useTweets";

function getTweetId(url) {
  return url?.match(/status\/(\d+)/)?.[1] ?? null;
}

function tagColor(tag) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360},60%,58%)`;
}

function parseTags(str) {
  return str ? str.split(/[,\s]+/).map(t => t.trim()).filter(Boolean) : [];
}

// ── iframe 埋め込み ──────────────────────────────────────────
const EMBED_W = 400;

function TweetEmbed({ url }) {
  const id = getTweetId(url);
  const iframeRef = useRef();
  const [height, setHeight] = useState(700);

  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== "https://platform.twitter.com") return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const h =
          d?.height ??
          d?.message?.height ??
          d?.["twttr.embed"]?.height ??
          d?.params?.[0]?.height ??
          d?.params?.[1]?.height ??
          (Array.isArray(d?.params) && d.params.find(p => p?.height)?.height);
        if (h && h > 100) setHeight(h + 32);
      } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!id) return (
    <div style={{ padding: "10px 14px" }}>
      <a href={url} target="_blank" rel="noreferrer"
        style={{ fontSize: 12, color: "var(--text-4)", wordBreak: "break-all" }}>{url}</a>
    </div>
  );

  return (
    <div style={{ padding: "0 5px 8px" }}>
      <iframe
        ref={iframeRef}
        key={id}
        src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true&theme=dark&lang=ja&width=${EMBED_W}`}
        width="100%"
        height={height}
        style={{ border: "none", display: "block", borderRadius: 10 }}
        scrolling="no"
        title={`tweet-${id}`}
        allowFullScreen
      />
    </div>
  );
}

// ── タグチップ ───────────────────────────────────────────────
function Tag({ label }) {
  const c = tagColor(label);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
      background: c + "1a", color: c, letterSpacing: 0.2,
    }}>
      <span style={{ opacity: 0.7, fontSize: 9 }}>#</span>{label}
    </span>
  );
}

// ── インライン編集フォーム ────────────────────────────────────
function EditForm({ tweet, onSave, onCancel }) {
  const [tags, setTags] = useState(tweet.tags ?? "");
  const [note, setNote] = useState(tweet.note ?? "");
  const [busy, setBusy] = useState(false);

  const INPUT = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text)", fontSize: 12, padding: "6px 10px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };

  const handleSave = async () => {
    setBusy(true);
    await onSave(tweet.id, { tags: tags.trim(), note: note.trim() });
    setBusy(false);
  };

  return (
    <div style={{ padding: "10px 12px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <div style={{ fontSize: 10, color: "var(--text-5)", marginBottom: 3 }}>タグ</div>
        <input style={INPUT} value={tags} onChange={e => setTags(e.target.value)} placeholder="コンボ 起き攻め SA2始動" />
        {tags && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
            {parseTags(tags).map(t => <Tag key={t} label={t} />)}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 10, color: "var(--text-5)", marginBottom: 3 }}>メモ</div>
        <input style={INPUT} value={note} onChange={e => setNote(e.target.value)} placeholder="メモ（任意）" />
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)", fontFamily: "inherit" }}>
          キャンセル
        </button>
        <button onClick={handleSave} disabled={busy} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-sub)", fontWeight: 700, fontFamily: "inherit" }}>
          {busy ? "保存中…" : "保存"}
        </button>
      </div>
    </div>
  );
}

// ── ツイートカード ────────────────────────────────────────────
function TweetCard({ tweet, onDelete, onUpdate }) {
  const [mode, setMode] = useState("view"); // "view" | "edit" | "delete"
  const tags = parseTags(tweet.tags);
  const accentColor = tags.length > 0 ? tagColor(tags[0]) : "#555";

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      overflow: "hidden",
      borderTop: `2px solid ${accentColor}55`,
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: "8px 4px 7px",
        background: `linear-gradient(135deg, ${accentColor}0d 0%, transparent 60%)`,
        display: "flex", alignItems: "flex-start", gap: 8,
      }}>
        {/* 左: タグ・メモ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
          {tags.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {tags.map(t => <Tag key={t} label={t} />)}
            </div>
          ) : (
            <span style={{ fontSize: 10, color: "var(--text-6)", fontStyle: "italic" }}>タグなし</span>
          )}
          {tweet.note && (
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0, lineHeight: 1.65 }}>{tweet.note}</p>
          )}
        </div>

        {/* 右: アクションボタン */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
          {mode === "view" && (
            <>
              <button onClick={() => setMode("edit")} style={{
                fontSize: 10, padding: "3px 9px", borderRadius: 6, cursor: "pointer",
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text-4)", fontFamily: "inherit",
              }}>編集</button>
              <button onClick={() => setMode("delete")} style={{
                background: "none", border: "none", color: "var(--text-5)",
                cursor: "pointer", fontSize: 15, padding: "0 2px", lineHeight: 1,
              }}>×</button>
            </>
          )}
          {mode === "delete" && (
            <>
              <button onClick={() => onDelete(tweet.id)} style={{ fontSize: 10, cursor: "pointer", padding: "3px 9px", borderRadius: 6, background: "#e74c3c18", border: "1px solid #e74c3c44", color: "#e74c3c", fontFamily: "inherit" }}>削除</button>
              <button onClick={() => setMode("view")} style={{ fontSize: 10, cursor: "pointer", padding: "3px 9px", borderRadius: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)", fontFamily: "inherit" }}>戻る</button>
            </>
          )}
          {mode === "edit" && (
            <span style={{ fontSize: 10, color: "var(--text-4)" }}>編集中</span>
          )}
        </div>
      </div>

      {/* 編集フォーム */}
      {mode === "edit" && (
        <EditForm
          tweet={tweet}
          onSave={async (id, row) => { await onUpdate(id, row); setMode("view"); }}
          onCancel={() => setMode("view")}
        />
      )}

      <TweetEmbed url={tweet.url} />
    </div>
  );
}

// ── 追加フォーム ─────────────────────────────────────────────
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
              {parseTags(tags).map(t => <Tag key={t} label={t} />)}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 3 }}>メモ <span style={{ fontSize: 9, color: "var(--text-5)" }}>任意</span></div>
          <input style={INPUT} value={note} onChange={e => setNote(e.target.value)} placeholder="このポストについてのメモ" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)", fontFamily: "inherit" }}>
          キャンセル
        </button>
        <button onClick={handleAdd} disabled={busy} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700, fontFamily: "inherit" }}>
          {busy ? "保存中…" : "保存"}
        </button>
      </div>
    </div>
  );
}

// ── ページ本体 ───────────────────────────────────────────────
export default function TweetPage({ char }) {
  const color = char?.color ?? "#ff6b2b";
  const { tweets, loading, add, remove, update } = useTweets(char.id);
  const [showForm, setShowForm] = useState(false);
  const [filterTag, setFilterTag] = useState(null);

  const allTags = [...new Set(tweets.flatMap(t => parseTags(t.tags)))];
  const filtered = filterTag
    ? tweets.filter(t => parseTags(t.tags).includes(filterTag))
    : tweets;

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-5)" }}>{tweets.length} 件保存済み</div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: color + "22", border: `1px solid ${color}55`, color, fontWeight: 700, fontFamily: "inherit",
          }}>+ ポストを保存</button>
        )}
      </div>

      {showForm && <AddForm color={color} onAdd={add} onClose={() => setShowForm(false)} />}

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          <button onClick={() => setFilterTag(null)} style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 20, cursor: "pointer",
            background: !filterTag ? "var(--bg-elevated)" : "transparent",
            border: `1px solid ${!filterTag ? "var(--border)" : "var(--border-sub)"}`,
            color: !filterTag ? "var(--text-sub)" : "var(--text-4)",
            fontWeight: !filterTag ? 700 : 400, fontFamily: "inherit",
          }}>すべて</button>
          {allTags.map(t => {
            const c = tagColor(t);
            const active = filterTag === t;
            return (
              <button key={t} onClick={() => setFilterTag(prev => prev === t ? null : t)} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20, cursor: "pointer",
                background: active ? c + "22" : "transparent",
                border: `1px solid ${active ? c + "66" : c + "44"}`,
                color: c, fontWeight: active ? 700 : 400, fontFamily: "inherit",
              }}>{t}</button>
            );
          })}
        </div>
      )}

      {/* 一覧 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>読み込み中…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>
          {filterTag ? `「${filterTag}」タグのポストはありません` : "まだ保存されたポストがありません"}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 420px))", gap: 14, alignItems: "start" }}>
          {filtered.map(t => (
            <TweetCard key={t.id} tweet={t} onDelete={remove} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  );
}
