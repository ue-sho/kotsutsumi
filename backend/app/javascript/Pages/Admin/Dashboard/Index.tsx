import React from 'react'
import Layout from '@/Components/Admin/Layout'

interface Stats {
  total_users: number
  active_users: number
  total_work_logs: number
  new_users_today: number
}

interface Props {
  stats: Stats
}

export default function Dashboard({ stats }: Props) {
  return (
    <Layout title="ダッシュボード">
      <div className="space-y-6">
        {/* KPI カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="総ユーザー数"
            value={stats.total_users}
            icon="👥"
          />
          <StatCard
            title="アクティブユーザー"
            value={stats.active_users}
            icon="✅"
          />
          <StatCard
            title="総作業記録数"
            value={stats.total_work_logs}
            icon="📝"
          />
          <StatCard
            title="本日の新規登録"
            value={stats.new_users_today}
            icon="🎉"
          />
        </div>

        {/* ウェルカムメッセージ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ようこそ、管理画面へ
          </h2>
          <p className="text-gray-600">
            Inertia.js + React + TypeScript のセットアップが完了しました！
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>✅ Rails 8.1.1</p>
            <p>✅ Vite + React</p>
            <p>✅ Inertia.js</p>
            <p>✅ TypeScript</p>
            <p>✅ Tailwind CSS</p>
            <p>✅ サイドバー + ヘッダーレイアウト</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
