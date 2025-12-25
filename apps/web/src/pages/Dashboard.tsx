import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, Flame, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface StatsSummary {
  totalMinutes: number;
  totalWorkCount: number;
  currentStreak: number;
  longestStreak: number;
}

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery<StatsSummary>({
    queryKey: ['statistics', 'summary'],
    queryFn: async () => {
      const response = await api.get('/statistics/summary');
      return response.data;
    },
  });

  const { data: recentLogs } = useQuery({
    queryKey: ['work-logs', 'recent'],
    queryFn: async () => {
      const response = await api.get('/work_logs', { params: { limit: 5 } });
      return response.data.data;
    },
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-gray-600">作業記録の概要を確認できます</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">総記録数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalWorkCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">総作業時間</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(stats?.totalMinutes || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">現在のストリーク</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.currentStreak || 0}日</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">最長ストリーク</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.longestStreak || 0}日</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent logs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近の作業記録</h2>
        <div className="card">
          {recentLogs && recentLogs.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentLogs.map((log: any) => (
                <li key={log.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{log.title}</p>
                      <p className="text-sm text-gray-500">{log.workDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {formatDuration(log.durationMinutes)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : log.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {log.status === 'completed'
                          ? '完了'
                          : log.status === 'in_progress'
                            ? '進行中'
                            : '保留'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">まだ作業記録がありません</p>
          )}
        </div>
      </div>
    </div>
  );
}
