# Kotsutsumi - 365日作業ログ

毎日の作業内容を記録し、振り返りができる作業ログアプリケーション。

## 技術スタック

- **バックエンド**: NestJS (TypeScript)
- **フロントエンド**: React SPA (TypeScript, Vite)
- **管理画面**: React SPA (TypeScript, Vite)
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **スタイリング**: Tailwind CSS
- **パッケージ管理**: pnpm (monorepo)

## プロジェクト構成

```
kotsutsumi/
├── apps/
│   ├── api/           # NestJS バックエンド
│   ├── web/           # React SPA (一般ユーザー向け)
│   └── admin/         # React SPA (管理画面)
├── packages/
│   └── shared/        # 共通の型定義
├── docs/              # ドキュメント
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## セットアップ

### 前提条件

- Node.js 20以上
- pnpm 9以上
- PostgreSQL 15以上

### インストール

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp apps/api/.env.example apps/api/.env

# データベースのセットアップ
cd apps/api
pnpm db:generate
pnpm db:push
```

### 開発サーバーの起動

```bash
# すべてのアプリを起動
pnpm dev

# 個別に起動
pnpm --filter @kotsutsumi/api dev      # API: http://localhost:3000
pnpm --filter @kotsutsumi/web dev      # Web: http://localhost:5173
pnpm --filter @kotsutsumi/admin dev    # Admin: http://localhost:5174
```

## API ドキュメント

開発サーバー起動後、以下のURLでSwagger UIを確認できます:

- http://localhost:3000/api/docs

## 主な機能

### ユーザー向け (Web)

- 作業記録のCRUD
- カテゴリ・タグ管理
- カレンダービュー
- 統計・グラフ表示
- オフライン対応 (PWA)

### 管理者向け (Admin)

- ダッシュボード
- ユーザー管理
- 作業記録モニタリング
- お知らせ管理

## ライセンス

Private
