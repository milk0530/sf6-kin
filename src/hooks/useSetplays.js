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

  const sanitize = (row) => Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k, v === "" ? null : v])
  );

  const add = async (row) => {
    const { data, error } = await supabase
      .from("setplays")
      .insert({ ...sanitize(row), char_id: charId, mode })
      .select("id")
      .single();
    if (error) throw error;
    await fetch();
    return data; // { id } を返す
  };

  const remove = async (id) => {
    await supabase.from("setplays").delete().eq("id", id);
    await fetch();
  };

  const update = async (id, row) => {
    await supabase.from("setplays").update(sanitize(row)).eq("id", id);
    await fetch();
  };

  return { setplays, loading, add, remove, update };
}
