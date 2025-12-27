# データベース設計

## 1. エンティティ一覧

| エンティティ | 説明 |
|--------------|------|
| User | ユーザー（認証・プロフィール） |
| Goal | 目標（週単位の達成条件を持つ） |
| ActionLog | 行動記録（日々の実績） |
| DailyNote | 日次メモ（その日の状況・感情） |
| WeeklySummary | 週次集計（達成判定結果） |

---

## 2. ER図（概念）

```
┌──────────┐       ┌──────────┐
│   User   │───┬───│   Goal   │
└──────────┘   │   └──────────┘
               │         │
               │         │ 1:N
               │         ▼
               │   ┌────────────┐
               │   │ ActionLog  │
               │   └────────────┘
               │
               │ 1:N
               ▼
         ┌────────────┐
         │ DailyNote  │
         └────────────┘

┌──────────┐       ┌───────────────┐
│   User   │──────▶│ WeeklySummary │
└──────────┘       └───────────────┘
                          │
                          │ N:1
                          ▼
                    ┌──────────┐
                    │   Goal   │
                    └──────────┘
```

---

## 3. テーブル定義

### 3.1 User（ユーザー）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | ユーザー名（公開URL用） |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| display_name | VARCHAR(100) | | 表示名 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス:**
- `idx_user_username` (username)
- `idx_user_email` (email)

**備考:**
- `username` は公開 URL（`/u/{username}`）に使用
- パスワードは bcrypt でハッシュ化

---

### 3.2 Goal（目標）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK, NOT NULL | 所有ユーザー |
| title | VARCHAR(200) | NOT NULL | 目標タイトル |
| description | TEXT | | 詳細説明 |
| goal_type | ENUM | NOT NULL | 目標種別 |
| target_value | INT | NOT NULL | 週間目標値 |
| target_unit | VARCHAR(20) | NOT NULL | 単位（分, 回, 冊 など） |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | アクティブフラグ |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**goal_type（目標種別）:**
- `TIME`: 時間系（例：週20時間）
- `COUNT`: 回数系（例：週14回）
- `COMPLETION`: 完了系（例：週1冊）

**インデックス:**
- `idx_goal_user_id` (user_id)
- `idx_goal_user_active` (user_id, is_active)

---

### 3.3 ActionLog（行動記録）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| goal_id | VARCHAR(36) | FK, NOT NULL | 対象目標 |
| user_id | VARCHAR(36) | FK, NOT NULL | 所有ユーザー（冗長化） |
| date | DATE | NOT NULL | 記録日 |
| value | INT | NOT NULL | 実績値 |
| note | TEXT | | メモ（任意） |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**インデックス:**
- `idx_action_log_goal_date` (goal_id, date)
- `idx_action_log_user_date` (user_id, date)

**備考:**
- 1日に同じ目標に対して複数記録可能
- `value` の意味は `Goal.goal_type` に依存
  - TIME: 分単位
  - COUNT: 回数
  - COMPLETION: 1（完了）/ 0（未完了）

---

### 3.4 DailyNote（日次メモ）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK, NOT NULL | 所有ユーザー |
| date | DATE | NOT NULL | 記録日 |
| content | TEXT | NOT NULL | メモ内容 |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**制約:**
- `UNIQUE (user_id, date)` - 1日1メモ

**インデックス:**
- `idx_daily_note_user_date` (user_id, date)

---

### 3.5 WeeklySummary（週次集計）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK, NOT NULL | 所有ユーザー |
| goal_id | VARCHAR(36) | FK, NOT NULL | 対象目標 |
| week_start | DATE | NOT NULL | 週開始日（月曜） |
| total_value | INT | NOT NULL | 週間合計値 |
| target_value | INT | NOT NULL | 目標値（スナップショット） |
| is_achieved | BOOLEAN | NOT NULL | 達成フラグ |
| created_at | DATETIME | NOT NULL | 作成日時 |
| updated_at | DATETIME | NOT NULL | 更新日時 |

**制約:**
- `UNIQUE (user_id, goal_id, week_start)` - 週×目標で一意

**インデックス:**
- `idx_weekly_summary_user_week` (user_id, week_start)
- `idx_weekly_summary_goal_week` (goal_id, week_start)

**備考:**
- `target_value` は Goal の値をスナップショットとして保存（目標変更の影響を受けない）
- 週の開始は月曜日（ISO 8601）

---

## 4. Prisma スキーマ

```prisma
model User {
  id           String    @id @default(uuid())
  username     String    @unique @db.VarChar(50)
  email        String    @unique @db.VarChar(255)
  passwordHash String    @map("password_hash") @db.VarChar(255)
  displayName  String?   @map("display_name") @db.VarChar(100)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  goals          Goal[]
  actionLogs     ActionLog[]
  dailyNotes     DailyNote[]
  weeklySummaries WeeklySummary[]

  @@map("users")
}

model Goal {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  title       String   @db.VarChar(200)
  description String?  @db.Text
  goalType    GoalType @map("goal_type")
  targetValue Int      @map("target_value")
  targetUnit  String   @map("target_unit") @db.VarChar(20)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  actionLogs      ActionLog[]
  weeklySummaries WeeklySummary[]

  @@index([userId])
  @@index([userId, isActive])
  @@map("goals")
}

model ActionLog {
  id        String   @id @default(uuid())
  goalId    String   @map("goal_id")
  userId    String   @map("user_id")
  date      DateTime @db.Date
  value     Int
  note      String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  goal Goal @relation(fields: [goalId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([goalId, date])
  @@index([userId, date])
  @@map("action_logs")
}

model DailyNote {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  date      DateTime @db.Date
  content   String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
  @@map("daily_notes")
}

model WeeklySummary {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  goalId      String   @map("goal_id")
  weekStart   DateTime @map("week_start") @db.Date
  totalValue  Int      @map("total_value")
  targetValue Int      @map("target_value")
  isAchieved  Boolean  @map("is_achieved")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  goal Goal @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@unique([userId, goalId, weekStart])
  @@index([userId, weekStart])
  @@index([goalId, weekStart])
  @@map("weekly_summaries")
}

enum GoalType {
  TIME       // 時間系
  COUNT      // 回数系
  COMPLETION // 完了系
}
```

---

## 5. 設計判断メモ

### 5.1 ID 戦略
- **UUID** を採用（公開 URL に含まれるため推測困難にする）
- 代替案: ULID（ソート可能）も検討可能

### 5.2 週の定義
- **ISO 8601** に準拠（月曜始まり）
- `week_start` は常に月曜日の日付を格納

### 5.3 ActionLog の user_id
- `Goal` 経由で取得可能だが、クエリ効率のため冗長に保持
- ユーザーの日別記録一覧を高速に取得可能

### 5.4 WeeklySummary の target_value
- 目標変更の影響を受けないようスナップショット
- 過去の達成率を正確に計算可能

### 5.5 論理削除 vs 物理削除
- MVP では **物理削除**（`ON DELETE CASCADE`）
- 将来的に `deleted_at` を追加して論理削除に移行可能

### 5.6 公開機能
- `username` を使った公開 URL（`/u/{username}`）
- 別途「公開/非公開」フラグは設けない（MVP）
