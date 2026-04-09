import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

const FORM = {
  background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 14,
  padding: "24px 24px 20px", width: "100%", boxSizing: "border-box",
  display: "flex", flexDirection: "column", gap: 14,
};
const FORM_MODAL_CHILD = {
  ...FORM, borderRadius: "0 0 14px 14px", borderTop: "none",
};
const INPUT = {
  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
  borderRadius: 6, color: "var(--text)", fontSize: 12, padding: "8px 10px",
  outline: "none", boxSizing: "border-box",
};
const LABEL = { fontSize: 11, color: "var(--text-3)", marginBottom: 4, display: "block" };

function Field({ label, required, children }) {
  return (
    <div>
      <label style={LABEL}>{label}{required && <span style={{ color: "#e74c3c" }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function SetplayPostForm({ initialValues, color = "#ff6b2b", onSubmit, onClose, combos = [], defaultComboId = null, asModalChild = false }) {
  const iv = initialValues ?? {};
  const [values, setValues] = useState({
    situation: iv.situation ?? "",
    title:     iv.title     ?? "",
    steps:     iv.steps     ?? "",
    tags:      iv.tags      ?? "",
    note:      iv.note      ?? "",
    combo_id:  iv.combo_id  ?? defaultComboId ?? "",
    // 既存データの互換性のため保持
    damage:    iv.damage    ?? "",
    down:      iv.down      ?? "",
    hit:       iv.hit       ?? "",
    guard:     iv.guard     ?? "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(iv.media_url ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
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
    if (!values.situation.trim() || !values.steps.trim()) return;
    setSubmitting(true);
    setError(null);

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

    try {
      await onSubmit({ ...values, media_url });
      setSubmitting(false);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err.message ?? "投稿に失敗しました");
    }
  };

  const isVideo = preview && (preview.includes(".mp4") || preview.includes(".webm") || file?.type?.startsWith("video"));

  return (
    <div style={asModalChild ? FORM_MODAL_CHILD : FORM}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
          {initialValues ? "起き攻めを編集" : "起き攻めを投稿"}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-4)", fontSize: 18, cursor: "pointer" }}>×</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* コンボ選択（defaultComboIdがない場合のみ表示） */}
        {combos.length > 0 && !defaultComboId && (
          <Field label="紐付けるコンボ（省略可）">
            <select style={INPUT} value={values.combo_id ?? ""} onChange={e => set("combo_id", e.target.value || null)}>
              <option value="">コンボと紐付けない</option>
              {combos.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title || c.route || `コンボ #${c.id.slice(0, 6)}`}
                  {c.starter ? ` (${c.starter})` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}

        {/* 状況 / タイトル */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="状況" required>
            <input style={INPUT} value={values.situation} onChange={e => set("situation", e.target.value)} placeholder="例: 投げ後, 画面端" />
          </Field>
          <Field label="タイトル">
            <input style={INPUT} value={values.title} onChange={e => set("title", e.target.value)} placeholder="例: 重ね択" />
          </Field>
        </div>

        {/* レシピ */}
        <Field label="レシピ / 手順" required>
          <textarea
            style={{ ...INPUT, minHeight: 60, resize: "vertical" }}
            value={values.steps}
            onChange={e => set("steps", e.target.value)}
            placeholder="例: 前ステ > 2MK重ね"
          />
        </Field>

        {/* タグ */}
        <Field label="タグ（カンマ区切り）">
          <input style={INPUT} value={values.tags} onChange={e => set("tags", e.target.value)} placeholder="例: 詐欺重ね, 投げ択" />
        </Field>

        {/* メモ */}
        <Field label="メモ">
          <textarea
            style={{ ...INPUT, minHeight: 52, resize: "vertical" }}
            value={values.note}
            onChange={e => set("note", e.target.value)}
            placeholder="補足があれば"
          />
        </Field>

        {/* メディア */}
        <Field label="メディア（動画 / 画像）">
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: "1.5px dashed var(--border)", borderRadius: 8,
              background: "var(--bg)", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: 72, gap: 6, padding: 12,
            }}
          >
            {preview ? (
              isVideo
                ? <video src={preview} style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6 }} controls />
                : <img src={preview} style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }} alt="preview" />
            ) : (
              <>
                <span style={{ fontSize: 20, color: "var(--border)" }}>↑</span>
                <span style={{ fontSize: 12, color: "var(--text-4)" }}>ドラッグ&ドロップ または クリックで選択</span>
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

        {error && (
          <div style={{ fontSize: 12, color: "#e74c3c", background: "#2a0a0a", border: "1px solid #e74c3c44", borderRadius: 6, padding: "8px 12px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button" onClick={onClose}
            style={{
              padding: "7px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)",
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
