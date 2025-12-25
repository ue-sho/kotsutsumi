import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

const workLogSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  content: z.string().optional(),
  workDate: z.string().min(1, '日付を選択してください'),
  durationMinutes: z.number().min(0, '0以上の値を入力してください'),
  status: z.enum(['in_progress', 'completed', 'on_hold']),
});

type WorkLogFormData = z.infer<typeof workLogSchema>;

export function WorkLogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: workLog, isLoading } = useQuery({
    queryKey: ['work-log', id],
    queryFn: async () => {
      const response = await api.get(`/work_logs/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkLogFormData>({
    resolver: zodResolver(workLogSchema),
    defaultValues: {
      title: '',
      content: '',
      workDate: new Date().toISOString().split('T')[0],
      durationMinutes: 0,
      status: 'in_progress',
    },
  });

  useEffect(() => {
    if (workLog) {
      reset({
        title: workLog.title,
        content: workLog.content || '',
        workDate: workLog.workDate,
        durationMinutes: workLog.durationMinutes,
        status: workLog.status,
      });
    }
  }, [workLog, reset]);

  const mutation = useMutation({
    mutationFn: async (data: WorkLogFormData) => {
      if (isEditing) {
        await api.patch(`/work_logs/${id}`, data);
      } else {
        await api.post('/work_logs', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-logs'] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['work-log', id] });
      }
      navigate('/work-logs');
    },
  });

  const onSubmit = (data: WorkLogFormData) => {
    mutation.mutate(data);
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEditing ? '作業記録を編集' : '新しい作業記録'}
        </h1>

        {mutation.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            保存に失敗しました。もう一度お試しください。
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="label">
              タイトル
            </label>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="作業タイトルを入力"
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="workDate" className="label">
                日付
              </label>
              <input id="workDate" type="date" className="input" {...register('workDate')} />
              {errors.workDate && (
                <p className="mt-1 text-sm text-red-600">{errors.workDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="durationMinutes" className="label">
                作業時間（分）
              </label>
              <input
                id="durationMinutes"
                type="number"
                min="0"
                className="input"
                {...register('durationMinutes', { valueAsNumber: true })}
              />
              {errors.durationMinutes && (
                <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="label">
              ステータス
            </label>
            <select id="status" className="input" {...register('status')}>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
              <option value="on_hold">保留</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="label">
              内容（マークダウン対応）
            </label>
            <textarea
              id="content"
              rows={10}
              className="input font-mono text-sm"
              placeholder="作業の詳細を記入してください..."
              {...register('content')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">
              キャンセル
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : isEditing ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
