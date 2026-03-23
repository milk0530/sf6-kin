import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useArticle(charId) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("char_id", charId)
      .maybeSingle();
    setArticle(data ?? null);
    setLoading(false);
  }, [charId]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (fields) => {
    if (article) {
      await supabase.from("articles")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("char_id", charId);
    } else {
      await supabase.from("articles").insert({ ...fields, char_id: charId });
    }
    await fetch();
  };

  return { article, loading, save };
}
