import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Clock } from 'lucide-react';
import api from '@/lib/api';

export function WorkLogsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['work-logs', { search, status, page }],
    queryFn: async () => {
      const response = await api.get('/work_logs', {
        params: { search, status: status || undefined, page, limit: 10 },
      });
      return response.data;
    },
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">作業記録</h1>
          <p className="mt-1 text-gray-600">すべての作業記録を管理できます</p>
        </div>
        <Link to="/work-logs/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          新規作成
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="検索..."
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">すべてのステータス</option>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
              <option value="on_hold">保留</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work logs list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((log: any) => (
            <Link key={log.id} to={`/work-logs/${log.id}`} className="block">
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{log.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{log.workDate}</p>
                    {log.content && (
                      <p className="text-gray-600 mt-2 line-clamp-2">{log.content}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {log.categories?.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                      ))}
                      {log.tags?.map((tag: any) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{formatDuration(log.durationMinutes)}</span>
                    </div>
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
              </div>
            </Link>
          ))}

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                className="btn-outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.meta.hasPreviousPage}
              >
                前へ
              </button>
              <span className="text-sm text-gray-600">
                {data.meta.page} / {data.meta.totalPages}
              </span>
              <button
                className="btn-outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.meta.hasNextPage}
              >
                次へ
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">作業記録がありません</p>
          <Link to="/work-logs/new" className="btn-primary mt-4 inline-flex">
            <Plus className="w-5 h-5 mr-2" />
            最初の記録を作成
          </Link>
        </div>
      )}
    </div>
  );
}
