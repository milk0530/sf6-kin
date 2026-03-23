import { useState } from "react";
import ArticleRenderer from "../components/article/ArticleRenderer";
import ArticleEditor from "../components/article/ArticleEditor";
import { useArticle } from "../hooks/useArticle";

export default function MovePage({ data, char }) {
  const [editing, setEditing] = useState(false);
  const color = char?.color ?? "#ff6b2b";
  const { article, loading, save } = useArticle(char.id);

  return (
    <div>
      {/* 編集ボタン */}
      {!editing && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: "transparent", border: "1px solid #2a2a3e", color: "#555",
            }}
          >
            <span style={{ fontSize: 11 }}>✏</span> 編集する
          </button>
        </div>
      )}

      {/* エディタ */}
      {editing && (
        <ArticleEditor
          article={article}
          color={color}
          onSave={save}
          onClose={() => setEditing(false)}
        />
      )}

      {/* 記事表示 */}
      {loading ? (
        <div style={{ color: "#333", fontSize: 12, padding: "48px 0", textAlign: "center" }}>読み込み中…</div>
      ) : (
        <ArticleRenderer article={article} color={color} />
      )}
    </div>
  );
}
