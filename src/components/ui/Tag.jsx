import { TAG_COLOR } from "../../constants/styles";

export default function Tag({ text }) {
  const bg = TAG_COLOR[text] || "#1a2a2a";
  return (
    <span style={{
      fontSize: 11,
      padding: "2px 8px",
      borderRadius: 4,
      background: bg + "88",
      color: "#ccc",
      border: `1px solid ${bg}88`,
    }}>
      {text}
    </span>
  );
}
