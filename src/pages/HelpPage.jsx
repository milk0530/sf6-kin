import CommandRenderer from "../components/ui/CommandRenderer";

const S = {
  card:    { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 14 },
  h2:      { fontSize: 14, fontWeight: 700, color: "var(--text-white)", marginBottom: 14, marginTop: 0, display: "flex", alignItems: "center", gap: 8 },
  h3:      { fontSize: 12, fontWeight: 700, color: "var(--text-sub)", marginBottom: 6, marginTop: 14 },
  p:       { fontSize: 13, color: "var(--text-2)", lineHeight: 1.85, margin: "0 0 8px" },
  badge:   (color) => ({
    display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: 1,
    background: color + "22", border: `1px solid ${color}55`, borderRadius: 4,
    padding: "1px 7px", color, verticalAlign: "middle",
  }),
  row:     { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 },
  icon:    { fontSize: 16, flexShrink: 0, marginTop: 1 },
  label:   { fontSize: 12, fontWeight: 700, color: "var(--text-sub)", marginBottom: 2 },
  desc:    { fontSize: 12, color: "var(--text-3)", lineHeight: 1.7 },
};

function Section({ emoji, title, children }) {
  return (
    <div style={S.card}>
      <h2 style={S.h2}><span>{emoji}</span>{title}</h2>
      {children}
    </div>
  );
}

function Item({ icon, label, desc }) {
  return (
    <div style={S.row}>
      <span style={S.icon}>{icon}</span>
      <div>
        <div style={S.label}>{label}</div>
        <div style={S.desc}>{desc}</div>
      </div>
    </div>
  );
}

function TabBadge({ label, color = "#888" }) {
  return <span style={S.badge(color)}>{label}</span>;
}

