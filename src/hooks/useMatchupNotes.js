import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useMatchupNotes(charId) {
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("matchup_notes")
      .select("*")
      .eq("char_id", charId)
      .order("opp_tool");
    setNotes(data ?? []);
    setLoading(false);
  }, [charId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const add = async (row) => {
    await supabase.from("matchup_notes").insert({ ...row, char_id: charId });
    await fetchAll();
  };

  const update = async (id, row) => {
    await supabase.from("matchup_notes").update(row).eq("id", id);
    await fetchAll();
  };

  const remove = async (id) => {
    await supabase.from("matchup_notes").delete().eq("id", id);
    await fetchAll();
  };

  return { notes, loading, add, update, remove };
}
