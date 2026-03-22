const kimberly = {
  wip: false,

  overview:
    "素早いドライブラッシュや姿を消して移動する疾駆けを駆使し、相手を翻弄しながら戦うキャラ。攻撃性能は全キャラ中トップクラスで、一度攻めのターンを掴めばKOまで持ち込む爆発力がある。一方でOD無敵技を持たず防御面が弱いため、攻め続けることで弱点をカバーする立ち回りが求められる。",

  // ─── 基本ステータス ──────────────────────────────────────
  hp: 10000,
  stats: [
    { label: "前ステップ",    value: "18F",  icon: "→" },
    { label: "バックステップ", value: "23F",  icon: "←" },
    { label: "OD無敵技",     value: "無",    icon: "🛡" },
    { label: "SA1無敵",      value: "有",    icon: "✦" },
  ],

  // ─── 強み・弱み ──────────────────────────────────────────
  strengths: [
    "攻めのバリエーションが全キャラトップクラス",
    "画面端の細工手裏剣セットプレイが超強力",
    "SA3使用後は移動速度UP＋ダメージ10%上昇",
    "中段の「風車」はヒット時コンボに繋がる",
  ],
  weaknesses: [
    "OD無敵技なし、切り返しはSA1のみ",
    "SA1は発生が遅くガードされやすい",
    "攻め継続に複数パターンの使い分けが必要で練度が求められる",
  ],

  // ─── クラシック/モダンの違い ─────────────────────────────
  modernUnavailable: [
    "立ち弱K",
    "しゃがみ中P",
  ],
  modernInputOnly: [
    "召雷細工（コマンド入力なら使用可）",
    "細工手裏剣（コマンド入力なら使用可）",
  ],
  classicAdvantage:
    "しゃがみ中PがヒットでSA2で+7F有利、コンボルートが豊富。疾駆けがコマンド入力のためダメージ補正なし（モダンは簡易入力固定で80%補正）。",
  modernAdvantage:
    "強武神旋風脚が1ボタンで出るため対空が安定する。SA1も1ボタンで出せるため、クラシックより防御面を補強できる。",

  // ─── 各キャラ対策 ─────────────────────────────────────────
  matchups: [
    { char: "リュウ",     rating: "五分",  color: "#c0392b", tips: "波動拳には前ステで詰める。昇竜に注意しつつ投げを混ぜる。" },
    { char: "ルーク",     rating: "微不利", color: "#e67e22", tips: "リーチ差がある。フラッシュナックルに注意しつつダイブキックで間合いを詰めたい。" },
    { char: "チュンリー", rating: "微有利", color: "#2980b9", tips: "百裂脚に割り込める技を覚えよう。接近戦では優位。" },
    { char: "ガイル",     rating: "不利",  color: "#27ae60", tips: "ソニックブームが辛い。肘落としで飛び道具をかわしつつ接近。ゲージを溜めてOD疾駆けで一気に距離を詰める。" },
    { char: "ケン",       rating: "五分",  color: "#e74c3c", tips: "暴れが強いので差し合いで。投げと中下段で崩しを展開。" },
  ],

  // ─── クラシック ──────────────────────────────────────────
  classic: {
    playstyle:
      "しゃがみ中Pを始動にしたコンボが豊富で火力が出やすい。疾駆けからの影すくい（下段）と風車（中段）の択が強力。細工手裏剣を使った画面端セットプレイが最大の強み。OD疾駆け＞OD武神鉾刃脚で相手を画面端まで運んでから爆発力を発揮する。",
    moves: [
      { label: "立ち弱P",     startup: 5,  onBlock: "-2", onHit: "+5",    cancel: "C", note: "発生が早い。連打やコンボ繋ぎに" },
      { label: "立ち中P",     startup: 6,  onBlock: "-2", onHit: "+3",    cancel: "C", note: "コンボ中継技。キャンセル可能" },
      { label: "立ち中K",     startup: 8,  onBlock: "-4", onHit: "+1",    cancel: "C", note: "メイン牽制。ラッシュ仕込みで高リターン" },
      { label: "立ち強P",     startup: 9,  onBlock: "-4", onHit: "+3",    cancel: "C", note: "前進しながらリーチ長い。パニカンで高リターン" },
      { label: "立ち強K",     startup: 12, onBlock: "+2", onHit: "+7",    cancel: "✕", note: "ガードさせて有利。攻め継続" },
      { label: "しゃがみ弱P", startup: 4,  onBlock: "-1", onHit: "+4",    cancel: "C", note: "発生4F最速暴れ。コンボ始動" },
      { label: "しゃがみ中P", startup: 6,  onBlock: "-1", onHit: "+7",    cancel: "C", note: "ヒット+7Fで武神虎連牙へ繋がる核心技。モダン不可" },
      { label: "しゃがみ中K", startup: 7,  onBlock: "+1", onHit: "+5",    cancel: "✕", note: "下段で有利。コンボへ繋ぎやすい" },
      { label: "しゃがみ強P", startup: 8,  onBlock: "-2", onHit: "+3",    cancel: "C", note: "対空通常技。強制立ち効果あり" },
      { label: "しゃがみ強K", startup: 8,  onBlock: "-10", onHit: "ダウン", cancel: "✕", note: "スライディング。下段でダウン" },
      { label: "水切り蹴り",  startup: 11, onBlock: "-5", onHit: "+1",    cancel: "✕", note: "飛び道具をくぐれる特殊技" },
      { label: "風車",        startup: 22, onBlock: "-3", onHit: "+4",    cancel: "✕", note: "中段。ヒット時コンボ可能な貴重な択" },
      { label: "強武神旋風脚", startup: 8, onBlock: "-35", onHit: "ダウン", cancel: "✕", note: "対空無敵技。早めに出して安定対空" },
    ],
    combos: [],
    setplays: [],
  },

  // ─── モダン ──────────────────────────────────────────────
  modern: {
    playstyle:
      "しゃがみ中Pが使えない代わりに1ボタン対空（強武神旋風脚）と1ボタンSA1で防御面を補強できるのが最大の強み。疾駆けが簡易入力固定でダメージ80%補正がかかるため、クラシックよりコンボ火力は落ちる。立ち中Kからのラッシュコンボとアシスト技を活用してシンプルに攻め続けるスタイルが基本。",
    moves: [
      { label: "立ち弱P",            startup: 5,  onBlock: "-2", onHit: "+5",    cancel: "C", note: "コンボ繋ぎ。モダンでも使用可能" },
      { label: "立ち中P",            startup: 6,  onBlock: "-2", onHit: "+3",    cancel: "C", note: "コンボ中継。モダンでも使用可能" },
      { label: "アシスト中攻撃(立ち中K相当)", startup: 8, onBlock: "-4", onHit: "+1", cancel: "C", note: "メイン牽制。ラッシュ仕込みで高リターン" },
      { label: "立ち強P",            startup: 9,  onBlock: "-4", onHit: "+3",    cancel: "C", note: "確定反撃の起点。パニカンで高リターン" },
      { label: "アシスト強攻撃(立ち強K相当)", startup: 12, onBlock: "+2", onHit: "+7", cancel: "✕", note: "ガードさせて有利。起き攻めに多用" },
      { label: "しゃがみ弱P",        startup: 4,  onBlock: "-1", onHit: "+4",    cancel: "C", note: "発生4F最速暴れ。コンボ始動" },
      { label: "しゃがみ中K",        startup: 7,  onBlock: "+1", onHit: "+5",    cancel: "✕", note: "下段で有利。しゃがみ中Pの代替始動" },
      { label: "しゃがみ強P",        startup: 8,  onBlock: "-2", onHit: "+3",    cancel: "C", note: "対空通常技。強制立ち効果あり" },
      { label: "1ボタン武神旋風脚",   startup: 8,  onBlock: "-35", onHit: "ダウン", cancel: "✕", note: "1ボタン対空。モダン最大のアドバンテージ" },
      { label: "1ボタンSA1",         startup: 10, onBlock: "-25", onHit: "ダウン", cancel: "✕", note: "1ボタン割り込み。防御面を大きく補強" },
    ],
    combos: [],
    setplays: [],
  },
};

export default kimberly;
