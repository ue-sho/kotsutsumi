# 作業記録アプリケーション 要件定義

## アプリケーション概要
毎日の作業内容を記録し、振り返りができる「365日作業ログ」SaaSアプリケーション

**サービス形態**
- マルチテナントSaaS（複数ユーザーが利用）
- toC向けフロントエンド + 管理者向け管理画面

**技術スタック**
- バックエンド: Ruby on Rails（API mode）
- フロントエンド: Next.js（SSR + PWA）
- 管理画面: Rails + Inertia.js

**主な特徴**
- **オフラインファースト**: 未ログイン時もローカルで記録可能
- **自動同期**: ログイン時にローカルデータをクラウドに同期
- **レスポンシブ**: モバイル/タブレット/デスクトップ完全対応
- **PWA対応**: ホーム画面追加でアプリライクに使用可能
- **マルチデバイス**: 複数デバイス間でデータ同期

---

## 1. コア機能（必須）

### 1.1 作業記録管理
- **日次作業ログのCRUD**
  - タイトル
  - 日付
  - 作業時間（分単位）
  - マークダウン対応の本文
  - カテゴリ/タグ付け（例：開発、学習、デバッグ、レビュー）
  - ステータス（進行中、完了、保留）

- **添付ファイル管理**
  - スクリーンショット
  - コードスニペット
  - その他のファイル

### 1.2 検索・フィルタリング
- 日付範囲での検索
- タグ/カテゴリでのフィルタリング
- キーワード全文検索
- ステータスでの絞り込み

### 1.3 カレンダー表示
- 月次カレンダービュー
- 各日の作業有無の可視化
- 連続作業日数のストリーク表示

---

## 2. 統計・分析機能（個人向け）

### 2.1 作業統計
- 自分の日次/週次/月次の作業時間集計
- カテゴリ別作業時間の円グラフ
- 連続作業日数とストリーク記録
- 月別作業量のヒートマップ
- 目標達成率の表示

### 2.2 活動トレンド
- 週別・月別の作業時間推移（折れ線グラフ）
- カテゴリ別作業数の集計
- 最も生産的な曜日・時間帯の分析
- 前月比・前年比の表示

---

## 3. 管理画面機能（Inertia.js検証）
**対象**: システム管理者のみ（toB）

### 3.1 ダッシュボード（全体統計）
- **サービス全体のKPI**
  - 総ユーザー数
  - アクティブユーザー数（DAU/WAU/MAU）
  - 総作業記録数
  - 本日の新規登録ユーザー数
  - 本日の作業記録投稿数

- **成長指標**
  - ユーザー数推移グラフ（日次/週次/月次）
  - 新規登録ユーザー数の推移
  - 作業記録投稿数の推移
  - ユーザーあたりの平均作業記録数
  - 継続率（リテンション）グラフ

- **エンゲージメント指標**
  - 連続利用日数の分布
  - カテゴリ別の人気度ランキング
  - よく使われるタグTOP10
  - デバイス種別の利用割合（モバイル/タブレット/デスクトップ）

### 3.2 ユーザー管理
- **ユーザー一覧**
  - ページネーション・ソート
  - 検索（名前、メールアドレス）
  - フィルタリング（登録日、最終ログイン、ステータス）
  - CSVエクスポート

- **ユーザー詳細**
  - 基本情報（名前、メール、登録日、最終ログイン）
  - 統計情報（作業記録数、総作業時間、連続日数）
  - 最近の作業記録一覧
  - デバイス情報一覧
  - アカウント操作（停止/削除/再有効化）

- **一括操作**
  - 通知メール送信
  - アカウント停止
  - データエクスポート

### 3.3 コンテンツモデレーション
- **作業記録モニタリング**
  - 最近投稿された作業記録一覧
  - 不適切コンテンツのフラグ機能
  - 作業記録の詳細閲覧
  - 必要に応じて削除

- **レポート対応**
  - ユーザーからの通報一覧
  - 通報ステータス管理（未対応/対応中/完了）
  - 対応履歴の記録

### 3.4 システム管理
- **同期ログ監視**
  - 同期エラーログ一覧
  - エラー率の推移グラフ
  - 失敗した同期の再試行

