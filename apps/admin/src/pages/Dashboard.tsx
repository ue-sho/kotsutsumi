import { Users, FileText, TrendingUp, Activity } from 'lucide-react';

export function DashboardPage() {
  // TODO: Implement admin dashboard API
  const stats = {
    totalUsers: 0,
    totalWorkLogs: 0,
    activeUsers: 0,
    newUsersToday: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-gray-600">サービス全体の状況を確認できます</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">総作業記録数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkLogs}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">アクティブユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">本日の新規登録</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近の登録ユーザー</h2>
          <p className="text-gray-500 text-center py-8">データがありません</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近の作業記録</h2>
          <p className="text-gray-500 text-center py-8">データがありません</p>
        </div>
      </div>
    </div>
  );
}
