import { useState } from "react";

const KEY = "sf6_default_mode";

export function useDefaultMode() {
  const [defaultMode, setDefaultMode] = useState(() =>
    localStorage.getItem(KEY) === "modern" ? "modern" : "classic"
  );

  const toggle = () => {
    setDefaultMode(prev => {
      const next = prev === "classic" ? "modern" : "classic";
      localStorage.setItem(KEY, next);
      return next;
    });
  };

  return { defaultMode, toggle };
}