- **パフォーマンス監視**
  - API レスポンスタイム
  - エラー率
  - データベース接続状況
  - ストレージ使用量

- **お知らせ管理**
  - 全ユーザー向けお知らせのCRUD
  - メンテナンス通知の設定
  - プッシュ通知の送信

### 3.5 設定
- **管理者アカウント管理**
  - 管理者追加/削除
  - 権限設定（閲覧のみ/編集可能）

- **システム設定**
  - サービス名称
  - メール送信設定
  - ファイルアップロード容量制限
  - 機能フラグ（新機能のON/OFF）

- **データバックアップ**
  - 手動バックアップ実行
  - バックアップ履歴
  - リストア機能

---

## 4. フロントエンド機能（Next.js SSR検証）
**対象**: 一般ユーザー（toC）

### 4.1 認証機能
- **ユーザー登録**
  - メールアドレス登録
  - パスワード設定
  - メール確認

- **ログイン/ログアウト**
  - メール・パスワード認証
  - ソーシャルログイン（Google/GitHub - 将来的に）
  - パスワードリセット

- **プロフィール管理**
  - 名前・メールアドレス編集
  - プロフィール画像アップロード
  - パスワード変更
  - アカウント削除

### 4.2 作業記録ページ
- **作業記録一覧**
  - カード形式/リスト形式の切り替え
  - ページネーション
  - カテゴリフィルター（サイドバー）
  - タグフィルター
  - 自分の作業記録のみ表示

- **作業記録作成・編集**
  - マークダウンエディタ
  - リアルタイムプレビュー
  - カテゴリ・タグ選択
  - 作業時間入力
  - ステータス選択
  - ファイル添付（ドラッグ&ドロップ対応）
  - オフライン時はローカル保存

- **作業記録詳細ページ**
  - マークダウンのレンダリング
  - コードハイライト表示
  - 添付ファイル表示・ダウンロード
  - 編集・削除ボタン
  - 前後の記録へのナビゲーション

- **カテゴリ・タグ管理**
  - カテゴリのCRUD
  - タグのCRUD
  - カラー・アイコン設定

### 4.3 カレンダービュー
- 月間カレンダー表示
- 日付クリックで詳細モーダル表示
- 作業有無の色分け
- 作業時間によるヒートマップ表示
- 月の切り替え

### 4.4 タイムライン
- 時系列での作業記録表示
- 無限スクロール対応
- 日付でグルーピング
- コンパクトビュー/詳細ビューの切り替え

### 4.5 検索機能
- グローバル検索バー
- リアルタイム検索サジェスト
- 複数条件での絞り込み
  - 日付範囲
  - カテゴリ
  - タグ
  - ステータス
- 検索結果のハイライト表示

### 4.6 統計ページ（個人用）
- 自分の作業統計の可視化
  - 作業時間の推移グラフ
  - カテゴリ別円グラフ
  - 月間ヒートマップ
  - ストリーク表示
- 期間選択（今月、今年、全期間）
- 目標設定（月間作業時間など）
- 達成率表示

### 4.7 オフライン・同期機能
- **ローカルストレージ機能**
  - IndexedDBでの作業記録保存
  - 未ログイン状態でも記録作成可能
  - ローカルデータの永続化
  - ローカルデータの一覧・編集・削除

- **クラウド同期機能**
  - ログイン時に自動同期
  - ローカルデータをクラウドへアップロード
  - クラウドデータをローカルへダウンロード
  - 双方向同期（最終更新日時で競合解決）
  - 同期状態の可視化（同期済み/未同期アイコン）

- **競合解決**
  - タイムスタンプベースの自動マージ
  - 競合発生時のユーザー選択UI
  - 両方保持オプション

- **オフライン検知**
  - オンライン/オフライン状態の検知
  - オフライン時の通知表示
  - オンライン復帰時の自動同期

### 4.8 レスポンシブデザイン
- **モバイル対応（〜767px）**
  - ハンバーガーメニュー
  - タッチ操作最適化
  - カード形式のレイアウト
  - スワイプジェスチャー対応
  - フローティングアクションボタン

- **タブレット対応（768px〜1023px）**
  - 2カラムレイアウト
  - サイドバー折りたたみ可能
  - グリッドビュー最適化

