import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: Implement admin user detail API

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
      </div>

      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">ユーザー詳細</h1>
        <p className="text-gray-500">ユーザーID: {id}</p>
        <p className="text-gray-500 mt-4">機能は後ほど実装されます</p>
      </div>
    </div>
  );
}
