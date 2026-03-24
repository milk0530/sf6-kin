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
            ["## テキスト",        "大見出し"],
            ["### テキスト",       "小見出し"],
            ["### 技名 [コマンド]", "コマンド付き小見出し"],
            ["**テキスト**",       "太字"],
            ["[[コマンド]]",       "インラインコマンドアイコン"],
            ["---",               "区切り線"],
            ["![画像URL]",         "画像の挿入"],
          ].map(([syntax, desc]) => (
            <div key={syntax} style={{ display: "flex", gap: 16, marginBottom: 5, alignItems: "baseline" }}>
              <code style={{ fontSize: 11, color: "#5aad5a", fontFamily: "monospace", flexShrink: 0, minWidth: 180 }}>{syntax}</code>
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
