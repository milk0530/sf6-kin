import { useState } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import SetplayCard from "../components/cards/SetplayCard";

export default function SetplayPage({ data, char }) {
  const [mode, setMode] = useState("classic");
  const content = data[mode];

  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {content.setplays.map(sp => (
          <SetplayCard key={sp.id} sp={sp} color={char.color} />
        ))}
      </div>
    </div>
  );
}
