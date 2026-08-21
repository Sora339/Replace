## Replace (Roguelike Code Battle)

ブラウザで動くコード構築型ローグライクです。ノード（コード断片）を並べて「RUN」し、敵と戦闘しながらショップや報酬でビルドを強化します。Next.js 16 をベースに、Nanostores でクライアント状態管理、Drizzle + Postgres で永続化、NextAuth (GitHub) で認証を行っています。

### 主な機能
- **コードで戦うローグライク**: ノードを並べて実行。敵やボスのステータスは周回でスケール。
- **マップ進行**: battle / shop / boss を周回し、3 周目以降ボスへ。
- **アイテム・ショップ**: 戦闘後にランダム報酬、ショップでの入れ替え。
- **セーブ / ロード**: `Save Game Result` ボタンで進行状況を「SAVED」として保存し、My Page から冒険再開。クリア/ゲームオーバー時は履歴として保存し、新規開始。
- **マイページ**: 最新 3 件の結果表示、ステータス・アイテム・コードのスナップショーを参照。

### 技術スタック
- Next.js 16 / React 19
- TypeScript / ESLint
- Tailwind CSS 4 (oxide/lightningcss)
- Nanostores (クライアント状態)
- Drizzle ORM + Postgres (JSON カラムでスナップショット保存)
- NextAuth (GitHub プロバイダ)
- Hono (API ルーティングラッパ)

### プロジェクト構成 (主要)
- `src/app/` … Next.js app routes  
  - `game/page.tsx` … 認証後ゲーム画面  
  - `mypage/page.tsx` … セーブ履歴と再開ボタン  
  - `api/[[...route]]/route.ts` … Hono で API ルーティング
- `src/components/` … UI (Game, Map, Editor, Shop, Stats, Modals, Save ボタン等)
- `src/store/game.ts` … Nanostores でゲーム状態/進行管理とリセット関数
- `src/lib/transpiler.ts` … ノード列を実行し戦闘ロジックを進行、結果保存呼び出し
- `src/server/controllers/` … Hono コントローラ (`postResult`, `getResult`)
- `src/server/models/resultSchemas.ts` … API バリデーション
- `src/db/schema.ts` … Drizzle スキーマ (game_results など)
- `src/auth.ts` … NextAuth 設定 (GitHub プロバイダ)

### データベース: game_results テーブル
- `id`, `user_id`, `cycle` (整数: 周回/戦闘カウント近似), `code` (JSON: ノード配列)
- `items_snapshot` (JSON), `stats_snapshot` (JSON: `{ player, progress? }` 形式を想定)
- `status`: `SAVED` | `COMPLETED` | `GAME_OVER`
- `created_at`

### セーブ/ロードの挙動
- **手動セーブ**: ゲーム画面右下の `Save Game Result` (`src/components/GameButton.tsx`) を押下すると、現在のノード/アイテム/プレイヤーステータス/進行（battleCount, currentEventIndex, gameState, events）を `SAVED` として保存し `/mypage` へ遷移。`SAVED` 状態が既にあれば上書き。
- **自動保存（結果）**: トランスパイラ内でクリア/ゲームオーバー時に `status` を `COMPLETED` / `GAME_OVER` で保存。
- **ロード**: `/game` 初期表示時に最新の `SAVED` をロードして復元。`COMPLETED` / `GAME_OVER` またはセーブ無しの場合はリセットして新規開始し、新たな `SAVED` レコードを作成。

### ゲームの流れ (概要)
1) `/mypage` から「冒険に出る」でゲーム開始（認証必須）。  
2) マップで左回り/右回りを選択 → 最初のイベントへ。  
3) エディタでノードを並べ、`RUN` で実行。  
4) 戦闘に勝利すると報酬モーダルでアイテム獲得、次イベントへ。  
5) ショップでアイテム入れ替え。  
6) 3 周目終了でボス戦へ。  
7) クリア/ゲームオーバー後は結果モーダルからマイページへ戻る（新規開始準備）。

### 認証
- NextAuth (GitHub) を使用。`src/app/login/page.tsx` から GitHub でサインイン。


### メモ / 実装ノート
- 状態管理は Nanostores。`resetGameState` でプレイヤー/敵/イベント/ログ/ショップをまとめて初期化。
- トランスパイラ (`src/lib/transpiler.ts`) はノードをコード化し実行、進行とダメージ計算を更新。バリデーション（enemyType 未設定、if/end 対応不足）も簡易チェック。
- UI は Tailwind 4 (PostCSS preset) ベース。`src/app/globals.css` にグローバルスタイル。
- API は Hono で `/api/game/result` (POST 保存) と `/api/mypage/results` (GET 履歴) を提供。
