import React from 'react'

interface HeaderProps {
  title?: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* ページタイトル */}
        <div>
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
        </div>

        {/* 右側のアクション */}
        <div className="flex items-center space-x-4">
          {/* 通知ボタン */}
          <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <span className="text-xl">🔔</span>
            {/* 未読バッジ */}
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* ユーザーメニュー */}
          <div className="relative">
            <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="font-medium text-gray-700">管理者</span>
              <span className="text-gray-400">▼</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
