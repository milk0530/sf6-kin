import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useStrategies(charId, mode) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("strategies")
      .select("*")
      .eq("char_id", charId)
      .order("category")
      .order("created_at");
    setStrategies(data ?? []);
    setLoading(false);
  }, [charId]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (row) => {
    await supabase.from("strategies").insert({ ...row, char_id: charId });
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from("strategies").delete().eq("id", id);
    await fetch();
  };

  const update = async (id, row) => {
    await supabase.from("strategies").update(row).eq("id", id);
    await fetch();
  };

  return { strategies, loading, add, remove, update };
}
