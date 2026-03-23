export default function MediaModal({ url, title, onClose }) {
  const isVideo = url.includes(".mp4") || url.includes(".webm");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
        zIndex: 1000, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", color: "#888",
          fontSize: 28, cursor: "pointer", lineHeight: 1,
        }}
      >×</button>

      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600 }}>
        {isVideo ? (
          <video
            src={url}
            style={{ width: "100%", borderRadius: 8 }}
            controls autoPlay
          />
        ) : (
          <img
            src={url}
            style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
            alt=""
          />
        )}
        {title && (
          <p style={{ fontSize: 12, color: "#888", marginTop: 10, textAlign: "center" }}>{title}</p>
        )}
      </div>
    </div>
  );
}
