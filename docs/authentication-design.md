# 認証設計

## 1. 概要

本ドキュメントでは、目標管理・行動記録アプリの認証機能の設計を定義する。

### 1.1 認証要件（requirements.md より）

- ユーザー登録（ユーザー名、メールアドレス、パスワード）
- ログイン / ログアウト
- 自分のユーザー情報取得
- 編集は本人のみ、閲覧は非ログインでも可能
- ロール・権限管理は行わない

---

## 2. 認証方式

### 2.1 採用方式: JWT（JSON Web Token）+ Cookie

| 項目 | 選定 |
|------|------|
| 認証方式 | JWT |
| トークン格納 | HttpOnly Cookie |
| セッション管理 | ステートレス（JWT ベース） |

### 2.2 選定理由

1. **シンプルさ**: MVP として必要十分な機能
2. **ステートレス**: サーバー側でセッション管理不要
3. **セキュリティ**: HttpOnly Cookie で XSS 対策
4. **拡張性**: 将来的に OAuth 追加も容易

### 2.3 代替案との比較

| 方式 | メリット | デメリット | 採否 |
|------|----------|------------|------|
| JWT + Cookie | シンプル、ステートレス | リフレッシュトークン管理が必要 | **採用** |
| Session + Cookie | 実装が簡単 | サーバー側でセッション管理必要 | 不採用 |
| JWT + localStorage | 実装が簡単 | XSS に脆弱 | 不採用 |
| OAuth のみ | パスワード管理不要 | 自前認証より複雑、依存性 | 将来検討 |

---

## 3. トークン設計

### 3.1 アクセストークン

```typescript
interface AccessTokenPayload {
  sub: string;      // ユーザーID (UUID)
  username: string; // ユーザー名
  iat: number;      // 発行日時
  exp: number;      // 有効期限
}
```

| 項目 | 値 |
|------|-----|
| 有効期限 | 15分 |
| 署名アルゴリズム | HS256 |
| 格納場所 | HttpOnly Cookie (`access_token`) |

### 3.2 リフレッシュトークン

```typescript
interface RefreshTokenPayload {
  sub: string;  // ユーザーID (UUID)
  jti: string;  // トークンID（一意識別子）
  iat: number;  // 発行日時
  exp: number;  // 有効期限
}
```

| 項目 | 値 |
|------|-----|
| 有効期限 | 7日 |
| 署名アルゴリズム | HS256 |
| 格納場所 | HttpOnly Cookie (`refresh_token`) |

### 3.3 トークンローテーション

リフレッシュ時に新しいリフレッシュトークンを発行（ローテーション）することで、セキュリティを向上させる。

---

## 4. Cookie 設定

```typescript
const cookieOptions = {
  httpOnly: true,     // JavaScript からアクセス不可
  secure: true,       // HTTPS のみ（本番環境）
  sameSite: 'lax',    // CSRF 対策
  path: '/',
};

// アクセストークン用
const accessTokenCookie = {
  ...cookieOptions,
  maxAge: 15 * 60,    // 15分
};

// リフレッシュトークン用
const refreshTokenCookie = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60,  // 7日
};
```

---

## 5. API エンドポイント

### 5.1 認証 API

| エンドポイント | メソッド | 説明 | 認証 |
|---------------|---------|------|------|
| `/api/auth/signup` | POST | ユーザー登録 | 不要 |
| `/api/auth/login` | POST | ログイン | 不要 |
| `/api/auth/logout` | POST | ログアウト | 必要 |
| `/api/auth/refresh` | POST | トークンリフレッシュ | リフレッシュトークン |
| `/api/auth/me` | GET | 現在のユーザー情報取得 | 必要 |

### 5.2 リクエスト・レスポンス

#### POST /api/auth/signup

**リクエスト:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "displayName": "John Doe"
}
```

**レスポンス (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

**Cookie:** `access_token`, `refresh_token` が設定される

#### POST /api/auth/login

**リクエスト:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**レスポンス (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

**Cookie:** `access_token`, `refresh_token` が設定される

#### POST /api/auth/logout

**レスポンス (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Cookie:** `access_token`, `refresh_token` が削除される

#### POST /api/auth/refresh

**レスポンス (200 OK):**
```json
{
  "message": "Token refreshed successfully"
}
```

**Cookie:** 新しい `access_token`, `refresh_token` が設定される

#### GET /api/auth/me

**レスポンス (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

---

## 6. パスワードポリシー

### 6.1 要件

| 項目 | 条件 |
|------|------|
| 最小文字数 | 8文字 |
| 最大文字数 | 128文字 |
| 必須文字種 | 英大文字、英小文字、数字を各1文字以上 |
| 禁止 | ユーザー名・メールアドレスを含むパスワード |

### 6.2 ハッシュ化

| 項目 | 値 |
|------|-----|
| アルゴリズム | bcrypt |
| コストファクター | 12 |

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// ハッシュ化
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

// 検証
const isValid = await bcrypt.compare(password, passwordHash);
```

---

## 7. 入力バリデーション

### 7.1 ユーザー名

```typescript
const usernameSchema = z
  .string()
  .min(3, 'ユーザー名は3文字以上')
  .max(50, 'ユーザー名は50文字以下')
  .regex(/^[a-zA-Z0-9_]+$/, 'ユーザー名は英数字とアンダースコアのみ');
```

### 7.2 メールアドレス

```typescript
const emailSchema = z
  .string()
  .email('有効なメールアドレスを入力してください')
  .max(255, 'メールアドレスは255文字以下');
```

### 7.3 パスワード

