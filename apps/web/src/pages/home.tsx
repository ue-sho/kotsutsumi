import { useUser, useLogout } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  const { data: user } = useUser()
  const logout = useLogout()

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">目標管理アプリ</h1>
          <Button variant="outline" onClick={() => logout.mutate()}>
            ログアウト
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ようこそ！</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              こんにちは、{user?.displayName || user?.username} さん
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              目標管理機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
