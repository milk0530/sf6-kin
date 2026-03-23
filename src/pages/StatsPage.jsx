import { useState, useMemo } from "react";
import { useBattleLog } from "../hooks/useBattleLog";

const CHARS = {
  1: "リュウ", 2: "ルーク", 3: "キンバリー", 4: "春麗",
  5: "マノン", 6: "ザンギエフ", 7: "JP", 8: "ダルシム",
  9: "キャミィ", 10: "ケン", 11: "ディージェイ", 12: "リリー",
  13: "ラシード", 14: "ブランカ", 15: "ユリ", 16: "マリーザ",
  17: "ガイル", 18: "E.本田", 19: "ジェイミー", 20: "豪鬼",
  21: "ベガ", 22: "エド", 23: "テリー", 24: "マイ", 25: "エレナ",
};

const BATTLE_TYPES = { 1: "ランクマ", 2: "カジュアル", 3: "バトルハブ", 6: "カスタム" };

function charName(id) { return CHARS[id] ?? `ID:${id}`; }

function parseBattle(battle, playerId) {
  const pid = String(playerId);
  const p1  = battle.player1_info;
  const p2  = battle.player2_info;
  const myInfo  = String(p1?.player?.fighter_id) === pid ? p1 : p2;
  const oppInfo = String(p1?.player?.fighter_id) === pid ? p2 : p1;
  const mySide  = String(p1?.player?.fighter_id) === pid ? 1 : 2;
  const win     = battle.winner_side === mySide;

  return {
    battle_at:    battle.battle_at,
    battle_type:  battle.battle_type,
    myChar:       myInfo?.character_id,
    oppChar:      oppInfo?.character_id,
    oppName:      oppInfo?.player?.name ?? "???",
    win,
    lpBefore:     myInfo?.old_league_point,
    lpAfter:      myInfo?.new_league_point,
    lpDiff:       (myInfo?.new_league_point ?? 0) - (myInfo?.old_league_point ?? 0),
    roundWon:     myInfo?.round_won ?? 0,
    roundCnt:     myInfo?.round_cnt ?? 0,
  };
}

