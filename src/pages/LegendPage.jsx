import { useState, useEffect, useMemo } from "react";

const CHAR_JA = {
  ryu:"リュウ", luke:"ルーク", kimberly:"キンバリー", chunli:"春麗",
  manon:"マノン", zangief:"ザンギエフ", jp:"JP", dhalsim:"ダルシム",
  cammy:"キャミィ", ken:"ケン", deejay:"ディージェイ", lily:"リリー",
  rashid:"ラシード", blanka:"ブランカ", juri:"ジュリ", marisa:"マリーザ",
  guile:"ガイル", ehonda:"E.本田", jamie:"ジェイミー",
  gouki:"豪鬼", akuma:"豪鬼",
  bison:"ベガ", mbison:"ベガ",
  ed:"エド", terry:"テリー", mai:"マイ", elena:"エレナ",
  alex:"アレックス",
  aki:"A.K.I.", sagat:"サガット", cviper:"C・ヴァイパー", ingrid:"イングリッド",
};
function toJa(tool, eng) { return CHAR_JA[tool?.toLowerCase()] ?? eng ?? tool ?? "?"; }

const MAX_PAGES = 20; // 最大500人分（25人/ページ × 20ページ）

async function fetchRankingPage(page) {
  const res = await fetch(`/api/ranking?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const CARD = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10 };

export default function LegendPage() {
  const [players, setPlayers]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const [fetched, setFetched]   = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 1 });

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    setPlayers([]);
    setProgress({ done: 0, total: 1 });

    try {
      const first = await fetchRankingPage(1);
      const totalPages = Math.min(first.total_page ?? 1, MAX_PAGES);
      setProgress({ done: 1, total: totalPages });

      const all = [...(first.list ?? [])];

      // 残りを並列取得（4並列ずつ）
      const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const CHUNK = 4;
      for (let i = 0; i < remaining.length; i += CHUNK) {
        const chunk = remaining.slice(i, i + CHUNK);
        const results = await Promise.all(chunk.map(fetchRankingPage));
        for (const r of results) all.push(...(r.list ?? []));
        setProgress({ done: 1 + i + chunk.length, total: totalPages });
      }

      setPlayers(all);
      setFetched(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // キャラ別集計
  const charCounts = useMemo(() => {
    const map = {};
    for (const p of players) {
      const tool = p.character_tool_name?.toLowerCase() ?? "";
      const name = toJa(tool, p.character_name);
      const key  = name || tool || "?";
      map[key] = (map[key] ?? 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [players]);

  const maxCount = charCounts[0]?.count ?? 1;
  const total    = players.length;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", letterSpacing: 1 }}>
            LEGEND キャラ分布
          </div>
          <div style={{ fontSize: 11, color: "var(--text-5)", marginTop: 2 }}>
            Buckler ランキング上位 {total > 0 ? `${total}人` : ""}のキャラ使用数
          </div>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          style={{
            marginLeft: "auto",
            padding: "8px 22px", borderRadius: 7, fontSize: 12,
            cursor: loading ? "default" : "pointer",
            background: loading ? "transparent" : "#ff6b2b22",
            border: `1px solid ${loading ? "var(--border)" : "#ff6b2b"}`,
            color: loading ? "var(--text-5)" : "#ff6b2b",
            fontWeight: 700, transition: "all 0.15s",
          }}
        >
          {loading ? "取得中…" : fetched ? "再取得" : "取得"}
        </button>
      </div>

      {/* プログレス */}
      {loading && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-5)", marginBottom: 4 }}>
            <span>ランキングデータを取得中...</span>
            <span>{progress.done} / {progress.total} ページ</span>
          </div>
          <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "#ff6b2b",
              width: `${(progress.done / progress.total) * 100}%`,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "#2d0e0e", border: "1px solid #e74c3c", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#e74c3c" }}>
          <strong>エラー: </strong>{error}
        </div>
      )}

      {!fetched && !loading && (
        <div style={{ ...CARD, padding: "48px 0", textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
          「取得」を押してランキングデータを取得してください
        </div>
      )}

      {/* キャラ棒グラフ */}
      {charCounts.length > 0 && (
        <div style={{ ...CARD, padding: "20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {charCounts.map(({ name, count }, i) => {
              const pct = (count / maxCount) * 100;
              const sharePct = total > 0 ? (count / total * 100).toFixed(1) : "0.0";
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* 順位 */}
                  <div style={{ width: 24, textAlign: "right", fontSize: 11, color: "var(--text-5)", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  {/* キャラ名 */}
                  <div style={{ width: 90, fontSize: 12, fontWeight: i < 3 ? 700 : 400, color: i < 3 ? "var(--text)" : "var(--text-3)", flexShrink: 0 }}>
                    {name}
                  </div>
                  {/* バー */}
                  <div style={{ flex: 1, position: "relative", height: 22 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${pct}%`,
                      background: i === 0 ? "#ff6b2b" : i === 1 ? "#f59e0b" : i === 2 ? "#3b82f6" : "var(--bg-hover)",
                      borderRadius: 4,
                      opacity: i < 3 ? 0.85 : 0.5,
                      minWidth: count > 0 ? 4 : 0,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  {/* 人数 */}
                  <div style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 700, color: "var(--text-2)", flexShrink: 0 }}>
                    {count}
                  </div>
                  {/* 割合 */}
                  <div style={{ width: 44, textAlign: "right", fontSize: 11, color: "var(--text-5)", flexShrink: 0 }}>
                    {sharePct}%
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", gap: 24, fontSize: 11, color: "var(--text-5)" }}>
            <span>合計: <strong style={{ color: "var(--text-2)" }}>{total}人</strong></span>
            <span>キャラ数: <strong style={{ color: "var(--text-2)" }}>{charCounts.length}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
