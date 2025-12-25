import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';

export function WorkLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: workLog, isLoading } = useQuery({
    queryKey: ['work-log', id],
    queryFn: async () => {
      const response = await api.get(`/work_logs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/work_logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-logs'] });
      navigate('/work-logs');
    },
  });

  const handleDelete = () => {
    if (window.confirm('この作業記録を削除しますか？')) {
      deleteMutation.mutate();
    }
  };

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

  if (!workLog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">作業記録が見つかりません</p>
        <Link to="/work-logs" className="btn-primary mt-4 inline-flex">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
        <div className="flex items-center gap-2">
          <Link to={`/work-logs/${id}/edit`} className="btn-outline">
            <Edit className="w-4 h-4 mr-2" />
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            削除
          </button>
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                workLog.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : workLog.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {workLog.status === 'completed'
                ? '完了'
                : workLog.status === 'in_progress'
                  ? '進行中'
                  : '保留'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{workLog.title}</h1>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {workLog.workDate}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {formatDuration(workLog.durationMinutes)}
          </div>
        </div>

        {(workLog.categories?.length > 0 || workLog.tags?.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {workLog.categories?.map((cat: any) => (
              <span
                key={cat.id}
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                {cat.name}
              </span>
            ))}
            {workLog.tags?.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {workLog.content && (
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown>{workLog.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
