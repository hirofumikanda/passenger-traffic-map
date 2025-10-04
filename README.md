# 🚆 駅乗降客数マップ

日本の鉄道路線と駅の乗降客数を可視化するインタラクティブなWebマップアプリケーションです。

## 🎯 機能

- **インタラクティブマップ**: 日本全国の鉄道路線と駅をパン・ズーム・探索
- **路線種別表示**: JR線、JR新幹線、その他私鉄を異なるスタイルで表示
  - **JR新幹線**: 青ベース + 白破線の旗竿パターン
  - **JR線**: 黒ベース + 白破線の旗竿パターン  
  - **その他路線**: グレーの実線
- **駅情報表示**: 乗降客数に応じた円のサイズで駅を表示
- **路線名ラベル**: 線路に沿って路線名を表示

## デモ
[GitHub Pagesで公開中](https://hirofumikanda.github.io/passenger-traffic-map)

## 🚀 クイックスタート

### 前提条件

- Node.js (v18以上)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/hirofumikanda/passenger-traffic-map.git
cd passenger-traffic-map

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは `http://localhost:5173` で利用できます

## 🗺️ データソース

- **鉄道路線データ**: 国土数値情報（鉄道データ）から取得
- **駅乗降客数データ**: 国土数値情報（駅乗降客数データ）2023年の統計データから取得
- **都道府県データ**: 国土数値情報（行政区域データ）から取得

## 🏗️ 技術アーキテクチャ

### 主要技術スタック

- **React 19** - 最新機能を備えたUIフレームワーク
- **TypeScript** - 型安全な開発
- **MapLibre GL JS** - 高性能ベクターマップレンダリング
- **PMTiles** - 効率的なベクタータイル形式
- **Vite** - 高速ビルドツールと開発サーバー

### コンポーネント構造

```
src/
├── components/
│   └── MapView.tsx          # メインマップコンテナコンポーネント
├── hooks/
│   └── useMapInit.ts        # マップ初期化とセットアップ
└── utils/
    ├── popup.ts             # 路線・駅情報ポップアップハンドラー
    └── pointer.ts           # マウスインタラクションハンドラー
```

### データ構造

- **PMTilesファイル**: `public/data/` ディレクトリ内に格納
  - `rail_road.pmtiles`: 鉄道路線データ
  - `station_passengers_2023.pmtiles`: 駅乗降客数データ
  - `prefectures.pmtiles`: 都道府県境界データ
  - `prefectures_label.pmtiles`: 都道府県名ラベル
- **スタイル定義**: `public/styles/style.json` でMapLibreスタイルを定義

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。
