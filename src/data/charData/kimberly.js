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
    combos: [
      { id: 1, name: "しゃがみ弱P始動 ノーゲージ",      input: "しゃがみ弱P×3 > 弱流天一文字",                                            damage: 1161, meter: "なし",        difficulty: "★☆☆", note: "発生4Fの最速暴れ始動。コンボ後+3Fで投げ択へ" },
      { id: 2, name: "立ち中K始動 ラッシュコンボ",       input: "立ち中K > キャンセルラッシュ > しゃがみ中P×2 > 武神虎連牙 > 疾駆け > 影すくい", damage: 1950, meter: "Dゲージ3本",  difficulty: "★★☆", note: "メイン牽制からの主力コンボ。一気に画面端まで運べる" },
      { id: 3, name: "ラッシュしゃがみ中攻撃始動",       input: "DRしゃがみ中P > しゃがみ中P > 武神虎連牙 > OD疾駆け > OD武神鉾刃脚 > 疾駆け > 胴刎ね", damage: 2550, meter: "Dゲージ3本",  difficulty: "★★★", note: "起き攻めから。OD技で画面端に運ぶルート" },
      { id: 4, name: "SA2コンボ",                       input: "しゃがみ中K > SA2",                                                        damage: 2900, meter: "SAゲージ2本",  difficulty: "★☆☆", note: "SA2の基本始動。ヒット確認してから" },
      { id: 5, name: "倒し切りコンボ（SA3）",            input: "しゃがみ弱P×2 > DRしゃがみ強P > 強流天一文字 > ジャンプ中P > SA2",           damage: 3800, meter: "Dゲージ4本+SA3", difficulty: "★★★", note: "相手の体力が半分以下の時に狙う。SA3でダメージUPも" },
    ],
    setplays: [
      { id: 1, title: "細工手裏剣設置起き攻め",       situation: "画面端", after: "コンボ後の有利状況",                 action: "強細工手裏剣設置 → 起き攻め", advantage: "+3F",  tags: ["端", "有利", "SA2後"],   note: "起き攻めがヒットすれば爆発でコンボに繋がり、ガードされても攻め継続できる。前投げ後も成立。", difficulty: "★★☆" },
      { id: 2, title: "前ステ2回から弱P重ね（中央）", situation: "画面中央", after: "通常投げ",                          action: "前ステ×2 → しゃがみ弱P重ね", advantage: "+3F",  tags: ["有利", "中央", "投げ後"], note: "最も基本の起き攻め。密着+3Fで投げとしゃがみ弱Kの択へ。", difficulty: "★☆☆" },
      { id: 3, title: "影すくい後の起き攻め",         situation: "画面端", after: "影すくい（疾駆けキャンセル）",         action: "前ステ×2 → アシスト強攻撃重ね", advantage: "+11F", tags: ["端", "有利"],             note: "影すくい後は前ステ2回で密着+11F。アシスト強攻撃（立ち強K相当）が重なる。", difficulty: "★★☆" },
      { id: 4, title: "OD武神鉾刃脚後のセットプレイ", situation: "画面端", after: "OD疾駆け > OD武神鉾刃脚 > 疾駆け > 胴刎ね", action: "強細工手裏剣設置 → 投げ",   advantage: "−",    tags: ["端", "OD", "コンボ継続"], note: "胴刎ねのダウン後に細工手裏剣を最速設置。投げと打撃の択がかかった状態で爆発が爆ぜる。", difficulty: "★★★" },
      { id: 5, title: "SA3後の全画面起き攻め",        situation: "全画面", after: "SA3（武神顕現神楽）",                  action: "前ステ×3 → しゃがみ弱P重ね", advantage: "+4F",  tags: ["SA3", "有利", "全画面"],  note: "SA3後の大きな有利フレームを活用。SA3後はダメージが10%UP状態なので更に強気に攻める。", difficulty: "★★☆" },
    ],
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
    combos: [
      { id: 1, name: "しゃがみ弱攻撃始動 ノーゲージ",   input: "しゃがみ弱攻撃×3 > 弱流天一文字",                                              damage: 1296, meter: "なし",        difficulty: "★☆☆", note: "暴れ・咄嗟の反撃から。コンボ後+3Fで投げ択へ" },
      { id: 2, name: "しゃがみ弱攻撃始動 ゲージあり",   input: "しゃがみ弱攻撃×2 > DRしゃがみ弱攻撃 > 武神虎連牙 > 疾駆け > 影すくい",           damage: 1441, meter: "Dゲージ3本",  difficulty: "★★☆", note: "影すくい後は前ステ2回で密着+11F。画面端に到達したら追撃可" },
      { id: 3, name: "DRしゃがみ中攻撃始動",            input: "DRしゃがみ中攻撃 > 武神虎連牙 > 疾駆け > 影すくい > 中武神旋風脚",                damage: 2237, meter: "Dゲージ1本",  difficulty: "★★☆", note: "ガードさせて+5Fで攻め継続。画面端に到達していれば武神旋風脚で追撃" },
      { id: 4, name: "アシスト中攻撃始動 ダメージ重視", input: "アシスト中攻撃 > DRしゃがみ中攻撃 > しゃがみ強P > 強流天一文字 > ジャンプ中P > 空中武神旋風脚", damage: 2226, meter: "Dゲージ3本",  difficulty: "★★★", note: "相手の残り体力が3,000程度ならSA2に置き換えて倒し切り可能" },
      { id: 5, name: "アシスト強攻撃始動 起き攻め重視", input: "アシスト強攻撃 > 武神虎連牙 > OD疾駆け > OD武神鉾刃脚 > 疾駆け > 胴刎ね > 強細工手裏剣", damage: 2269, meter: "Dゲージ2本",  difficulty: "★★☆", note: "中央から画面端セットプレイへ。細工手裏剣の設置タイミングは少し遅らせる" },
      { id: 6, name: "倒し切りコンボ（SA3）",           input: "アシスト強攻撃 > 立ち中攻撃 > DRアシスト強攻撃 > しゃがみ強P×2 > 弱流天一文字 > SA3", damage: 4920, meter: "Dゲージ6本+SA3", difficulty: "★★★", note: "相手の体力が半分以下で狙う。モダン入力SA3でダメージ変化なし" },
    ],
    setplays: [
      { id: 1, title: "前ステ2回から弱P重ね（中央）", situation: "画面中央", after: "通常投げ",                          action: "前ステ×2 → しゃがみ弱攻撃重ね", advantage: "+3F",  tags: ["有利", "中央", "投げ後"], note: "モダンでも成立する基本起き攻め。密着+3Fで投げと下段択へ。", difficulty: "★☆☆" },
      { id: 2, title: "影すくい後の起き攻め",         situation: "画面端", after: "疾駆け > 影すくい",                   action: "前ステ×2 → アシスト強攻撃重ね", advantage: "+11F", tags: ["端", "有利"],             note: "影すくい後は前ステ2回で密着+11F。アシスト強攻撃が重なる。", difficulty: "★★☆" },
      { id: 3, title: "細工手裏剣設置起き攻め",       situation: "画面端", after: "OD武神鉾刃脚 > 疾駆け > 胴刎ね",      action: "強細工手裏剣設置 → 起き攻め", advantage: "−",    tags: ["端", "OD", "コンボ継続"], note: "コマンド入力で細工手裏剣を設置できる。設置後は投げと打撃の択がかかった状態で爆発。", difficulty: "★★★" },
    ],
  },
};

export default kimberly;