// SVG バーチャート
function BarChart({ data, color }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.rate), 1);
  const W = 100, H = 120, barW = Math.min(32, (W / data.length) - 4);

  return (
    <svg viewBox={`0 0 ${Math.max(data.length * 38, 100)} ${H + 40}`} style={{ width: "100%", overflow: "visible" }}>
      {data.map((d, i) => {
        const barH = (d.rate / max) * H;
        const x = i * 38 + 4;
        const y = H - barH;
        const clr = d.rate >= 50 ? "#27ae60" : d.rate >= 40 ? "#f59e0b" : "#e74c3c";
        return (
          <g key={d.char}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={clr + "cc"} />
            <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#666">
              {d.char}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#aaa">
              {d.rate}%
            </text>
            <text x={x + barW / 2} y={H + 24} textAnchor="middle" fontSize={8} fill="#444">
              {d.wins}W {d.games - d.wins}L
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// SVG ラインチャート（LP推移）
function LineChart({ data, color }) {
  if (data.length < 2) return null;
  const W = 400, H = 120;
  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const range = maxV - minV || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - minV) / range) * H;
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  const area = `0,${H} ` + polyline + ` ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="lpgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lpgrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={1.5} />
      {/* 最新値 */}
      <text x={W} y={H - ((data[data.length - 1] - minV) / range) * H - 6}
        textAnchor="end" fontSize={10} fill={color} fontWeight={700}>
        {data[data.length - 1].toLocaleString()} LP
      </text>
      {/* 軸ラベル */}
      <text x={0} y={H + 16} fontSize={9} fill="#444">古</text>
      <text x={W} y={H + 16} textAnchor="end" fontSize={9} fill="#444">新</text>
    </svg>
  );
}

// カードコンポーネント
function StatCard({ label, value, sub, color = "#e8e8f0" }) {
  return (
    <div style={{
      background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 10,
      padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: "#444" }}>{sub}</span>}
    </div>
  );
}

const DEFAULT_ID = "2808191869";

export default function StatsPage() {
  const [inputId,  setInputId]  = useState(DEFAULT_ID);
  const [playerId, setPlayerId] = useState(DEFAULT_ID);
  const [filterType, setFilterType] = useState(null); // null=全部

  const { battles, loading, error, playerName } = useBattleLog(playerId);

  const parsed = useMemo(() =>
    battles.map(b => parseBattle(b, playerId)),
    [battles, playerId]
  );

  const filtered = filterType ? parsed.filter(b => b.battle_type === filterType) : parsed;

  // 集計
  const stats = useMemo(() => {
    if (!filtered.length) return null;
    const wins  = filtered.filter(b => b.win).length;
    const total = filtered.length;
    const rate  = Math.round((wins / total) * 100);

    // キャラ別
    const byChar = {};
    filtered.forEach(b => {
      if (!b.myChar) return;
      if (!byChar[b.myChar]) byChar[b.myChar] = { wins: 0, games: 0 };
      byChar[b.myChar].games++;
      if (b.win) byChar[b.myChar].wins++;
    });

    const charStats = Object.entries(byChar)
      .map(([id, s]) => ({
        char: charName(Number(id)),
        id:   Number(id),
        ...s,
        rate: Math.round((s.wins / s.games) * 100),
      }))
      .sort((a, b) => b.games - a.games);

    const mainChar = charStats[0];

    // LP 推移（ランクマのみ・時系列順）
    const lpSeries = [...filtered]
      .filter(b => b.battle_type === 1 && b.lpAfter != null)
      .reverse()
      .map(b => b.lpAfter);

    // 直近ストリーク
    let streak = 0;
    for (const b of filtered) {
      if (b.win) { if (streak >= 0) streak++; else break; }
      else        { if (streak <= 0) streak--; else break; }
    }

    return { wins, total, rate, charStats, mainChar, lpSeries, streak };
  }, [filtered]);

  const recentMatches = filtered.slice(0, 20);

  const formatDate = ts => {
    if (!ts) return "-";
    const d = new Date(ts * 1000);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* 検索バー */}
      <div style={{
        display: "flex", gap: 10, marginBottom: 28,
        background: "#13131f", border: "1px solid #2a2a3e",
        borderRadius: 10, padding: "14px 16px", alignItems: "center",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>PLAYER ID</div>
          <input
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setPlayerId(inputId)}
            placeholder="例: 2808191869"
            style={{
              background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 6,
              color: "#e8e8f0", fontSize: 13, padding: "7px 12px", outline: "none",
              width: "100%", boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={() => setPlayerId(inputId)}
          disabled={loading}
          style={{
            padding: "8px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer",
            background: "#ff6b2b22", border: "1px solid #ff6b2b",
            color: "#ff6b2b", fontWeight: 700, alignSelf: "flex-end",
          }}
        >{loading ? "取得中…" : "検索"}</button>
      </div>

      {/* エラー */}
      {error && (
        <div style={{
          background: "#2d0e0e", border: "1px solid #e74c3c", borderRadius: 8,
          padding: "14px 16px", marginBottom: 20, fontSize: 12, color: "#e74c3c",
        }}>
          <strong>取得エラー: </strong>{error}<br />
          <span style={{ color: "#666", fontSize: 11 }}>
            ※ npm run dev で起動している場合のみ動作します（Vite プロキシ使用）
          </span>
        </div>
      )}

      {/* ローディング */}
      {loading && (
        <div style={{ color: "#444", fontSize: 13, padding: "48px 0", textAlign: "center" }}>
          取得中…
        </div>
      )}

      {!loading && stats && (
        <>
          {/* プレイヤー名 */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e8e8f0" }}>
              {playerName ?? playerId}
            </span>
            <span style={{ fontSize: 11, color: "#444", marginLeft: 10 }}>の戦績</span>
          </div>

          {/* フィルタ */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {[null, 1, 2, 3].map(t => (
              <button
                key={t ?? "all"}
                onClick={() => setFilterType(t)}
                style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  border: filterType === t ? "1px solid #ff6b2b" : "1px solid #2a2a3e",
                  background: filterType === t ? "#ff6b2b22" : "transparent",
                  color: filterType === t ? "#ff6b2b" : "#555", fontWeight: 600,
                }}
              >{t === null ? "全て" : BATTLE_TYPES[t] ?? `Type${t}`}</button>
            ))}
          </div>

          {/* サマリーカード */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 28 }}>
            <StatCard label="総試合数" value={stats.total} />
            <StatCard
              label="勝率"
              value={`${stats.rate}%`}
              sub={`${stats.wins}勝 ${stats.total - stats.wins}敗`}
              color={stats.rate >= 50 ? "#27ae60" : "#e74c3c"}
            />
            {stats.mainChar && (
              <StatCard
                label="メインキャラ"
                value={stats.mainChar.char}
                sub={`${stats.mainChar.games}試合 / ${stats.mainChar.rate}%`}
                color="#ff6b2b"
              />
            )}
            {stats.lpSeries.length > 0 && (
              <StatCard
                label="現在LP"
                value={stats.lpSeries[stats.lpSeries.length - 1].toLocaleString()}
                sub="ランクマ"
                color="#a78bfa"
              />
            )}
            <StatCard
              label="連勝/連敗"
              value={stats.streak > 0 ? `${stats.streak}連勝` : stats.streak < 0 ? `${Math.abs(stats.streak)}連敗` : "-"}
              color={stats.streak > 0 ? "#27ae60" : stats.streak < 0 ? "#e74c3c" : "#888"}
            />
          </div>

          {/* LP 推移 */}
          {stats.lpSeries.length >= 2 && (
            <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 10, padding: "20px", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>LP 推移（ランクマ）</div>
              <LineChart data={stats.lpSeries} color="#a78bfa" />
            </div>
          )}

          {/* キャラ別勝率 */}
          {stats.charStats.length > 0 && (
            <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 10, padding: "20px", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>キャラ別勝率</div>
              <BarChart data={stats.charStats} color="#ff6b2b" />
            </div>
          )}

          {/* 直近の試合 */}
          <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a2a3e", fontSize: 12, fontWeight: 700, color: "#888" }}>
              直近の試合
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#0e0e16" }}>
                    {["結果", "自分", "相手キャラ", "対戦相手", "LP変動", "種別", "日時"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: "#444", fontWeight: 700, textAlign: "left", borderBottom: "1px solid #2a2a3e", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((b, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1a2e" }}>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3,
                          background: b.win ? "#27ae6022" : "#e74c3c22",
                          color: b.win ? "#27ae60" : "#e74c3c",
                          border: `1px solid ${b.win ? "#27ae60" : "#e74c3c"}44`,
                        }}>{b.win ? "WIN" : "LOSE"}</span>
                      </td>
                      <td style={{ padding: "8px 12px", color: "#e8e8f0", whiteSpace: "nowrap" }}>{charName(b.myChar)}</td>
                      <td style={{ padding: "8px 12px", color: "#888", whiteSpace: "nowrap" }}>{charName(b.oppChar)}</td>
                      <td style={{ padding: "8px 12px", color: "#666", whiteSpace: "nowrap" }}>{b.oppName}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 700, whiteSpace: "nowrap",
                        color: b.lpDiff > 0 ? "#27ae60" : b.lpDiff < 0 ? "#e74c3c" : "#888" }}>
                        {b.lpDiff > 0 ? "+" : ""}{b.lpDiff}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#444", whiteSpace: "nowrap" }}>
                        {BATTLE_TYPES[b.battle_type] ?? "-"}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#444", whiteSpace: "nowrap" }}>{formatDate(b.battle_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !error && !stats && battles.length === 0 && playerId && (
        <div style={{ color: "#2a2a3e", fontSize: 13, padding: "48px 0", textAlign: "center" }}>
          データが見つかりませんでした
        </div>
      )}
    </div>
  );
}
