import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useTweets(charId) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("char_tweets")
      .select("*")
      .eq("char_id", charId)
      .order("created_at", { ascending: false });
    setTweets(data ?? []);
    setLoading(false);
  }, [charId]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (row) => {
    await supabase.from("char_tweets").insert({ ...row, char_id: charId });
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from("char_tweets").delete().eq("id", id);
    await fetch();
  };

  const update = async (id, row) => {
    await supabase.from("char_tweets").update(row).eq("id", id);
    await fetch();
  };

  return { tweets, loading, add, remove, update };
}
