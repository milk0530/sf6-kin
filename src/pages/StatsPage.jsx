import { useState, useMemo, useEffect, useRef } from "react";
import { useBattleLog } from "../hooks/useBattleLog";

// character_tool_name → 日本語名
const CHAR_JA = {
  ryu:"リュウ", luke:"ルーク", kimberly:"キンバリー", chunli:"春麗",
  manon:"マノン", zangief:"ザンギエフ", jp:"JP", dhalsim:"ダルシム",
  cammy:"キャミィ", ken:"ケン", deejay:"ディージェイ", lily:"リリー",
  rashid:"ラシード", blanka:"ブランカ", juri:"ユリ", marisa:"マリーザ",
  guile:"ガイル", ehonda:"E.本田", jamie:"ジェイミー",
  gouki:"豪鬼", akuma:"豪鬼",   // gouki が実際のtool_name
  bison:"ベガ", mbison:"ベガ",
  ed:"エド", terry:"テリー", mai:"マイ", elena:"エレナ",
  alex:"アレックス",
};
function toJa(tool, eng) { return CHAR_JA[tool?.toLowerCase()] ?? eng ?? tool ?? "?"; }

const GAME_MODES = { 1:"ランクマ", 2:"カジュアル", 3:"バトルハブ", 4:"カスタム", 6:"トーナメント" };
function modeName(t)   { return GAME_MODES[t] ?? `-`; }
// 0=クラシック, 1=モダン, 2=ダイナミック
function inputLabel(t) { return t === 0 ? "C" : t === 1 ? "M" : t === 2 ? "D" : "?"; }

function parseBattle(battle, playerId) {
  const pid    = Number(playerId);
  const p1     = battle.player1_info;
  const p2     = battle.player2_info;
  const isP1   = p1?.player?.short_id === pid;
  const myInfo  = isP1 ? p1 : p2;
  const oppInfo = isP1 ? p2 : p1;

  // round_results: 0=負け、非ゼロ=勝ち（1=KO, 6=タイムアップ, 8=パーフェクト 等）
  const myWins  = (myInfo?.round_results  ?? []).filter(r => r > 0).length;
  const oppWins = (oppInfo?.round_results ?? []).filter(r => r > 0).length;

  return {
    battle_at:    battle.uploaded_at,
    battle_type:  battle.replay_battle_type,
    myCharTool:   myInfo?.character_tool_name ?? "",
    myCharName:   toJa(myInfo?.character_tool_name, myInfo?.character_name),
    myInput:      myInfo?.battle_input_type,
    oppCharTool:  oppInfo?.character_tool_name ?? "",
    oppCharName:  toJa(oppInfo?.character_tool_name, oppInfo?.character_name),
    oppInput:     oppInfo?.battle_input_type,
    oppName:      oppInfo?.player?.fighter_id ?? "???",
    win:          myWins > oppWins,
    roundWon:     myWins,
    roundLost:    oppWins,
    lp:           myInfo?.league_point ?? null,
    masterRating: myInfo?.master_rating > 0 ? myInfo.master_rating : null,
    replayId:     battle.replay_id ?? null,
  };
}

