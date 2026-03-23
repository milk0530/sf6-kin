import { useState, useEffect, useCallback } from "react";

export function useBattleLog(playerId) {
  const [battles, setBattles]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const [playerName, setPlayerName] = useState(null);

  const fetch = useCallback(async () => {
    if (!playerId) return;
    setLoading(true);
    setError(null);
    setBattles([]);

    try {
      const res = await window.fetch(
        `/api/battlelog?playerId=${playerId}&page=1&limit=100`,
        { headers: { "Accept": "application/json" } }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // レスポンス形式を柔軟に対応
      const items =
        json?.list ??
        json?.items ??
        json?.battle_log ??
        json?.pageProps?.battleLog?.items ??
        json?.pageProps?.battle_log ??
        [];

      // プレイヤー名を取得
      const firstBattle = items[0];
      if (firstBattle) {
        const p1 = firstBattle.player1_info?.player;
        const p2 = firstBattle.player2_info?.player;
        const mine = String(p1?.fighter_id) === String(playerId) ? p1 : p2;
        setPlayerName(mine?.name ?? mine?.fighter_id ?? null);
      }

      setBattles(items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { battles, loading, error, playerName, refetch: fetch };
}
