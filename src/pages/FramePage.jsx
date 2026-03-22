import { useState } from "react";
import ModeToggle from "../components/ui/ModeToggle";

export default function FramePage({ data }) {
  const [mode, setMode] = useState("classic");
  const content = data[mode];

  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      <div style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0e0e16" }}>
              {["技名", "発生", "ガード時", "ヒット時", "キャンセル", "備考"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", color: "#444", fontWeight: 700,
                  textAlign: "left", borderBottom: "1px solid #2a2a3e",
                  letterSpacing: 0.5, whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.moves.map((m, i) => {
              const blockStr = String(m.onBlock);
              const blockColor = blockStr.startsWith("+")
                ? "#27ae60"
                : blockStr.startsWith("-")
                ? "#e74c3c"
                : "#888";

              return (
                <tr
                  key={i}
                  style={{ borderBottom: "1px solid #1a1a2e", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#1a1a2e")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 14px", color: "#e8e8f0", fontWeight: 700 }}>{m.label}</td>
                  <td style={{ padding: "10px 14px", color: "#ff6b2b" }}>
                    {m.startup}{typeof m.startup === "number" ? "F" : ""}
                  </td>
                  <td style={{ padding: "10px 14px", color: blockColor, fontWeight: 700 }}>{m.onBlock}</td>
                  <td style={{ padding: "10px 14px", color: "#27ae60" }}>{m.onHit}</td>
                  <td style={{ padding: "10px 14px", color: m.cancel === "○" ? "#27ae60" : "#333" }}>{m.cancel}</td>
                  <td style={{ padding: "10px 14px", color: "#555", fontSize: 11 }}>{m.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
