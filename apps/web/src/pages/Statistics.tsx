import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '@/lib/api';

type Period = 'week' | 'month' | 'year';

export function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('month');

  const { data: summary } = useQuery({
    queryKey: ['statistics', 'summary'],
    queryFn: async () => {
      const response = await api.get('/statistics/summary');
      return response.data;
    },
  });

  const { data: trends } = useQuery({
    queryKey: ['statistics', 'trends', period],
    queryFn: async () => {
      const response = await api.get('/statistics/trends', { params: { period } });
      return response.data;
    },
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">統計</h1>
        <p className="mt-1 text-gray-600">作業データの統計を確認できます</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">総作業時間</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(summary?.totalMinutes || 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">総記録数</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.totalWorkCount || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">現在のストリーク</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.currentStreak || 0}日</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">最長ストリーク</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.longestStreak || 0}日</p>
        </div>
      </div>

      {/* Trends chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">作業時間の推移</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  period === p
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p === 'week' ? '週' : p === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
        </div>

        {trends && trends.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(mins) => `${Math.floor(mins / 60)}h`}
                />
                <Tooltip
                  labelFormatter={(date) => date}
                  formatter={(value: number) => [formatDuration(value), '作業時間']}
                />
                <Line
                  type="monotone"
                  dataKey="totalMinutes"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">データがありません</p>
        )}
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">カテゴリ別作業時間</h2>

        {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.categoryBreakdown}
                    dataKey="totalMinutes"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ categoryName, percentage }) => `${categoryName} (${percentage}%)`}
                  >
                    {summary.categoryBreakdown.map((entry: any, index: number) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatDuration(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {summary.categoryBreakdown.map((cat: any, index: number) => (
                <div key={cat.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: cat.categoryColor || COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-900">{cat.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">
                      {formatDuration(cat.totalMinutes)}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">({cat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">データがありません</p>
        )}
      </div>
    </div>
  );
}
