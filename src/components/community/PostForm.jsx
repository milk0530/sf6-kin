import { useState } from "react";

const OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};
const MODAL = {
  background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 14,
  padding: "28px 28px 24px", width: 480, maxWidth: "90vw",
  display: "flex", flexDirection: "column", gap: 14,
};
const LABEL = { fontSize: 11, color: "var(--text-2)", marginBottom: 4, display: "block" };
const INPUT = {
  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
  borderRadius: 6, color: "var(--text)", fontSize: 12, padding: "7px 10px",
  outline: "none", boxSizing: "border-box",
};
const TEXTAREA = { ...INPUT, resize: "vertical", minHeight: 72 };

function Field({ label, children }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  );
}

/**
 * fields: Array<{ key, label, type?: "text"|"textarea"|"select", options?: string[], required?: bool }>
 */
export default function PostForm({ title, fields, initialValues, onSubmit, onClose, color = "#ff6b2b" }) {
  const initial = Object.fromEntries(fields.map(f => [f.key, initialValues?.[f.key] ?? ""]));
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim()) return;
    }
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MODAL}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-4)", fontSize: 18, cursor: "pointer" }}
          >×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map(f => (
            <Field key={f.key} label={f.label + (f.required ? " *" : "")}>
              {f.type === "textarea" ? (
                <textarea
                  style={TEXTAREA}
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder ?? ""}
                />
              ) : f.type === "select" ? (
                <select
                  style={{ ...INPUT, cursor: "pointer" }}
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                >
                  <option value="">選択…</option>
                  {(f.options ?? []).map(o => (
                    <option key={o} value={o}>{f.optionLabels?.[o] ?? o}</option>
                  ))}
                </select>
              ) : (
                <input
                  style={INPUT}
                  value={values[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder ?? ""}
                />
              )}
            </Field>
          ))}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "7px 18px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)",
              }}
            >キャンセル</button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "7px 18px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: color + "22", border: `1px solid ${color}`,
                color, fontWeight: 700,
              }}
            >{submitting ? "送信中…" : "投稿"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
