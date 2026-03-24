import { useState, useMemo } from "react";
import ModeToggle from "../components/ui/ModeToggle";
import CommunitySetplayCard from "../components/community/CommunitySetplayCard";
import SetplayPostForm from "../components/community/SetplayPostForm";
import { useSetplays } from "../hooks/useSetplays";
import { useIsMobile } from "../hooks/useIsMobile";

export default function SetplayPage({ data, char, defaultMode = "classic" }) {
  const [mode, setMode] = useState(defaultMode);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const color = char?.color ?? "#ff6b2b";

  const isMobile = useIsMobile();
  const { setplays, loading, add, remove, update } = useSetplays(char.id, mode);

  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    setplays.forEach(sp => {
      const s = sp.situation || "その他";
      if (!map[s]) { map[s] = []; order.push(s); }
      map[s].push(sp);
    });
    return { order, map };
  }, [setplays]);

  const handleModeChange = m => { setMode(m); setSelected(null); setShowForm(false); };
  const handleSelect = sp => setSelected(prev => prev?.id === sp.id ? null : sp);

  const isVideo = url => url && (url.includes(".mp4") || url.includes(".webm"));

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* 左: セットプレイリスト */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {showForm && (
          <div style={{ marginBottom: 20 }}>
            <SetplayPostForm
              color={color}
              onSubmit={add}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <ModeToggle mode={mode} onChange={handleModeChange} color={color} />
          <span style={{ flex: 1 }} />
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: color + "22", border: `1px solid ${color}`, color, fontWeight: 700,
            }}
          >+ 投稿</button>
        </div>

        {loading ? (
          <div style={{ color: "var(--text-6)", fontSize: 12, padding: "24px 0", textAlign: "center" }}>読み込み中…</div>
        ) : setplays.length === 0 ? (
          <div style={{ color: "var(--text-dim)", fontSize: 12, padding: "24px 0", textAlign: "center" }}>まだ投稿がありません</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {grouped.order.map(situation => (
              <div key={situation}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    width: 3, height: 14, borderRadius: 2, flexShrink: 0,
                    background: `linear-gradient(to bottom, ${color}, #7c3aed)`,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>{situation}</span>
                  <span style={{
                    fontSize: 10, color: "var(--text-4)", background: "var(--bg-elevated)",
                    border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px",
                  }}>{grouped.map[situation].length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 11 }}>
                  {grouped.map[situation].map((sp, i) => (
                    <CommunitySetplayCard
                      key={sp.id}
                      sp={sp}
                      index={i + 1}
                      color={color}
                      selected={selected?.id === sp.id}
                      onSelect={handleSelect}
                      onDelete={remove}
                      onUpdate={update}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右: メディアパネル（PC only） */}
      {!isMobile && <div style={{
        width: 260, flexShrink: 0, position: "sticky", top: 0,
        background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
        overflow: "hidden",
      }}>
        {selected?.media_url ? (
          <>
            {isVideo(selected.media_url) ? (
              <video
                key={selected.id}
                src={selected.media_url}
                style={{ width: "100%", display: "block" }}
                controls autoPlay
              />
            ) : (
              <img
                src={selected.media_url}
                style={{ width: "100%", display: "block", objectFit: "contain" }}
                alt=""
              />
            )}
            {selected.title && (
              <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-2)" }}>
                {selected.title}
              </div>
            )}
          </>
        ) : (
          <div style={{
            height: 180, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 24, color: "var(--border)" }}>▷</span>
            <span style={{ fontSize: 11, color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6 }}>
              クリックすると<br />動画が再生されます
            </span>
          </div>
        )}
      </div>}
    </div>
  );
}