- **デスクトップ対応（1024px〜）**
  - 3カラムレイアウト
  - サイドバー常時表示
  - キーボードショートカット対応
  - ホバーエフェクト

- **共通要件**
  - フルードグリッドシステム
  - タッチとマウス両対応
  - 画像の自動リサイズ
  - フォントサイズの最適化

---

## 5. 技術検証ポイント

### 5.1 Rails API
- **API設計**
  - RESTful API設計
  - JSON API仕様準拠
  - バージョニング戦略

- **認証・認可**
  - JWT認証
  - devise-jwt使用
  - リフレッシュトークン実装

- **パフォーマンス**
  - N+1クエリ対策（bullet gem）
  - キャッシング戦略（Redis）
  - ページネーション（kaminari/pagy）

- **バックグラウンド処理**
  - Sidekiq導入
  - 統計データの定期更新
  - メール送信

- **ファイル管理**
  - Active Storage使用
  - 画像のバリエーション生成
  - S3またはローカルストレージ

### 5.2 Next.js SSR
- **App Router**
  - Server Components活用
  - Client Componentsの適切な分離
  - Streaming SSR検証

- **データフェッチング**
  - Server-side fetching
  - Client-side fetching（SWR/React Query）
  - ISR（Incremental Static Regeneration）検証

- **最適化**
  - 画像最適化（next/image）
  - フォント最適化
  - コード分割

- **SEO**
  - メタデータ管理
  - OGP対応
  - サイトマップ生成

- **ルーティング**
  - 動的ルーティング
  - パラレルルート
  - インターセプトルート

- **PWA対応**
  - Service Worker実装
  - オフラインキャッシング戦略
  - アプリマニフェスト設定
  - インストール可能なWebアプリ
  - プッシュ通知（将来的に）

- **ローカルストレージ管理**
  - IndexedDB統合（Dexie.js使用）
  - ローカルデータの暗号化
  - ストレージ容量管理
  - データのバージョニング

- **同期機能**
  - Background Sync API活用
  - オフライン時のキューイング
  - オンライン復帰時の自動送信
  - 同期競合の検出と解決

- **レスポンシブ対応**
  - Tailwind CSS のブレークポイント活用
  - モバイルファーストデザイン
  - タッチイベント最適化
  - ビューポートメタタグ設定

### 5.3 Inertia.js管理画面
- **フレームワーク選択**
  - Vue.js vs React（どちらを選ぶか検討）

- **Railsとの統合**
  - Inertia.jsのセットアップ
  - サーバーサイドレンダリング
  - フラッシュメッセージの共有

- **フォーム管理**
  - バリデーション（フロント・バック両方）
  - エラーハンドリング
  - ファイルアップロード

- **UI/UX**
  - モーダルダイアログ
  - トースト通知
  - ローディング状態
  - スケルトンスクリーン

- **リアルタイム機能**
  - Action Cable統合
  - 通知のリアルタイム配信

---

## 6. データベース設計

