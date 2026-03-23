import { useState, useEffect, useCallback } from "react";

const MAX_PAGES = 15; // 最大1500戦まで取得

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
      const fetchPage = async (page) => {
        const res = await window.fetch(
          `/api/battlelog?playerId=${playerId}&page=${page}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      };

      // まず1ページ目を取得
      const first = await fetchPage(1);
      const items = [...(first.list ?? [])];
      const totalPages = Math.min(first.total_page ?? 1, MAX_PAGES);

      // 残りページを並列取得
      if (totalPages > 1) {
        const pageNums = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(pageNums.map(fetchPage));
        for (const json of rest) {
          items.push(...(json.list ?? []));
        }
      }

      // プレイヤー名を取得
      const pid = Number(playerId);
      const first_ = items[0];
      if (first_) {
        const p1 = first_.player1_info?.player;
        const p2 = first_.player2_info?.player;
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
