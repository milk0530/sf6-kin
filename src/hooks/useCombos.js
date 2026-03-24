import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useCombos(charId, mode) {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("combos")
      .select("*")
      .eq("char_id", charId)
      .eq("mode", mode)
      .order("starter")
      .order("created_at");
    setCombos(data ?? []);
    setLoading(false);
  }, [charId, mode]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (row) => {
    const { error } = await supabase.from("combos").insert({ ...row, char_id: charId, mode });
    if (error) throw error;
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from("combos").delete().eq("id", id);
    await fetch();
  };

  const update = async (id, row) => {
    await supabase.from("combos").update(row).eq("id", id);
    await fetch();
  };

  return { combos, loading, add, remove, update };
}