```sql
-- ユーザー
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  encrypted_password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',  -- 'user', 'admin'
  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'suspended', 'deleted'
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- 作業記録
CREATE TABLE work_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  work_date DATE NOT NULL,
  duration_minutes INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  published BOOLEAN DEFAULT FALSE,
  -- 同期関連フィールド
  local_id VARCHAR(36),  -- クライアント側で生成するUUID
  synced BOOLEAN DEFAULT FALSE,  -- クラウドと同期済みかどうか
  last_synced_at TIMESTAMP NULL,  -- 最後に同期した日時
  conflict_status VARCHAR(20),  -- 競合状態 (null, 'pending', 'resolved')
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, work_date),
  INDEX idx_status (status),
  INDEX idx_published (published),
  INDEX idx_local_id (local_id),
  INDEX idx_synced (synced)
);

-- カテゴリ
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sort_order (sort_order)
);

-- タグ
CREATE TABLE tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tag (user_id, name)
);

-- 作業記録とカテゴリの中間テーブル
CREATE TABLE work_log_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  work_log_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_work_log_category (work_log_id, category_id)
);

-- 作業記録とタグの中間テーブル
CREATE TABLE work_log_tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  work_log_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_work_log_tag (work_log_id, tag_id)
);

-- 添付ファイル（Active Storageを使用する場合は不要）
CREATE TABLE attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  work_log_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,
  file_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE
);

-- 統計データ（キャッシュ用）
CREATE TABLE statistics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  stat_date DATE NOT NULL,
  total_minutes INT DEFAULT 0,
  work_count INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_stat_date (user_id, stat_date)
);

-- 同期ログ（トラブルシューティング用）
CREATE TABLE sync_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  work_log_id BIGINT,
  sync_type VARCHAR(20) NOT NULL,  -- 'upload', 'download', 'conflict'
  status VARCHAR(20) NOT NULL,  -- 'success', 'failed', 'pending'
  error_message TEXT,
  synced_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE,
  INDEX idx_user_sync (user_id, synced_at),
  INDEX idx_status (status)
);

-- デバイス情報（複数デバイス対応）
CREATE TABLE devices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(50),  -- 'mobile', 'tablet', 'desktop'
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_device (user_id)
);

-- お知らせ（管理画面から配信）
CREATE TABLE announcements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(20) DEFAULT 'info',  -- 'info', 'warning', 'maintenance'
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  INDEX idx_published (published, published_at)
);

-- ユーザーがお知らせを読んだ記録
CREATE TABLE announcement_reads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  announcement_id BIGINT NOT NULL,
  read_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_announcement (user_id, announcement_id)
);

-- 通報・レポート（不適切コンテンツ）
CREATE TABLE reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reporter_user_id BIGINT NOT NULL,
  reported_work_log_id BIGINT,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'in_progress', 'resolved', 'rejected'
  admin_note TEXT,
  resolved_by_user_id BIGINT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- ユーザー目標設定
CREATE TABLE user_goals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  goal_type VARCHAR(50) NOT NULL,  -- 'monthly_hours', 'daily_streak', 'category_hours'
  target_value INT NOT NULL,
  year INT,
  month INT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_goal (user_id, goal_type)
);
```

---

## 7. API設計例

