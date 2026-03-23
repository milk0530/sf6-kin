import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

const OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  zIndex: 1000, overflowY: "auto", padding: "32px 16px",
};
const MODAL = {
  background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 14,
  padding: "28px 28px 24px", width: "100%", boxSizing: "border-box",
  display: "flex", flexDirection: "column", gap: 16,
};
const MODAL_FIXED = {
  ...MODAL, width: 560, maxWidth: "100%", flexShrink: 0,
};
const INPUT = {
  width: "100%", background: "#0e0e16", border: "1px solid #2a2a3e",
  borderRadius: 6, color: "#e8e8f0", fontSize: 12, padding: "8px 10px",
  outline: "none", boxSizing: "border-box",
};
const LABEL = { fontSize: 11, color: "#666", marginBottom: 4, display: "block" };

function Field({ label, required, children }) {
  return (
    <div>
      <label style={LABEL}>{label}{required && <span style={{ color: "#e74c3c" }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function ComboPostForm({ initialValues, color = "#ff6b2b", onSubmit, onClose, asModal = false }) {
  const iv = initialValues ?? {};
  const [values, setValues] = useState({
    route: iv.route ?? "", title: iv.title ?? "", damage: iv.damage ?? "",
    tags: iv.tags ?? "", starter: iv.starter ?? "", down: iv.down ?? "",
    drive: iv.drive ?? "", sa: iv.sa ?? "", note: iv.note ?? "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(iv.media_url ?? null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setValues(p => ({ ...p, [k]: v }));

  const handleFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = e => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!values.route.trim()) return;
    setSubmitting(true);

    let media_url = iv.media_url ?? null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { data: uploaded } = await supabase.storage
        .from("combo-media")
        .upload(path, file, { upsert: true });
      if (uploaded) {
        const { data: { publicUrl } } = supabase.storage
          .from("combo-media")
          .getPublicUrl(uploaded.path);
        media_url = publicUrl;
      }
    }

    await onSubmit({ ...values, media_url });
    setSubmitting(false);
    onClose();
  };

  const isVideo = preview && (preview.includes(".mp4") || preview.includes(".webm") || file?.type?.startsWith("video"));

  const inner = (
    <div style={asModal ? MODAL_FIXED : MODAL}>
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>
            {initialValues ? "コンボを編集" : "コンボを投稿"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* レシピ */}
          <Field label="レシピ" required>
            <textarea
              style={{ ...INPUT, minHeight: 60, resize: "vertical" }}
              value={values.route}
              onChange={e => set("route", e.target.value)}
              placeholder="例: 2MK > 236LP > 623HP"
            />
          </Field>

          {/* タイトル / ダメージ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="タイトル">
              <input style={INPUT} value={values.title} onChange={e => set("title", e.target.value)} placeholder="例: 基本BnBコンボ" />
            </Field>
            <Field label="ダメージ">
              <input style={INPUT} value={values.damage} onChange={e => set("damage", e.target.value)} placeholder="例: 3200" />
            </Field>
          </div>

          {/* タグ / 始動技 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="タグ（カンマ区切り）">
              <input style={INPUT} value={values.tags} onChange={e => set("tags", e.target.value)} placeholder="例: 基本, 画面端" />
            </Field>
            <Field label="始動技">
              <input style={INPUT} value={values.starter} onChange={e => set("starter", e.target.value)} placeholder="例: 2MK" />
            </Field>
          </div>

          {/* ダウンF / ドライブ / SA */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="ダウンF">
              <input style={INPUT} value={values.down} onChange={e => set("down", e.target.value)} placeholder="例: 26F" />
            </Field>
            <Field label="ドライブ">
              <input style={INPUT} value={values.drive} onChange={e => set("drive", e.target.value)} placeholder="例: 2本" />
            </Field>
            <Field label="SA">
              <input style={INPUT} value={values.sa} onChange={e => set("sa", e.target.value)} placeholder="例: SA1" />
            </Field>
          </div>

          {/* 説明/メモ */}
          <Field label="説明 / メモ">
            <textarea
              style={{ ...INPUT, minHeight: 72, resize: "vertical" }}
              value={values.note}
              onChange={e => set("note", e.target.value)}
              placeholder="コンボの補足説明があれば"
            />
          </Field>

          {/* メディア */}
          <Field label="メディア（動画 / 画像）">
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                border: "1.5px dashed #2a2a3e", borderRadius: 8,
                background: "#0e0e16", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: 100, gap: 6, padding: 12,
                transition: "border-color 0.15s",
              }}
            >
              {preview ? (
                isVideo
                  ? <video src={preview} style={{ maxHeight: 120, maxWidth: "100%", borderRadius: 6 }} controls />
                  : <img src={preview} style={{ maxHeight: 120, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }} alt="preview" />
              ) : (
                <>
                  <span style={{ fontSize: 22, color: "#2a2a3e" }}>↑</span>
                  <span style={{ fontSize: 12, color: "#555" }}>ドラッグ&ドロップ または クリックで選択</span>
                  <span style={{ fontSize: 10, color: "#333" }}>動画: MP4, WebM（最大50MB）/ 画像: JPG, PNG, GIF, WebP（最大5MB）</span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm,image/jpeg,image/png,image/gif,image/webp"
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </Field>

          {/* ボタン */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button" onClick={onClose}
              style={{
                padding: "7px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: "transparent", border: "1px solid #2a2a3e", color: "#555",
              }}
            >キャンセル</button>
            <button
              type="submit" disabled={submitting}
              style={{
                padding: "7px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: color + "22", border: `1px solid ${color}`,
                color, fontWeight: 700,
              }}
            >{submitting ? "送信中…" : "投稿"}</button>
          </div>
        </form>
      </div>
  );

  if (asModal) {
    return (
      <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
        {inner}
      </div>
    );
  }
  return inner;
}
