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

  const sanitize = (row) => Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k, v === "" ? null : v])
  );

  const add = async (row) => {
    const s = sanitize(row);
    if (!s.starter) s.starter = "その他";
    const { error } = await supabase.from("combos").insert({ ...s, char_id: charId, mode });
    if (error) throw error;
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from("combos").delete().eq("id", id);
    await fetch();
  };

  const update = async (id, row) => {
    await supabase.from("combos").update(sanitize(row)).eq("id", id);
    await fetch();
  };

  return { combos, loading, add, remove, update };
}
