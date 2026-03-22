import { useState } from "react";

export default function HoverCard({ children, accentColor = "#ff6b2b" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#13131f",
        border: `1px solid ${hov ? accentColor + "44" : "#2a2a3e"}`,
        borderRadius: 10,
        padding: "16px 18px",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 8px 24px ${accentColor}18` : "none",
      }}
    >
      {children}
    </div>
  );
}
