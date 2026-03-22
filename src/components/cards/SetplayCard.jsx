import HoverCard from "../ui/HoverCard";
import Tag from "../ui/Tag";
import { DIFF_COLOR } from "../../constants/styles";

export default function SetplayCard({ sp, color }) {
  return (
    <HoverCard accentColor={color}>
      {/* タイトル行 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: color + "22", border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color, fontWeight: 700, flexShrink: 0,
        }}>
          {sp.id}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", flex: 1 }}>{sp.title}</h3>
        <span style={{ fontSize: 12, color: DIFF_COLOR[sp.difficulty] }}>{sp.difficulty}</span>
      </div>

      {/* フロー */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ background: "#0e0e16", border: "1px solid #2a2a3e", borderRadius: 6, padding: "5px 10px", fontSize: 12 }}>
          <div style={{ fontSize: 10, color: "#444", marginBottom: 2 }}>起点</div>
          <div style={{ color: "#bbb" }}>{sp.after}</div>
        </div>
        <span style={{ color }}>→</span>
        <div style={{ background: "#1a1a2e", border: `1px solid ${color}44`, borderRadius: 6, padding: "5px 10px", fontSize: 12 }}>
          <div style={{ fontSize: 10, color: color + "88", marginBottom: 2 }}>行動</div>
          <div style={{ color, fontWeight: 700 }}>{sp.action}</div>
        </div>
        {sp.advantage !== "−" && (
          <>
            <span style={{ color }}>→</span>
            <div style={{ background: "#0e1e16", border: "1px solid #27ae6044", borderRadius: 6, padding: "5px 10px", fontSize: 12 }}>
              <div style={{ fontSize: 10, color: "#27ae6088", marginBottom: 2 }}>有利</div>
              <div style={{ color: "#27ae60", fontWeight: 700 }}>{sp.advantage}</div>
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, marginBottom: 10 }}>{sp.note}</p>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#1a1a2e", color: "#444", border: "1px solid #2a2a3e" }}>
          {sp.situation}
        </span>
        {sp.tags.map(t => <Tag key={t} text={t} />)}
      </div>
    </HoverCard>
  );
}