### 認証
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/logout` - ログアウト
- `POST /api/v1/auth/refresh` - トークンリフレッシュ

### 作業記録
- `GET /api/v1/work_logs` - 一覧取得
- `GET /api/v1/work_logs/:id` - 詳細取得
- `POST /api/v1/work_logs` - 新規作成
- `PATCH /api/v1/work_logs/:id` - 更新
- `DELETE /api/v1/work_logs/:id` - 削除
- `GET /api/v1/work_logs/calendar/:year/:month` - カレンダー用データ

### カテゴリ
- `GET /api/v1/categories` - 一覧取得
- `POST /api/v1/categories` - 新規作成
- `PATCH /api/v1/categories/:id` - 更新
- `DELETE /api/v1/categories/:id` - 削除
- `PATCH /api/v1/categories/reorder` - 並び順変更

### タグ
- `GET /api/v1/tags` - 一覧取得
- `POST /api/v1/tags` - 新規作成
- `DELETE /api/v1/tags/:id` - 削除

### 統計
- `GET /api/v1/statistics/summary` - サマリー取得
- `GET /api/v1/statistics/trends` - トレンドデータ
- `GET /api/v1/statistics/heatmap/:year` - ヒートマップデータ

### 同期（オフライン対応）
- `POST /api/v1/sync/upload` - ローカルデータをクラウドへアップロード
- `GET /api/v1/sync/download` - クラウドデータをダウンロード（最終同期日時以降の変更のみ）
- `POST /api/v1/sync/resolve_conflict` - 競合解決
- `GET /api/v1/sync/status` - 同期ステータス確認
- `POST /api/v1/devices/register` - デバイス登録
- `GET /api/v1/devices` - デバイス一覧

### ユーザープロフィール
- `GET /api/v1/profile` - 自分のプロフィール取得
- `PATCH /api/v1/profile` - プロフィール更新
- `POST /api/v1/profile/avatar` - アバター画像アップロード

### 目標管理
- `GET /api/v1/goals` - 目標一覧取得
- `POST /api/v1/goals` - 目標作成
- `PATCH /api/v1/goals/:id` - 目標更新
- `DELETE /api/v1/goals/:id` - 目標削除

### お知らせ
- `GET /api/v1/announcements` - お知らせ一覧取得
- `POST /api/v1/announcements/:id/read` - お知らせを既読にする

### 管理者API（管理画面用）
#### ダッシュボード
- `GET /api/admin/dashboard/kpis` - KPI取得
- `GET /api/admin/dashboard/growth` - 成長指標取得
- `GET /api/admin/dashboard/engagement` - エンゲージメント指標取得

#### ユーザー管理
- `GET /api/admin/users` - ユーザー一覧取得
- `GET /api/admin/users/:id` - ユーザー詳細取得
- `PATCH /api/admin/users/:id/suspend` - ユーザー停止
- `PATCH /api/admin/users/:id/activate` - ユーザー再有効化
- `DELETE /api/admin/users/:id` - ユーザー削除
- `POST /api/admin/users/bulk_notify` - 一括通知送信

#### コンテンツモデレーション
- `GET /api/admin/work_logs` - 全作業記録一覧
- `DELETE /api/admin/work_logs/:id` - 作業記録削除

#### レポート管理
- `GET /api/admin/reports` - 通報一覧取得
- `PATCH /api/admin/reports/:id` - 通報ステータス更新
- `POST /api/admin/reports/:id/resolve` - 通報を解決

#### お知らせ管理
- `GET /api/admin/announcements` - お知らせ一覧（管理者向け）
- `POST /api/admin/announcements` - お知らせ作成
- `PATCH /api/admin/announcements/:id` - お知らせ更新
- `DELETE /api/admin/announcements/:id` - お知らせ削除
- `POST /api/admin/announcements/:id/publish` - お知らせ公開

#### システム管理
- `GET /api/admin/sync_logs` - 同期ログ一覧
- `GET /api/admin/performance` - パフォーマンス指標

---

## 8. 開発フェーズ提案

### Phase 1: 基本機能（MVP）
**目標**: マルチテナントSaaSの基本機能を実装

- **Rails APIのセットアップ**
  - 認証システム（devise + devise-jwt）
  - ユーザー登録・ログイン
  - 作業記録のCRUD API（ユーザーごとのデータ分離）
  - カテゴリ・タグのCRUD API

- **Next.js フロントエンド（toC）**
  - ユーザー登録・ログインUI
  - 作業記録の作成・編集・削除
  - 作業記録一覧・詳細表示
  - カテゴリ・タグ管理
  - レスポンシブ対応

- **管理画面（Inertia.js）の基礎**
  - 管理者認証
  - 基本的なダッシュボード（総ユーザー数、作業記録数）
  - ユーザー一覧表示

**成果物**:
- ユーザー登録・ログインが可能
- 各ユーザーが自分の作業記録を管理できる
- 管理者がユーザー情報を確認できる
- モバイル・デスクトップ両対応

---

### Phase 2: オフライン対応・データ可視化
**目標**: PWA化とユーザー統計機能の追加

- **オフライン・同期機能**
  - PWA対応（Service Worker、マニフェスト）
  - IndexedDBでのローカルストレージ実装
  - 未ログイン時のローカル保存
  - ログイン時の同期機能
  - 競合解決UI

- **ユーザー向け統計機能**
  - 個人統計APIの実装
  - カレンダービューの実装
  - 統計ページ（グラフ・ヒートマップ）
  - ストリーク表示
  - 目標設定機能

- **管理画面の統計強化**
  - KPIダッシュボード
  - 成長指標グラフ
  - エンゲージメント指標

**成果物**:
- オフラインで作業記録が可能
- ログイン時に自動同期される
- カレンダー・統計グラフで振り返りができる
- 管理者がサービス全体の成長を確認できる

---

### Phase 3: 管理機能・コンテンツモデレーション
**目標**: SaaS運営に必要な管理機能の追加

- **管理画面の強化**
  - ユーザー管理機能（詳細表示、停止/削除）
  - コンテンツモデレーション機能
  - 通報・レポート管理
  - お知らせ管理・配信
  - 同期ログ監視

- **ユーザー向け機能**
  - お知らせ表示
  - 通報機能
  - タイムライン表示

- **ファイルアップロード機能**
  - Active Storage統合
  - 画像プレビュー
  - ドラッグ&ドロップアップロード

**成果物**:
- 管理者がユーザーを適切に管理できる
- 不適切コンテンツへの対応が可能
- ユーザーへのお知らせ配信が可能
- ファイル添付ができる

---

### Phase 4: 高度な機能・最適化
**目標**: 検索機能強化とパフォーマンス最適化

- **検索機能の強化**
  - 全文検索（PostgreSQL Full-Text Search）
  - リアルタイムサジェスト
  - 複合条件検索

- **リアルタイム機能**
  - Action Cable統合
  - お知らせのリアルタイム配信
  - 同期状態のリアルタイム表示

- **パフォーマンス最適化**
  - N+1クエリの完全排除
  - Redis キャッシング
  - CDN設定
  - 画像最適化
  - データベースインデックス最適化

- **SEO対策**
  - メタタグ最適化
  - OGP設定
  - サイトマップ生成

**成果物**:
- 高速な検索が可能
- リアルタイム通知が届く
- ページ表示が高速
- SEO対策完了

---

### Phase 5: テスト・デプロイ
**目標**: 本番運用開始

- **テスト体制の構築**
  - RSpec（Rails API）
  - Jest/React Testing Library（Next.js）
  - E2Eテスト（Playwright）
  - カバレッジ80%以上

- **デプロイ環境構築**
  - Docker化
  - CI/CD（GitHub Actions）
  - ステージング環境構築
  - 本番環境デプロイ

- **監視・ログ**
  - エラートラッキング（Sentry）
  - アクセス解析（Google Analytics）
  - パフォーマンス監視

- **ドキュメント整備**
  - API仕様書
  - 運用マニュアル
  - ユーザーガイド

**成果物**:
- 本番環境で安定稼働
- 自動テスト・デプロイ体制
- エラー監視体制
- 完全なドキュメント

---

## 9. 技術スタック詳細

### バックエンド（Rails）
- **フレームワーク**: Ruby on Rails 7.1+ (API mode)
- **Ruby**: 3.2+
- **データベース**: PostgreSQL 15+
- **認証**: devise + devise-jwt
- **マルチテナント**: acts_as_tenant / apartment (検討)
- **ファイルストレージ**: Active Storage (AWS S3 / GCS)
- **ジョブキュー**: Sidekiq + Redis
- **API**: JSON API仕様
- **CORS**: rack-cors
- **ページネーション**: kaminari / pagy
- **シリアライザ**: jsonapi-serializer / active_model_serializers
- **テスト**: RSpec, FactoryBot, Faker

### フロントエンド（Next.js）
- **フレームワーク**: Next.js 14+ (App Router)
- **React**: 18+
- **TypeScript**: 5+
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand / Jotai
- **データフェッチング**: SWR / TanStack Query
- **フォーム**: React Hook Form + Zod
- **グラフ**: Recharts / Chart.js
- **PWA**: next-pwa, Workbox
- **ローカルストレージ**: Dexie.js (IndexedDB wrapper)
- **マークダウン**: react-markdown, remark-gfm
- **コードハイライト**: prismjs / highlight.js
- **テスト**: Jest, React Testing Library

### 管理画面（Inertia.js）
- **Inertia.js**: 1.0+
- **フロントフレームワーク**: React / Vue.js（選択）
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui / Headless UI

### インフラ・ツール
- **コンテナ**: Docker + Docker Compose
- **キャッシュ**: Redis
- **全文検索**: PostgreSQL Full-Text Search（or Elasticsearch）
- **CI/CD**: GitHub Actions
- **デプロイ**: Heroku / AWS / Render（選択）

---

## 10. 次のステップ

1. **技術選定の確定**
   - 管理画面: React vs Vue.js
   - データフェッチング: SWR vs TanStack Query
   - デプロイ先の決定

2. **プロジェクト初期化**
   - Rails API プロジェクト作成
   - Next.js プロジェクト作成
   - Inertia.js セットアップ

3. **Phase 1 の実装開始**
   - 認証システム構築
   - 基本CRUD実装
   - 管理画面の基礎構築

---

**最終更新日**: 2025年12月1日