function formatDate(ts) {
  if (!ts) return "-";
  const d    = new Date(ts * 1000);
  const now  = new Date();
  const today   = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dDay    = new Date(d.getFullYear(),   d.getMonth(),   d.getDate()).getTime();
  const time = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  if (dDay === today)            return `今日 ${time}`;
  if (dDay === today - 86400000) return `昨日 ${time}`;
  return `${d.getMonth()+1}/${d.getDate()} ${time}`;
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
const _now = new Date();
const DEFAULT_DATE_FROM = toDateStr(new Date(_now.getFullYear(), _now.getMonth(), 1));
const DEFAULT_DATE_TO   = toDateStr(_now);

// ── スタイル ────────────────────────────────────────────
const CARD = { background:"#13131f", border:"1px solid #2a2a3e", borderRadius:10 };
const SEL  = {
  background:"#0e0e16", border:"1px solid #2a2a3e", borderRadius:6,
  color:"#e8e8f0", fontSize:12, padding:"6px 10px", outline:"none", width:"100%",
};
const LBL = { fontSize:10, color:"#555", marginBottom:3 };
const TH  = { padding:"8px 12px", color:"#444", fontWeight:700, textAlign:"left", borderBottom:"1px solid #2a2a3e", whiteSpace:"nowrap", fontSize:11 };
const TD  = { padding:"8px 10px", fontSize:12, whiteSpace:"nowrap" };

// ── トレンドチャート ────────────────────────────────────
function TrendChart({ points, color, id }) {
  if (points.length < 2) return null;
  const PL = 58, PR = 44, PT = 20, PB = 56;
  const CW = 500, CH = 150;
  const W = PL + CW + PR, H = PT + CH + PB;

  const vals = points.map(p => p.value);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;

  const cx = i => PL + (i / (points.length - 1)) * CW;
  const cy = v => PT + CH - ((v - minV) / range) * CH;
  const coords = points.map((p, i) => [cx(i), cy(p.value)]);
  const lineStr = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const areaStr = `${PL},${PT + CH} ${lineStr} ${PL + CW},${PT + CH}`;

  // Y軸 6段階
  const yLevels = Array.from({ length: 6 }, (_, i) => minV + (range / 5) * i);
  const fmtVal  = v => v >= 10000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v).toLocaleString();

  // X軸 最大8ラベル
  const xCount = Math.min(8, points.length);
  const xIdxs  = Array.from({ length: xCount }, (_, i) =>
    Math.round(i * (points.length - 1) / (xCount - 1))
  );
  const dtLabel = ts => {
    const d = new Date(ts * 1000);
    return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", overflow:"visible" }}>
      <defs>
        <linearGradient id={`g_${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* グリッド線 + Y軸ラベル */}
      {yLevels.map((v, i) => (
        <g key={i}>
          <line x1={PL} y1={cy(v)} x2={PL + CW} y2={cy(v)} stroke="#1e1e2e" strokeWidth={1} />
          <text x={PL - 6} y={cy(v) + 4} textAnchor="end" fontSize={9} fill="#555">
            {fmtVal(v)}
          </text>
        </g>
      ))}

      {/* HIGH ライン */}
      <line x1={PL} y1={PT} x2={PL + CW} y2={PT}
        stroke={color} strokeWidth={0.8} strokeDasharray="4,3" opacity={0.5} />
      <text x={PL - 6} y={PT + 4} textAnchor="end" fontSize={8} fill={color} fontWeight={700}>HIGH</text>

      {/* エリア・ライン */}
      <polygon points={areaStr} fill={`url(#g_${id})`} />
      <polyline points={lineStr} fill="none" stroke={color} strokeWidth={1.5} />

      {/* ドット */}
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} fill={color} />
      ))}

      {/* 最新値 */}
      <text x={coords[coords.length-1][0] + 5} y={coords[coords.length-1][1] + 4}
        fontSize={9} fill={color} fontWeight={700}>
        {fmtVal(vals[vals.length - 1])}
      </text>

      {/* X軸ラベル（斜め） */}
      {xIdxs.map(idx => (
        <text key={idx}
          x={coords[idx][0]} y={PT + CH + 14}
          textAnchor="end" fontSize={8} fill="#555"
          transform={`rotate(-35,${coords[idx][0]},${PT + CH + 14})`}>
          {dtLabel(points[idx].ts)}
        </text>
      ))}
    </svg>
  );
}

// ── フィルター ──────────────────────────────────────────
const EMPTY_FILTER = {
  myChar:"", myInput:"", oppChar:"", oppInput:"", gameMode:"",
  dateFrom: DEFAULT_DATE_FROM, dateTo: DEFAULT_DATE_TO,
};
// ランク統計専用フィルタ（操作タイプ・gameModeなし、日付は全期間）
const RANK_EMPTY_FILTER = { myChar:"", dateFrom:"", dateTo:"" };

function applyRankFilter(parsed, f) {
  return parsed.filter(b => {
    if (b.battle_type !== 1)                                                        return false;
    if (f.myChar   && b.myCharTool !== f.myChar)                                   return false;
    if (f.dateFrom && b.battle_at < new Date(f.dateFrom).getTime() / 1000)         return false;
    if (f.dateTo   && b.battle_at > new Date(f.dateTo).getTime() / 1000 + 86400)   return false;
    return true;
  });
}

function applyFilter(parsed, f) {
  return parsed.filter(b => {
    if (f.myChar   && b.myCharTool  !== f.myChar)             return false;
    if (f.myInput  && b.myInput     !== Number(f.myInput))    return false;
    if (f.oppChar  && b.oppCharTool !== f.oppChar)            return false;
    if (f.oppInput && b.oppInput    !== Number(f.oppInput))   return false;
    if (f.gameMode && b.battle_type !== Number(f.gameMode))   return false;
    if (f.dateFrom && b.battle_at < new Date(f.dateFrom).getTime() / 1000) return false;
    if (f.dateTo   && b.battle_at > new Date(f.dateTo).getTime() / 1000 + 86400) return false;
    return true;
  });
}

