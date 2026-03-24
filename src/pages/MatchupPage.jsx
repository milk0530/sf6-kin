import { useState } from "react";
import { useArticle } from "../hooks/useArticle";
import ArticleRenderer from "../components/article/ArticleRenderer";
import ArticleEditor from "../components/article/ArticleEditor";

const SF6_CHARS = [
  // ── ベースロスター (18) ──────────────────────────────────
  { tool: "ryu",      name: "リュウ",       color: "#c0392b" },
  { tool: "luke",     name: "ルーク",       color: "#e67e22" },
  { tool: "jamie",    name: "ジェイミー",   color: "#8e44ad" },
  { tool: "chunli",   name: "春麗",         color: "#2980b9" },
  { tool: "guile",    name: "ガイル",       color: "#1abc9c" },
  { tool: "kimberly", name: "キンバリー",   color: "#d35400" },
  { tool: "juri",     name: "ジュリ",       color: "#9b59b6" },
  { tool: "ken",      name: "ケン",         color: "#e74c3c" },
  { tool: "blanka",   name: "ブランカ",     color: "#27ae60" },
  { tool: "dhalsim",  name: "ダルシム",     color: "#f39c12" },
  { tool: "ehonda",   name: "E.本田",       color: "#2980b9" },
  { tool: "deejay",   name: "DJ",           color: "#f1c40f" },
  { tool: "manon",    name: "マノン",       color: "#af7ac5" },
  { tool: "marisa",   name: "マリーザ",     color: "#c9a227" },
  { tool: "jp",       name: "JP",           color: "#1abc9c" },
  { tool: "zangief",  name: "ザンギエフ",   color: "#e74c3c" },
  { tool: "lily",     name: "リリー",       color: "#e91e63" },
  { tool: "cammy",    name: "キャミィ",     color: "#27ae60" },
  // ── Year 1 DLC (4) ──────────────────────────────────────
  { tool: "rashid",   name: "ラシード",     color: "#3498db" },
  { tool: "aki",      name: "A.K.I.",       color: "#5aad5a" },
  { tool: "ed",       name: "エド",         color: "#3498db" },
  { tool: "gouki",    name: "豪鬼",         color: "#c0392b" },
  // ── Year 2 DLC (4) ──────────────────────────────────────
  { tool: "bison",    name: "ベガ",         color: "#6c3483" },
  { tool: "terry",    name: "テリー",       color: "#e67e22" },
  { tool: "mai",      name: "マイ",         color: "#e74c3c" },
  { tool: "elena",    name: "エレナ",       color: "#2980b9" },
  // ── Year 3 DLC (4) ──────────────────────────────────────
  { tool: "sagat",    name: "サガット",      color: "#d4870a" },
  { tool: "cviper",   name: "C・ヴァイパー", color: "#c0392b" },
  { tool: "alex",     name: "アレックス",    color: "#1abc9c" },
  { tool: "ingrid",   name: "イングリッド",  color: "#f1c40f" },
];

// キャラ選択グリッド
function CharSelectGrid({ onSelect, myColor }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: 10,
    }}>
      {SF6_CHARS.map(c => (
        <button
          key={c.tool}
          onClick={() => onSelect(c)}
          style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "14px 8px 10px",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            transition: "all 0.12s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = c.color + "18";
            e.currentTarget.style.borderColor = c.color + "66";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "var(--bg-surface)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: c.color + "22", border: `1px solid ${c.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: c.color,
            overflow: "hidden",
          }}>
            <img
              src={`/chara/${c.tool}.png`}
              width={44} height={44}
              draggable={false}
              style={{ objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
            />
            <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
              {c.name[0]}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.3, textAlign: "center" }}>
            {c.name}
          </div>
        </button>
      ))}
    </div>
  );
}

// 選択後の対策ページ
function MatchupDetail({ myCharId, opp, myColor, onBack }) {
  const [editing, setEditing] = useState(false);
  const articleKey = `${myCharId}_vs_${opp.tool}`;
  const { article, loading, save } = useArticle(articleKey);

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            fontSize: 12, color: "var(--text-4)", fontFamily: "inherit",
          }}
        >← 戻る</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: opp.color + "22", border: `1px solid ${opp.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: opp.color,
            overflow: "hidden",
          }}>
            <img
              src={`/chara/${opp.tool}.png`}
              width={36} height={36}
              draggable={false}
              style={{ objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
            />
            <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
              {opp.name[0]}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{opp.name}</div>
            <div style={{ fontSize: 10, color: "var(--text-6)", letterSpacing: 2 }}>vs {opp.tool.toUpperCase()}</div>
          </div>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: "transparent", border: "1px solid var(--border)", color: "var(--text-4)",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 11 }}>✏</span> 編集する
          </button>
        )}
      </div>

      {/* エディタ */}
      {editing && (
        <ArticleEditor
          article={article}
          color={opp.color}
          onSave={save}
          onClose={() => setEditing(false)}
        />
      )}

      {/* 記事表示 */}
      {loading ? (
        <div style={{ color: "var(--text-6)", fontSize: 12, padding: "48px 0", textAlign: "center" }}>読み込み中…</div>
      ) : (
        <ArticleRenderer article={article} color={opp.color} />
      )}
    </div>
  );
}

export default function MatchupPage({ char }) {
  const [selected, setSelected] = useState(null);
  const color = char?.color ?? "#ff6b2b";

  if (selected) {
    return (
      <MatchupDetail
        myCharId={char.id}
        opp={selected}
        myColor={color}
        onBack={() => setSelected(null)}
      />
    );
  }

  return <CharSelectGrid onSelect={setSelected} myColor={color} />;
}
