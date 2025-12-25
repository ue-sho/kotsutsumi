import { useState } from 'react';
import { Plus } from 'lucide-react';

export function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Implement admin announcements API
  const announcements: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">お知らせ管理</h1>
          <p className="mt-1 text-gray-600">ユーザーへのお知らせを管理できます</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          新規作成
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">お知らせを作成</h2>
          <form className="space-y-4">
            <div>
              <label className="label">タイトル</label>
              <input type="text" className="input" placeholder="お知らせのタイトル" />
            </div>
            <div>
              <label className="label">内容</label>
              <textarea className="input" rows={4} placeholder="お知らせの内容" />
            </div>
            <div>
              <label className="label">種類</label>
              <select className="input">
                <option value="info">お知らせ</option>
                <option value="warning">注意</option>
                <option value="maintenance">メンテナンス</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                作成
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {announcements.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {announcements.map((announcement: any) => (
              <li key={announcement.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      announcement.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {announcement.published ? '公開中' : '下書き'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-8">お知らせがありません</p>
        )}
      </div>
    </div>
  );
}
