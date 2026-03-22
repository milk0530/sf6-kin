# DooD SF6攻略

Street Fighter 6 のキャラクター別攻略データベースサイト。

## 対応キャラクター

- キンバリー
- ジェイミー
- ブランカ
- エレナ

## ページ構成

| ページ | 内容 |
|---|---|
| トップ | 概要・強み弱み・ステータス |
| 立ち回り | 立ち回りのコンセプト解説 |
| コンボ | コンボ一覧（難易度・ダメージ・ゲージ） |
| セットプレイ | 起き攻め・重ね・有利展開まとめ |
| フレーム表 | 主要技のフレームデータ |
| 各キャラ対策 | 相性評価と対策コメント |

## セットアップ

```bash
npm install
npm run dev
```

## ビルド・デプロイ

```bash
npm run build   # dist/ に出力
npm run preview # ビルド確認
```

`dist/` フォルダを以下の任意のホスティングサービスにデプロイできます：

- **Vercel** — `vercel deploy`
- **Netlify** — `dist/` をドラッグ&ドロップ
- **GitHub Pages** — `gh-pages` ブランチに `dist/` を push

## ファイル構成

```
src/
├── main.jsx              # エントリーポイント
├── App.jsx               # ルートコンポーネント（状態管理・ルーティング）
├── index.css             # グローバルスタイル
├── constants/
│   └── styles.js         # デザイントークン（色定数など）
├── data/
│   ├── index.js          # バレルエクスポート
│   ├── characters.js     # キャラクター一覧
│   ├── tabs.js           # タブ定義
│   └── charData/
│       ├── kimberly.js   # キンバリーデータ
│       ├── jamie.js      # ジェイミーデータ
│       ├── blanka.js     # ブランカデータ
│       └── elena.js      # エレナデータ
├── components/
│   ├── Header.jsx        # ヘッダー
│   ├── Sidebar.jsx       # キャラ選択サイドバー
│   ├── CharHeader.jsx    # キャラ名 + タブバー
│   ├── CommentSection.jsx# コメント投稿欄
│   ├── ui/
│   │   ├── StatBar.jsx   # ステータスバー
│   │   ├── Tag.jsx       # タグバッジ
│   │   └── HoverCard.jsx # ホバーアニメーション付きカード
│   └── cards/
│       ├── ComboCard.jsx    # コンボカード
│       └── SetplayCard.jsx  # セットプレイカード
└── pages/
    ├── TopPage.jsx       # トップページ
    ├── MovePage.jsx      # 立ち回りページ
    ├── ComboPage.jsx     # コンボページ
    ├── SetplayPage.jsx   # セットプレイページ
    ├── FramePage.jsx     # フレーム表ページ
    └── MatchupPage.jsx   # 各キャラ対策ページ
```

## キャラクターデータの追加方法

1. `src/data/charData/` に新しいファイル（例：`ryu.js`）を作成
2. `src/data/index.js` でインポートして `CHAR_DATA` に追加
3. `src/data/characters.js` の `CHARACTERS` 配列にエントリを追加
