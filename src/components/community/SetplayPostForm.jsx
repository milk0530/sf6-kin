import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

const FORM = {
  background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 14,
  padding: "24px 24px 20px", width: "100%", boxSizing: "border-box",
  display: "flex", flexDirection: "column", gap: 14,
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

export default function SetplayPostForm({ initialValues, color = "#ff6b2b", onSubmit, onClose }) {
  const iv = initialValues ?? {};
  const [values, setValues] = useState({
    situation: iv.situation ?? "",
    title:     iv.title     ?? "",
    steps:     iv.steps     ?? "",
    damage:    iv.damage    ?? "",
    note:      iv.note      ?? "",
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
    if (!values.situation.trim() || !values.title.trim() || !values.steps.trim()) return;
    setSubmitting(true);

    let media_url = iv.media_url ?? null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `sp-${Date.now()}.${ext}`;
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

  return (
    <div style={FORM}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>
          {initialValues ? "セットプレイを編集" : "セットプレイを投稿"}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>×</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 状況 / タイトル */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="状況" required>
            <input style={INPUT} value={values.situation} onChange={e => set("situation", e.target.value)} placeholder="例: +4有利, ダウン後" />
          </Field>
          <Field label="タイトル" required>
            <input style={INPUT} value={values.title} onChange={e => set("title", e.target.value)} placeholder="例: 重ね択" />
          </Field>
        </div>

        {/* 内容 */}
        <Field label="内容 / 手順" required>
          <textarea
            style={{ ...INPUT, minHeight: 80, resize: "vertical" }}
            value={values.steps}
            onChange={e => set("steps", e.target.value)}
            placeholder="手順を記入…"
          />
        </Field>

        {/* ダメージ / メモ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
          <Field label="ダメージ">
            <input style={INPUT} value={values.damage} onChange={e => set("damage", e.target.value)} placeholder="例: 2800" />
          </Field>
          <Field label="メモ">
            <input style={INPUT} value={values.note} onChange={e => set("note", e.target.value)} placeholder="補足など" />
          </Field>
        </div>

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
              justifyContent: "center", minHeight: 80, gap: 6, padding: 12,
            }}
          >
            {preview ? (
              isVideo
                ? <video src={preview} style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6 }} controls />
                : <img src={preview} style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }} alt="preview" />
            ) : (
              <>
                <span style={{ fontSize: 20, color: "#2a2a3e" }}>↑</span>
                <span style={{ fontSize: 12, color: "#555" }}>ドラッグ&ドロップ または クリックで選択</span>
                <span style={{ fontSize: 10, color: "#333" }}>動画: MP4, WebM / 画像: JPG, PNG, GIF, WebP</span>
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

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
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
              background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700,
            }}
          >{submitting ? "送信中…" : "投稿"}</button>
        </div>
      </form>
    </div>
  );
}
