import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useComboSetplayLinks(comboId) {
  const [linkedIds, setLinkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!comboId) { setLinkedIds([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("combo_setplay_links")
      .select("setplay_id")
      .eq("combo_id", comboId);
    setLinkedIds((data ?? []).map(r => r.setplay_id));
    setLoading(false);
  }, [comboId]);

  useEffect(() => { fetch(); }, [fetch]);

  const link = async (setplayId) => {
    await supabase.from("combo_setplay_links")
      .upsert({ combo_id: comboId, setplay_id: setplayId });
    await fetch();
  };

  const unlink = async (setplayId) => {
    await supabase.from("combo_setplay_links").delete()
      .eq("combo_id", comboId).eq("setplay_id", setplayId);
    await fetch();
  };

  return { linkedIds, loading, link, unlink, refetch: fetch };
}
