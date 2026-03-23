import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useSetplays(charId, mode) {
  const [setplays, setSetplays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("setplays")
      .select("*")
      .eq("char_id", charId)
      .eq("mode", mode)
      .order("situation")
      .order("created_at");
    setSetplays(data ?? []);
    setLoading(false);
  }, [charId, mode]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (row) => {
    await supabase.from("setplays").insert({ ...row, char_id: charId, mode });
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from("setplays").delete().eq("id", id);
    await fetch();
  };

  return { setplays, loading, add, remove };
}
