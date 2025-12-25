import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

export function UsersPage() {
  const [search, setSearch] = useState('');

  // TODO: Implement admin users API
  const users: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="mt-1 text-gray-600">登録ユーザーを管理できます</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="名前またはメールアドレスで検索..."
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ユーザー</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">登録日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">最終ログイン</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name || '未設定'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : user.status === 'suspended'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.status === 'active'
                          ? '有効'
                          : user.status === 'suspended'
                            ? '停止'
                            : '削除済み'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.createdAt}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.lastLoginAt || '-'}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/users/${user.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">ユーザーがいません</p>
        )}
      </div>
    </div>
  );
}