function FilterPanel({ draft, setDraft, onSearch, onReset, showOpp, showGameMode = true, showInputType = true, charOptions }) {
  const modeOpts  = [["","全て"], ...Object.entries(GAME_MODES)];
  const inputOpts = [["","全て"], ["1","M（モダン）"], ["0","C（クラシック）"], ["2","D（ダイナミック）"]];
  const set = key => e => setDraft(d => ({...d, [key]: e.target.value}));

  return (
    <div style={{ ...CARD, padding:"14px 16px", marginBottom:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:10, marginBottom:12 }}>
        <div><div style={LBL}>私のキャラクター</div>
          <select style={SEL} value={draft.myChar} onChange={set("myChar")}>
            {charOptions.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select></div>
        {showInputType && (
          <div><div style={LBL}>私の操作タイプ</div>
            <select style={SEL} value={draft.myInput ?? ""} onChange={set("myInput")}>
              {inputOpts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
        )}
        {showOpp && <>
          <div><div style={LBL}>対戦相手のキャラクター</div>
            <select style={SEL} value={draft.oppChar} onChange={set("oppChar")}>
              {charOptions.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
          <div><div style={LBL}>対戦相手の操作タイプ</div>
            <select style={SEL} value={draft.oppInput} onChange={set("oppInput")}>
              {inputOpts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
        </>}
        {showGameMode && (
          <div><div style={LBL}>ゲームモード</div>
            <select style={SEL} value={draft.gameMode} onChange={set("gameMode")}>
              {modeOpts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
        )}
        <div><div style={LBL}>開始日</div>
          <input type="date" style={{...SEL, boxSizing:"border-box"}} value={draft.dateFrom} onChange={set("dateFrom")} /></div>
        <div><div style={LBL}>終了日</div>
          <input type="date" style={{...SEL, boxSizing:"border-box"}} value={draft.dateTo} onChange={set("dateTo")} /></div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onSearch} style={{ padding:"6px 20px", borderRadius:6, fontSize:12, cursor:"pointer", background:"#3b82f6", border:"none", color:"#fff", fontWeight:700 }}>検索</button>
        <button onClick={onReset}  style={{ padding:"6px 20px", borderRadius:6, fontSize:12, cursor:"pointer", background:"transparent", border:"1px solid #2a2a3e", color:"#555" }}>リセット</button>
      </div>
    </div>
  );
}

// ── 対戦タブ ────────────────────────────────────────────
const PER_PAGE = 20;

function BattlesTab({ filtered, playerName }) {
  const [page, setPage] = useState(0);
  const [tooltip, setTooltip] = useState(null);

  // フィルタ変更でページリセット
  useEffect(() => { setPage(0); }, [filtered]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData   = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div style={{ ...CARD, overflow:"hidden", padding:0 }}>
      {/* ツールチップ */}
      {tooltip && (
        <div style={{
          position:"fixed", left: tooltip.x + 14, top: tooltip.y - 10,
          background:"#1a1a2e", border:"1px solid #2a2a3e", borderRadius:8,
          padding:"10px 14px", zIndex:1000, fontSize:11, color:"#e8e8f0",
          pointerEvents:"none", lineHeight:1.8, minWidth:160,
        }}>
          <div style={{ fontWeight:700, marginBottom:4, color: tooltip.b.win ? "#27ae60" : "#e74c3c" }}>
            {tooltip.b.win ? "WIN" : "LOSE"} {tooltip.b.roundWon} - {tooltip.b.roundLost}
          </div>
          {tooltip.b.lp != null && (
            <div style={{ color:"#a78bfa" }}>LP: {tooltip.b.lp.toLocaleString()}</div>
          )}
          {tooltip.b.masterRating != null && (
            <div style={{ color:"#3b82f6" }}>MR: {tooltip.b.masterRating}</div>
          )}
          <div style={{ color:"#555", fontSize:10, marginTop:4 }}>
            {modeName(tooltip.b.battle_type)}
          </div>
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#0e0e16" }}>
              {["私","キャラ","勝負","相手","キャラ","モード","リプレイID","日時"].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((b, i) => (
              <tr key={i}
                style={{ borderBottom:"1px solid #1a1a2e", cursor:"default" }}
                onMouseMove={e => setTooltip({ x: e.clientX, y: e.clientY, b })}
                onMouseLeave={() => setTooltip(null)}
              >
                <td style={{...TD, color:"#e8e8f0"}}>{playerName ?? "?"}</td>
                <td style={{...TD, color:"#888"}}>
                  {b.myCharName}
                  <span style={{ fontSize:10, color:"#555", marginLeft:4 }}>{inputLabel(b.myInput)}</span>
                </td>
                <td style={{...TD, textAlign:"center"}}>
                  <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", background: b.win ? "#27ae60" : "#e74c3c" }} />
                </td>
                <td style={{...TD, color:"#aaa"}}>{b.oppName}</td>
                <td style={{...TD, color:"#888"}}>
                  {b.oppCharName}
                  <span style={{ fontSize:10, color:"#555", marginLeft:4 }}>{inputLabel(b.oppInput)}</span>
                </td>
                <td style={{...TD, color:"#555"}}>{modeName(b.battle_type)}</td>
                <td style={{...TD}}>
                  <span style={{ fontSize:11, color:"#3b82f6", fontFamily:"monospace" }}>{b.replayId ?? "-"}</span>
                </td>
                <td style={{...TD, color:"#444"}}>{formatDate(b.battle_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:"48px 0", textAlign:"center", color:"#2a2a3e", fontSize:12 }}>データなし</div>
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderTop:"1px solid #1a1a2e" }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding:"4px 14px", borderRadius:5, fontSize:12, cursor: page===0 ? "default":"pointer", background:"transparent", border:"1px solid #2a2a3e", color: page===0 ? "#333" : "#888" }}
          >← 前</button>
          <span style={{ fontSize:11, color:"#555" }}>
            {page + 1} / {totalPages}（{filtered.length}件）
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{ padding:"4px 14px", borderRadius:5, fontSize:12, cursor: page===totalPages-1 ? "default":"pointer", background:"transparent", border:"1px solid #2a2a3e", color: page===totalPages-1 ? "#333" : "#888" }}
          >次 →</button>
        </div>
      )}
    </div>
  );
}

// ── キャラ別統計タブ ────────────────────────────────────
function CharStatsTab({ filtered }) {
  const groups = useMemo(() => {
    const map = {};
    filtered.forEach(b => {
      const key = `${b.oppCharTool}_${b.oppInput}`;
      if (!map[key]) map[key] = { name: b.oppCharName, input: b.oppInput, wins: 0, losses: 0 };
      if (b.win) map[key].wins++; else map[key].losses++;
    });
    return Object.values(map).sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
  }, [filtered]);

  return (
    <div style={{ ...CARD, overflow:"hidden", padding:0 }}>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#0e0e16" }}>
              {["キャラクター","操作タイプ","合計","勝利","敗北","勝利数","勝率"].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g, i) => {
              const total = g.wins + g.losses;
              const diff  = g.wins - g.losses;
              const rate  = total > 0 ? (g.wins / total * 100).toFixed(1) : "-";
              const rateN = total > 0 ? g.wins / total * 100 : 50;
              return (
                <tr key={i} style={{ borderBottom:"1px solid #1a1a2e", background: i%2===0 ? "#0e0e1640" : "transparent" }}>
                  <td style={{...TD, color:"#e8e8f0"}}>{g.name}</td>
                  <td style={{...TD, color:"#888"}}>{inputLabel(g.input)}</td>
                  <td style={{...TD, color:"#888"}}>{total}</td>
                  <td style={{...TD, color:"#27ae60"}}>{g.wins}</td>
                  <td style={{...TD, color:"#e74c3c"}}>{g.losses}</td>
                  <td style={{...TD, fontWeight:700, color: diff >= 0 ? "#27ae60" : "#e74c3c"}}>
                    {diff >= 0 ? `+${diff}` : diff}
                  </td>
                  <td style={{...TD, fontWeight:700, color: rateN >= 50 ? "#27ae60" : "#e74c3c"}}>
                    {rate}{total > 0 ? "%" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {groups.length === 0 && (
          <div style={{ padding:"48px 0", textAlign:"center", color:"#2a2a3e", fontSize:12 }}>データなし</div>
        )}
      </div>
    </div>
  );
}

// ── ランク統計タブ ──────────────────────────────────────
function RankStatsTab({ parsed, rankFilter }) {
  const ranked = useMemo(() =>
    [...applyRankFilter(parsed, rankFilter)].reverse(),
    [parsed, rankFilter]
  );
  const lpPoints = ranked.filter(b => b.lp != null).map(b => ({ value: b.lp, ts: b.battle_at }));
  const mrPoints = ranked.filter(b => b.masterRating != null).map(b => ({ value: b.masterRating, ts: b.battle_at }));

  if (ranked.length === 0) {
    return <div style={{ ...CARD, padding:"48px 0", textAlign:"center", color:"#2a2a3e", fontSize:12 }}>ランクマのデータがありません</div>;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {lpPoints.length >= 2 && (
        <div style={{ ...CARD, padding:"20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:16 }}>LP 推移</div>
          <TrendChart points={lpPoints} color="#ec4899" id="lp" />
        </div>
      )}
      {mrPoints.length >= 2 && (
        <div style={{ ...CARD, padding:"20px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:16 }}>マスターレーティング推移</div>
          <TrendChart points={mrPoints} color="#3b82f6" id="mr" />
        </div>
      )}
    </div>
  );
}

// ── メイン ──────────────────────────────────────────────
const TABS = [
  { id:"battles",   label:"対戦" },
  { id:"charStats", label:"キャラ別統計" },
  { id:"rankStats", label:"ランク統計" },
];

const HISTORY_KEY = "sf6_player_history";
const MAX_HISTORY = 50;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []; }
  catch { return []; }
}
function saveHistory(id, name) {
  const prev = loadHistory().filter(h => h.id !== id);
  const next = [{ id, name }, ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export default function StatsPage() {
  const [inputId,      setInputId]      = useState("");
  const [playerId,     setPlayerId]     = useState("");
  const [activeTab,    setActiveTab]    = useState("battles");
  const [filterDraft,  setFilterDraft]  = useState(EMPTY_FILTER);
  const [activeFilter, setActiveFilter] = useState(EMPTY_FILTER);
  const [rankDraft,    setRankDraft]    = useState(RANK_EMPTY_FILTER);
  const [rankFilter,   setRankFilter]   = useState(RANK_EMPTY_FILTER);
  const [history,      setHistory]      = useState(loadHistory);
  const rankInitialized = useRef(false);

  // 対戦・キャラ別統計用（全種別）
  const { battles, loading, error, playerName } = useBattleLog(playerId, "all");
  // ランク統計用（ランクマのみ・ページ数が多く取れる）
  const { battles: rankBattles } = useBattleLog(playerId, "rank");

  const parsed = useMemo(() =>
    battles.map(b => parseBattle(b, playerId)),
    [battles, playerId]
  );

  const parsedRank = useMemo(() =>
    rankBattles.map(b => parseBattle(b, playerId)),
    [rankBattles, playerId]
  );

  // 検索成功時に履歴保存
  useEffect(() => {
    if (!playerName || !playerId) return;
    saveHistory(playerId, playerName);
    setHistory(loadHistory());
  }, [playerName, playerId]);

  const search = id => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setInputId(trimmed);
    setPlayerId(trimmed);
  };

  // プレイヤーID変更時に全フィルタをリセット
  useEffect(() => {
    rankInitialized.current = false;
    setFilterDraft(EMPTY_FILTER);
    setActiveFilter(EMPTY_FILTER);
    setRankDraft(RANK_EMPTY_FILTER);
    setRankFilter(RANK_EMPTY_FILTER);
  }, [playerId]);

  // ランクデータが揃ったら、最後に使ったキャラをデフォルトに
  useEffect(() => {
    if (parsedRank.length === 0 || rankInitialized.current) return;
    const lastChar = parsedRank[0]?.myCharTool ?? "";
    if (!lastChar) return;
    rankInitialized.current = true;
    setRankDraft(d => ({ ...d, myChar: lastChar }));
    setRankFilter(f => ({ ...f, myChar: lastChar }));
  }, [parsedRank]);

  // ローカルに登場したキャラ一覧をtool_nameから動的生成（全+ランク両方から収集）
  const charOptions = useMemo(() => {
    const seen = new Map();
    [...parsed, ...parsedRank].forEach(b => {
      if (b.myCharTool)  seen.set(b.myCharTool,  b.myCharName);
      if (b.oppCharTool) seen.set(b.oppCharTool, b.oppCharName);
    });
    return [["","全て"], ...[...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], "ja"))];
  }, [parsed, parsedRank]);

  const filtered = useMemo(() =>
    applyFilter(parsed, activeFilter),
    [parsed, activeFilter]
  );

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>
      {/* プレイヤーID入力 */}
      <div style={{ display:"flex", gap:10, marginBottom:20, alignItems:"flex-end" }}>
        <div style={{ flex:1 }}>
          <div style={LBL}>PLAYER ID</div>
          <input
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search(inputId)}
            placeholder="例: 2808191869"
            style={{ ...SEL, fontSize:14, padding:"8px 12px", boxSizing:"border-box" }}
          />
        </div>
        <button
          onClick={() => search(inputId)}
          disabled={loading}
          style={{
            padding:"9px 24px", borderRadius:6, fontSize:13, cursor:"pointer",
            background:"#ff6b2b22", border:"1px solid #ff6b2b",
            color:"#ff6b2b", fontWeight:700,
          }}
        >{loading ? "取得中…" : "検索"}</button>
      </div>

      {error && (
        <div style={{ background:"#2d0e0e", border:"1px solid #e74c3c", borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:12, color:"#e74c3c" }}>
          <strong>エラー: </strong>{error}
        </div>
      )}
      {loading && (
        <div style={{ color:"#444", fontSize:13, padding:"48px 0", textAlign:"center" }}>取得中…</div>
      )}

      {!loading && playerName && (
        <>
          <div style={{ marginBottom:16 }}>
            <span style={{ fontSize:22, fontWeight:700, color:"#e8e8f0" }}>{playerName}</span>
          </div>

          {/* タブ */}
          <div style={{ display:"flex", borderBottom:"1px solid #2a2a3e", marginBottom:14 }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  background:"none", border:"none",
                  padding:"9px 20px", fontSize:12,
                  color: active ? "#ff6b2b" : "#555",
                  cursor:"pointer", whiteSpace:"nowrap",
                  borderBottom: active ? "2px solid #ff6b2b" : "2px solid transparent",
                  marginBottom:-1,
                  fontFamily:"inherit",
                  transition:"color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#888"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#555"; }}
                >{t.label}</button>
              );
            })}
          </div>

          {activeTab === "rankStats" ? (
            <FilterPanel
              draft={rankDraft}
              setDraft={setRankDraft}
              onSearch={() => setRankFilter({ ...rankDraft })}
              onReset={() => { setRankDraft(RANK_EMPTY_FILTER); setRankFilter(RANK_EMPTY_FILTER); }}
              showOpp={false}
              showGameMode={false}
              showInputType={false}
              charOptions={charOptions}
            />
          ) : (
            <FilterPanel
              draft={filterDraft}
              setDraft={setFilterDraft}
              onSearch={() => setActiveFilter({ ...filterDraft })}
              onReset={() => { setFilterDraft(EMPTY_FILTER); setActiveFilter(EMPTY_FILTER); }}
              showOpp={activeTab === "battles"}
              charOptions={charOptions}
            />
          )}

          {activeTab === "battles"   && <BattlesTab   filtered={filtered} playerName={playerName} />}
          {activeTab === "charStats" && <CharStatsTab  filtered={filtered} />}
          {activeTab === "rankStats" && <RankStatsTab  parsed={parsedRank} rankFilter={rankFilter} />}
        </>
      )}

      {!loading && !error && !playerName && playerId && (
        <div style={{ color:"#2a2a3e", fontSize:13, padding:"48px 0", textAlign:"center" }}>
          データが見つかりませんでした
        </div>
      )}

      {!playerId && history.length > 0 && (
        <div style={{ marginTop:8 }}>
          <div style={{ fontSize:10, color:"#333", fontWeight:700, letterSpacing:2, marginBottom:10 }}>RECENT PLAYERS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {history.map(h => (
              <button
                key={h.id}
                onClick={() => search(h.id)}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  background:"transparent", border:"1px solid #1e1e2e",
                  borderRadius:8, padding:"10px 14px", cursor:"pointer",
                  textAlign:"left", fontFamily:"inherit", transition:"all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="#13131f"; e.currentTarget.style.borderColor="#2a2a3e"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#1e1e2e"; }}
              >
                <div style={{ fontSize:13, fontWeight:700, color:"#e8e8f0" }}>{h.name}</div>
                <div style={{ fontSize:11, color:"#333" }}>{h.id}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
