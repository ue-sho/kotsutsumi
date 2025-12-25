import { useState } from 'react';
import { Search } from 'lucide-react';

export function WorkLogsPage() {
  const [search, setSearch] = useState('');

  // TODO: Implement admin work logs API
  const workLogs: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">作業記録</h1>
        <p className="mt-1 text-gray-600">全ユーザーの作業記録を確認できます</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="タイトルで検索..."
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {workLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">タイトル</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ユーザー</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">日付</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {workLogs.map((log: any) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{log.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.user?.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.workDate}</td>
                    <td className="py-3 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">作業記録がありません</p>
        )}
      </div>
    </div>
  );
}