```typescript
const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上')
  .max(128, 'パスワードは128文字以下')
  .regex(/[A-Z]/, '大文字を1文字以上含めてください')
  .regex(/[a-z]/, '小文字を1文字以上含めてください')
  .regex(/[0-9]/, '数字を1文字以上含めてください');
```

---

## 8. セキュリティ対策

### 8.1 実装する対策

| 脅威 | 対策 |
|------|------|
| XSS | HttpOnly Cookie、CSP ヘッダー |
| CSRF | SameSite Cookie、Origin 検証 |
| ブルートフォース | レートリミット（ログイン: 5回/分） |
| パスワード漏洩 | bcrypt ハッシュ化 |
| トークン漏洩 | 短い有効期限、トークンローテーション |
| 中間者攻撃 | HTTPS 必須（本番環境） |

### 8.2 レートリミット

```typescript
// ログインエンドポイント
const loginRateLimit = {
  windowMs: 60 * 1000,  // 1分
  max: 5,               // 最大5回
  message: 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください。',
};

// サインアップエンドポイント
const signupRateLimit = {
  windowMs: 60 * 60 * 1000,  // 1時間
  max: 10,                   // 最大10回
  message: '登録試行回数が多すぎます。しばらく待ってから再試行してください。',
};
```

### 8.3 セキュリティヘッダー

```typescript
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

---

## 9. 認可（Authorization）

### 9.1 認可ルール

本アプリでは「ロール・権限管理はしない」ため、シンプルな認可ルールを適用する。

| リソース | 閲覧 | 作成 | 編集 | 削除 |
|---------|------|------|------|------|
| WeeklyGoal | 誰でも | 本人のみ | 本人のみ | 本人のみ |
| ActionLog | 誰でも | 本人のみ | 本人のみ | 本人のみ |
| DailyNote | 誰でも | 本人のみ | 本人のみ | 本人のみ |
| WeeklySummary | 誰でも | システム | - | - |
| User (プロフィール) | 誰でも | - | 本人のみ | - |

### 9.2 認可チェック実装

```typescript
// ミドルウェア: 認証必須
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: '認証が必要です' });
  }
  next();
}

// ミドルウェア: リソースオーナーチェック
function requireOwner(resourceUserId: string, currentUserId: string) {
  if (resourceUserId !== currentUserId) {
    throw new ForbiddenError('このリソースを操作する権限がありません');
  }
}
```

---

## 10. エラーハンドリング

### 10.1 認証エラーコード

| HTTPステータス | エラーコード | 説明 |
|---------------|-------------|------|
| 400 | `INVALID_INPUT` | 入力値が不正 |
| 401 | `INVALID_CREDENTIALS` | メールアドレスまたはパスワードが間違っている |
| 401 | `TOKEN_EXPIRED` | トークンの有効期限切れ |
| 401 | `TOKEN_INVALID` | トークンが不正 |
| 403 | `FORBIDDEN` | アクセス権限がない |
| 409 | `EMAIL_ALREADY_EXISTS` | メールアドレスが既に登録されている |
| 409 | `USERNAME_ALREADY_EXISTS` | ユーザー名が既に使用されている |
| 429 | `RATE_LIMIT_EXCEEDED` | リクエスト回数制限超過 |

### 10.2 エラーレスポンス形式

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが間違っています"
  }
}
```

---

## 11. フロントエンド実装ガイド

### 11.1 認証状態管理

```typescript
// 認証コンテキスト
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
}
```

### 11.2 自動トークンリフレッシュ

```typescript
// API クライアント: 401 エラー時に自動リフレッシュ
async function apiClient(url: string, options?: RequestInit) {
  let response = await fetch(url, { ...options, credentials: 'include' });

  if (response.status === 401) {
    // トークンリフレッシュを試行
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      // リトライ
      response = await fetch(url, { ...options, credentials: 'include' });
    } else {
      // ログアウト処理
      throw new AuthenticationError('Session expired');
    }
  }

  return response;
}
```

### 11.3 保護されたルート

```typescript
// ルートガード
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
```

---

## 12. 環境変数

```bash
# JWT 設定
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Cookie 設定
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false  # 開発環境では false

# bcrypt 設定
BCRYPT_SALT_ROUNDS=12
```

---

## 13. 将来の拡張

### 13.1 OAuth / ソーシャルログイン

- Google、GitHub などの OAuth プロバイダー対応
- 既存アカウントとの連携機能

### 13.2 二要素認証（2FA）

- TOTP（Google Authenticator 等）対応
- バックアップコード機能

### 13.3 パスワードリセット

- メールによるパスワードリセットリンク送信
- 有効期限付きリセットトークン

### 13.4 セッション管理

- 複数デバイスでのログイン管理
- アクティブセッション一覧表示
- リモートログアウト機能

---

## 14. 実装チェックリスト

### Phase 1: 基本認証（MVP）

- [ ] ユーザー登録 API
- [ ] ログイン API
- [ ] ログアウト API
- [ ] トークンリフレッシュ API
- [ ] 現在のユーザー取得 API
- [ ] 認証ミドルウェア
- [ ] パスワードハッシュ化
- [ ] 入力バリデーション
- [ ] エラーハンドリング

### Phase 2: セキュリティ強化

- [ ] レートリミット実装
- [ ] セキュリティヘッダー設定
- [ ] HTTPS 強制（本番環境）
- [ ] ログイン履歴記録

### Phase 3: 将来拡張

- [ ] パスワードリセット
- [ ] OAuth 対応
- [ ] 二要素認証
