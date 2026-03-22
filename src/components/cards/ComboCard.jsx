import HoverCard from "../ui/HoverCard";
import { DIFF_COLOR } from "../../constants/styles";

export default function ComboCard({ combo, color }) {
  return (
    <HoverCard accentColor={color}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: color + "22", border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color, fontWeight: 700,
        }}>
          {combo.id}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", flex: 1 }}>{combo.name}</span>
        <span style={{ fontSize: 12, color: DIFF_COLOR[combo.difficulty] }}>{combo.difficulty}</span>
      </div>

      <div style={{
        background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 6,
        padding: "8px 12px", fontSize: 12, color: "#e8e8f0",
        fontFamily: "monospace", marginBottom: 10, letterSpacing: 0.3, lineHeight: 1.6,
      }}>
        {combo.input}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>
          <span style={{ color: "#444" }}>ダメージ: </span>
          <span style={{ color, fontWeight: 700 }}>{combo.damage}</span>
        </span>
        <span style={{ fontSize: 12 }}>
          <span style={{ color: "#444" }}>ゲージ: </span>
          <span style={{ color: "#8e44ad", fontWeight: 700 }}>{combo.meter}</span>
        </span>
      </div>

      <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{combo.note}</p>
    </HoverCard>
  );
}