export default function HelpPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      {/* タイトル */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-white)", margin: "0 0 6px", letterSpacing: 1 }}>
          使い方ガイド
        </h1>
        <p style={{ fontSize: 12, color: "var(--text-4)", margin: 0 }}>
          🚬 喫煙所 SF6支部 — スト6攻略まとめサイト
        </p>
      </div>

      {/* 基本的な使い方 */}
      <Section emoji="🗂️" title="基本的な使い方">
        <Item
          icon="◀"
          label="サイドバーでキャラを選択"
          desc="左のサイドバーからキャラクターをクリックして切り替えます。上部の ◀▶ ボタンでサイドバーを開閉できます。"
        />
        <Item
          icon="★"
          label="お気に入り登録"
          desc="サイドバーでキャラにホバーすると ☆ が表示されます。クリックするとお気に入り登録され、サイドバー上部の「★ FAVORITES」に常時表示されます。キャラページの名前横の ☆ からも登録できます。"
        />
        <Item
          icon="☀️"
          label="ダーク / ライトモード"
          desc="右上の ☀️ / 🌙 ボタンで切り替えられます。設定はブラウザに保存されます。"
        />
      </Section>

      {/* 各タブ */}
      <Section emoji="📑" title="キャラページのタブ">
        <p style={S.p}>キャラを選択すると以下のタブが表示されます。</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { tab: "🏠 トップ",         color: "#7c3aed", desc: "キャラの概要・基本ステータス（体力・ステップ・無敵技の有無）・強み弱み・クラシック/モダンの違いをまとめています。" },
            { tab: "🥊 立ち回り",       color: "#2980b9", desc: "自由記述の立ち回りメモページです。「編集する」ボタンからマークダウン形式で自由に書き込めます。コマンドアイコンや見出しなども使えます。" },
            { tab: "🔗 コンボ",         color: "#e67e22", desc: "コミュニティが投稿したコンボ一覧です。クラシック/モダン切替・キーワード検索・始動技フィルターが使えます。動画・画像の添付も可能です。" },
            { tab: "🔄 セットプレイ",   color: "#27ae60", desc: "起き攻めなどのセットプレイを状況別にまとめています。コンボ同様コミュニティ投稿形式で、クラシック/モダン切替ができます。" },
            { tab: "📊 フレーム表",     color: "#c9a227", desc: "全技のフレームデータ一覧です。発生・持続・硬直・ヒット時/ガード時有利不利を確認できます。有利/不利フィルターで絞り込みも可能です。" },
            { tab: "⚔️ 各キャラ対策",  color: "#e74c3c", desc: "対戦相手のキャラを選んで、そのキャラへの対策メモを記事形式で書き込めます。キャラごとに独立して保存されます。" },
          ].map(({ tab, color, desc }) => (
            <div key={tab} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <TabBadge label={tab} color={color} />
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7, flex: 1 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 戦績 */}
      <Section emoji="📊" title="戦績ページ">
        <Item
          icon="🔢"
          label="CFN IDを入力して戦績を取得"
          desc="サイドバー上部の「戦績」ボタンを押し、Street Fighter 6 のCFN short ID（数字）を入力すると対戦履歴・勝率・使用キャラ統計などを表示します。"
        />
        <Item
          icon="📈"
          label="キャラ別・モード別の集計"
          desc="使用キャラごとの勝率グラフ、最近の対戦履歴、よく当たる相手キャラなどを確認できます。"
        />
      </Section>

      {/* コミュニティ投稿 */}
      <Section emoji="✍️" title="コンボ / セットプレイの投稿">
        <Item
          icon="➕"
          label="投稿ボタンから追加"
          desc="コンボ・セットプレイタブにある「+ 投稿」ボタンからクラシック/モダン別にコンボを投稿できます。ログイン不要です。"
        />
        <Item
          icon="🎬"
          label="動画・画像の添付"
          desc="GIF・MP4・画像ファイルを添付してコンボを視覚的に共有できます。"
        />
        <Item
          icon="🕹️"
          label="コマンド表記"
          desc="コマンド入力欄では「↓↘→+P」のような方向キー表記を使います。入力すると自動的にアイコン表示されます。"
        />
      </Section>

      {/* コマンド対応表 */}
      <Section emoji="🕹️" title="コマンド入力対応表">
        <p style={S.p}>コンボ・セットプレイ・記事のコマンド欄で使える記法の一覧です。</p>

        {/* 方向入力 */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, marginTop: 4, letterSpacing: 1 }}>方向入力（テンキー or 矢印どちらでも可）</div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4, maxWidth: 200, marginBottom: 16,
        }}>
          {[["7↖","8↑","9↗"],["4←","5N","6→"],["1↙","2↓","3↘"]].map((row, ri) =>
            row.map((cell, ci) => {
              const [num, arrow] = [cell[0], cell.slice(1)];
              return (
                <div key={`${ri}-${ci}`} style={{
                  background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
                  padding: "6px 4px", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4,
                }}>
                  <CommandRenderer command={num} />
                  <span style={{ fontSize: 9, color: "var(--text-5)" }}>{num} / {arrow}</span>
                </div>
              );
            })
          )}
        </div>

        {/* ボタン */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>ボタン（日本語・英語どちらでも同じアイコン）</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[
            ["弱P / LP", "弱P"],
            ["中P / MP", "中P"],
            ["強P / HP", "強P"],
            ["弱K / LK", "弱K"],
            ["中K / MK", "中K"],
            ["強K / HK", "強K"],
            ["P（パンチ）", "P"],
            ["K（キック）", "K"],
          ].map(([label, cmd]) => (
            <div key={cmd} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* モダン */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>モダン操作（弱/L・中/M・強/H どちらでも可）</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[["弱 / L", "弱"], ["中 / M", "中"], ["強 / H", "強"], ["SP（必殺技）", "SP"], ["ANY（何でも攻撃）", "ANY"], ["AUTO", "AUTO"]].map(([label, cmd]) => (
            <div key={cmd} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 溜め */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>溜め入力（[ ] で囲む）</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[
            ["[4]6LP → ソニックブーム風", "[4]6LP"],
            ["[2]8LK → フラッシュキック風", "[2]8LK"],
          ].map(([label, cmd]) => (
            <div key={cmd} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* モーションショートカット */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>モーションショートカット</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[
            ["QCF（236）", "QCF"],
            ["QCB（214）", "QCB"],
            ["360", "360"],
          ].map(([label, cmd]) => (
            <div key={cmd} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* バッジ */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>特殊バッジ</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[
            ["SA1 / SA2 / SA3", "SA1"], ["CA", "CA"],
            ["OD（オーバードライブ）", "OD"],
            ["DI（ドライブインパクト）", "DI"],
            ["DP（ドライブパリィ）", "DP"],
            ["DASH（ダッシュ）", "DASH"],
            ["3x（3回）", "3x"],
          ].map(([label, cmd]) => (
            <div key={cmd} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* セパレータ */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", marginBottom: 8, letterSpacing: 1 }}>セパレータ・修飾</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            ["＋ 同時押し", "LP+LK"],
            ["▶ or > 連続入力", "236LP>CA"],
            ["J. ジャンプ", "J.HP"],
            ["投（投げ）", "投"],
            ["N（ニュートラル）", "N"],
            ["（メモ）コンテキスト", "236LP（ヒット確認）"],
          ].map(([label, cmd]) => (
            <div key={label} style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
              padding: "6px 10px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <CommandRenderer command={cmd} />
              <span style={{ fontSize: 10, color: "var(--text-4)" }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 対策記事 */}
      <Section emoji="📝" title="記事の書き方（立ち回り・対策）">
        <Item
          icon="✏️"
          label="編集ボタンから記事エディタを開く"
          desc="「立ち回り」タブの「編集する」ボタン、または「各キャラ対策」タブでキャラを選んだ後の「記事を編集」ボタンからエディタが開きます。リアルタイムプレビュー付きです。"
        />
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 8, fontWeight: 700 }}>記事の書式</div>
          {[
            ["## テキスト",           "大見出し（セクション区切り）"],
            ["### テキスト",          "小見出し"],
            ["### 技名 [[236K]]",     "コマンド付き小見出し"],
            ["**テキスト**",          "太字"],
            ["[[236K]]",             "コマンドアイコン（見出し・文中ともに統一）"],
            ["---",                  "◆ 区切り線（同一セクション内の小区切り）"],
            ["![画像URL]",            "画像の挿入"],
          ].map(([syntax, desc]) => (
            <div key={syntax} style={{ display: "flex", gap: 16, marginBottom: 5, alignItems: "baseline" }}>
              <code style={{ fontSize: 11, color: "#5aad5a", fontFamily: "monospace", flexShrink: 0, minWidth: 190 }}>{syntax}</code>
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
