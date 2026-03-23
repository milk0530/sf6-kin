import { useState, useEffect, useCallback } from "react";

export function useBattleLog(playerId) {
  const [battles,    setBattles]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [playerName, setPlayerName] = useState(null);

  const fetch = useCallback(async () => {
    if (!playerId) return;
    setLoading(true);
    setError(null);
    setBattles([]);

    try {
      const res = await window.fetch(
        `/api/battlelog?playerId=${playerId}&page=1`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const items = json?.list ?? [];

      // プレイヤー名を取得（fighter_id が表示名、short_id が数値ID）
      const pid = Number(playerId);
      const first = items[0];
      if (first) {
        const p1 = first.player1_info?.player;
        const p2 = first.player2_info?.player;
        const mine = p1?.short_id === pid ? p1 : p2;
        setPlayerName(mine?.fighter_id ?? String(playerId));
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
