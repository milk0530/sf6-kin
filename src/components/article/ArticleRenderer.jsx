import CommandRenderer from "../ui/CommandRenderer";

function parseInline(text) {
  const parts = [];
  const regex = /\[\[([^\]]+)\]\]/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", val: text.slice(last, match.index) });
    parts.push({ type: "cmd", val: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", val: text.slice(last) });
  return parts;
}

function InlineText({ text }) {
  // **bold** をパース後に [[cmd]] をパース
  const segments = [];
  const boldRe = /\*\*([^*]+)\*\*/g;
  let last = 0, m;
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ bold: false, val: text.slice(last, m.index) });
    segments.push({ bold: true, val: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ bold: false, val: text.slice(last) });

  return (
    <>
      {segments.map((seg, si) => {
        const parts = parseInline(seg.val);
        const inner = parts.map((p, i) =>
          p.type === "cmd"
            ? <CommandRenderer key={i} command={p.val} />
            : <span key={i}>{p.val}</span>
        );
        return seg.bold
          ? <strong key={si} style={{ color: "var(--text)", fontWeight: 700 }}>{inner}</strong>
          : <span key={si}>{inner}</span>;
      })}
    </>
  );
}

function parseContent(content) {
  const lines = (content ?? "").split("\n");
  const blocks = [];
  let paraLines = [];

  const flushPara = () => {
    const text = paraLines.join("\n").trim();
    if (text) blocks.push({ type: "p", text });
    paraLines = [];
  };

  for (const raw of lines) {
    const line = raw;

    // 空行 → 段落区切り
    if (line.trim() === "") {
      flushPara();
      continue;
    }

    // --- 区切り線
    if (line.trim() === "---") {
      flushPara();
      blocks.push({ type: "hr" });
      continue;
    }

    // ## 大見出し
    if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }

    // ### 小見出し（末尾 [cmd] 省略可）
    if (line.startsWith("### ")) {
      flushPara();
      const rest = line.slice(4);
      const cmdMatch = rest.match(/\[(.+)\]\s*$/);
      if (cmdMatch) {
        blocks.push({ type: "h3", text: rest.slice(0, cmdMatch.index).trim(), command: cmdMatch[1] });
      } else {
        blocks.push({ type: "h3", text: rest });
      }
      continue;
    }

    // ![url] or ![url caption]
    if (line.startsWith("![")) {
      flushPara();
      const inner = line.slice(2, line.lastIndexOf("]"));
      const spaceIdx = inner.search(/\s/);
      if (spaceIdx === -1) {
        blocks.push({ type: "image", url: inner, caption: "" });
      } else {
        blocks.push({ type: "image", url: inner.slice(0, spaceIdx), caption: inner.slice(spaceIdx + 1) });
      }
      continue;
    }

    paraLines.push(line);
  }
  flushPara();
  return blocks;
}

export default function ArticleRenderer({ article, color = "#ff6b2b" }) {
  if (!article) return null;
  const blocks = parseContent(article.content);

  return (
    <div>
      {article.title && (
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-white)", marginBottom: 4, marginTop: 0 }}>
          {article.title}
        </h1>
      )}
      {article.author && (
        <p style={{ fontSize: 11, color: "var(--text-5)", marginBottom: 28, marginTop: 0 }}>by {article.author}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {blocks.length === 0 && (
          <p style={{ color: "var(--text-dim)", fontSize: 13, textAlign: "center", padding: "48px 0" }}>
            まだ記事がありません
          </p>
        )}
        {blocks.map((block, i) => {
          if (block.type === "h2") return (
            <h2 key={i} style={{
              fontSize: 15, fontWeight: 700, color: "var(--text)",
              borderBottom: "1px solid var(--border)", paddingBottom: 8, margin: "6px 0 0",
            }}>{block.text}</h2>
          );

          if (block.type === "h3") return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color, margin: 0 }}>{block.text}</h3>
              {block.command && (
                <>
                  <span style={{ fontSize: 11, color: "var(--text-5)" }}>（</span>
                  <CommandRenderer command={block.command} />
                  <span style={{ fontSize: 11, color: "var(--text-5)" }}>）</span>
                </>
              )}
            </div>
          );

          if (block.type === "p") return (
            <p key={i} style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
              <InlineText text={block.text} />
            </p>
          );

          if (block.type === "hr") return (
            <hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
          );

          if (block.type === "image") return (
            <div key={i} style={{ marginTop: 4 }}>
              <img src={block.url} alt={block.caption} style={{ maxWidth: 220, borderRadius: 8, display: "block" }} />
              {block.caption && (
                <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4, marginBottom: 0 }}>{block.caption}</p>
              )}
            </div>
          );

          return null;
        })}
      </div>
    </div>
  );
}
