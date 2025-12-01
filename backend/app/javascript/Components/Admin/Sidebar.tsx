import React from 'react'
import { Link } from '@inertiajs/react'

interface NavItem {
  name: string
  href: string
  icon: string
  current?: boolean
}

const navigation: NavItem[] = [
  { name: 'ダッシュボード', href: '/admin', icon: '📊' },
  { name: 'ユーザー管理', href: '/admin/users', icon: '👥' },
  { name: '作業記録', href: '/admin/work_logs', icon: '📝' },
  { name: 'レポート', href: '/admin/reports', icon: '📋' },
  { name: 'お知らせ', href: '/admin/announcements', icon: '📢' },
  { name: '設定', href: '/admin/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const currentPath = window.location.pathname

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* ロゴエリア */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">
          作業ログ管理
        </h1>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = currentPath === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center rounded-lg px-3 py-2 text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* フッター */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">管理者</p>
            <p className="text-xs text-gray-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
