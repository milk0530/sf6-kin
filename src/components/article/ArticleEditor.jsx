import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import ArticleRenderer from "./ArticleRenderer";
import { useIsMobile } from "../../hooks/useIsMobile";

const INPUT = {
  width: "100%", background: "#0e0e16", border: "1px solid #2a2a3e",
  borderRadius: 6, color: "#e8e8f0", fontSize: 12, padding: "7px 10px",
  outline: "none", boxSizing: "border-box",
};

// ツールバーボタン定義
const TOOLBAR_GROUPS = [
  {
    label: "見出し",
    buttons: [
      { label: "H2",  desc: "大見出し",   insert: (sel) => `\n## ${sel || "見出し"}\n` },
      { label: "H3",  desc: "小見出し",   insert: (sel) => `\n### ${sel || "小見出し"}\n` },
      { label: "H3+コマンド", desc: "コマンド付き見出し", insert: (sel) => `\n### ${sel || "技名"} [コマンド]\n` },
    ],
  },
  {
    label: "テキスト",
    buttons: [
      { label: "太字",     desc: "**テキスト**",  insert: (sel) => `**${sel || "テキスト"}**` },
      { label: "[[cmd]]", desc: "コマンドアイコン", insert: (sel) => `[[${sel || "コマンド"}]]` },
    ],
  },
  {
    label: "挿入",
    buttons: [
      { label: "区切り線", desc: "---",      insert: () => `\n---\n` },
      { label: "空行",    desc: "段落区切り", insert: () => `\n\n` },
      { label: "🖼 画像",  desc: "ファイル選択", isUpload: true },
    ],
  },
];

function ToolbarButton({ btn, onInsert, onUpload, color }) {
  const [hover, setHover] = useState(false);
  if (btn.isUpload) {
    return (
      <button
        onClick={onUpload}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={btn.desc}
        style={{
          padding: "5px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer",
          background: hover ? "#1a1a2e" : "transparent",
          border: "1px solid #2a2a3e", color: "#888",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}
      >
        <span>{btn.label}</span>
        <span style={{ fontSize: 9, color: "#444" }}>{btn.desc}</span>
      </button>
    );
  }
  return (
    <button
      onClick={() => onInsert(btn.insert)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={btn.desc}
      style={{
        padding: "5px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer",
        background: hover ? "#1a1a2e" : "transparent",
        border: "1px solid #2a2a3e", color: "#888",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      }}
    >
      <span style={{ fontWeight: 600 }}>{btn.label}</span>
      <span style={{ fontSize: 9, color: "#444" }}>{btn.desc}</span>
    </button>
  );
}

export default function ArticleEditor({ article, color = "#ff6b2b", onSave, onClose }) {
  const [title,     setTitle]     = useState(article?.title   ?? "");
  const [author,    setAuthor]    = useState(article?.author  ?? "");
  const [content,   setContent]   = useState(article?.content ?? "");
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit");
  const textareaRef = useRef();
  const fileRef     = useRef();
  const isMobile    = useIsMobile();

  const insertAtCursor = (insertFn) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = content.slice(start, end);
    const text  = insertFn(sel);
    const next  = content.slice(0, start) + text + content.slice(end);
    setContent(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleImageUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `article-${Date.now()}.${ext}`;
    const { data: uploaded } = await supabase.storage
      .from("combo-media").upload(path, file, { upsert: true });
    if (uploaded) {
      const { data: { publicUrl } } = supabase.storage
        .from("combo-media").getPublicUrl(uploaded.path);
      const el  = textareaRef.current;
      const pos = el?.selectionStart ?? content.length;
      setContent(c => c.slice(0, pos) + `\n![${publicUrl}]\n` + c.slice(pos));
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ title, author, content });
    setSaving(false);
    onClose();
  };

  const toolbar = (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 10 }}>
      {TOOLBAR_GROUPS.map(group => (
        <div key={group.label}>
          <div style={{ fontSize: 9, color: "#333", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            {group.label}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {group.buttons.map(btn => (
              <ToolbarButton
                key={btn.label}
                btn={uploading && btn.isUpload ? { ...btn, label: "…" } : btn}
                color={color}
                onInsert={insertAtCursor}
                onUpload={() => fileRef.current.click()}
              />
            ))}
          </div>
        </div>
      ))}
      <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );

  const editorPane = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
      {toolbar}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        spellCheck={false}
        placeholder={`自由に書いてください。\n\n## 大見出し\n### 小見出し\n### 技名 [コマンド]\n\n[[コマンド]] でインライン表示\n**太字テキスト**\n![画像URL]\n---（区切り線）`}
        style={{
          ...INPUT, flex: 1, minHeight: isMobile ? 320 : 480,
          resize: "none", fontFamily: "monospace", lineHeight: 1.75, fontSize: 13,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#2a2a3e" }}>{content.length} 文字</span>
      </div>
    </div>
  );

  const previewPane = (
    <div style={{
      flex: 1, minWidth: 0,
      background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 8,
      padding: "20px", overflowY: "auto",
      minHeight: isMobile ? 320 : 480,
    }}>
      <ArticleRenderer article={{ title, author, content }} color={color} />
    </div>
  );

  return (
    <div style={{
      background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 14,
      padding: "24px", display: "flex", flexDirection: "column", gap: 16,
      marginBottom: 24,
    }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>記事を編集</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>×</button>
      </div>

      {/* タイトル / 著者 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>タイトル</div>
          <input style={INPUT} value={title} onChange={e => setTitle(e.target.value)} placeholder="例: 【スト6】キンバリーの使い方" />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>著者</div>
          <input style={INPUT} value={author} onChange={e => setAuthor(e.target.value)} placeholder="ハンドル名" />
        </div>
      </div>

      {/* スマホ: タブ切り替え */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: "1px solid #2a2a3e" }}>
          {[["edit", "編集"], ["preview", "プレビュー"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              style={{
                padding: "6px 16px", fontSize: 12, cursor: "pointer",
                background: "none", border: "none",
                borderBottom: mobileTab === key ? `2px solid ${color}` : "2px solid transparent",
                color: mobileTab === key ? color : "#555",
                fontWeight: mobileTab === key ? 700 : 400, marginBottom: -1,
              }}
            >{label}</button>
          ))}
        </div>
      )}

      {/* エディタ本体 */}
      {isMobile ? (
        mobileTab === "edit" ? editorPane : previewPane
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "flex-start" }}>
          {editorPane}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: 1 }}>プレビュー</div>
            {previewPane}
          </div>
        </div>
      )}

      {/* 保存 */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          style={{ padding: "7px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "transparent", border: "1px solid #2a2a3e", color: "#555" }}
        >キャンセル</button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "7px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700 }}
        >{saving ? "保存中…" : "保存"}</button>
      </div>
    </div>
  );
}
