import { useState } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import ComboCard from "../components/cards/ComboCard";

export default function ComboPage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const content = data[mode];

  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {content.combos.map(combo => (
          <ComboCard key={combo.id} combo={combo} color={char.color} />
        ))}
      </div>
    </div>
  );
}
