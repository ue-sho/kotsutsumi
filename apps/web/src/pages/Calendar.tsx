import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { clsx } from 'clsx';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: calendarData } = useQuery({
    queryKey: ['work-logs', 'calendar', year, month],
    queryFn: async () => {
      const response = await api.get(`/work_logs/calendar/${year}/${month}`);
      return response.data;
    },
  });

  const calendar = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [year, month]);

  const workLogsByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    if (calendarData) {
      for (const log of calendarData) {
        const date = log.workDate;
        if (!map.has(date)) {
          map.set(date, []);
        }
        map.get(date)!.push(log);
      }
    }
    return map;
  }, [calendarData]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>
        <p className="mt-1 text-gray-600">月別の作業記録を確認できます</p>
      </div>

      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={goToPreviousMonth} className="btn-outline p-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {year}年{month}月
            </h2>
            <button onClick={goToToday} className="btn-outline text-sm">
              今日
            </button>
          </div>
          <button onClick={goToNextMonth} className="btn-outline p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={clsx(
                'text-center text-sm font-medium py-2',
                index === 0 && 'text-red-500',
                index === 6 && 'text-blue-500',
              )}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendar.map((day, index) => {
            const date = day ? formatDate(day) : null;
            const logs = date ? workLogsByDate.get(date) : null;
            const dayOfWeek = index % 7;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() + 1 &&
              year === new Date().getFullYear();

            return (
              <div
                key={index}
                className={clsx(
                  'min-h-24 p-2 border border-gray-100 rounded-lg',
                  day && 'hover:bg-gray-50',
                  !day && 'bg-gray-50',
                )}
              >
                {day && (
                  <>
                    <div
                      className={clsx(
                        'text-sm font-medium mb-1',
                        dayOfWeek === 0 && 'text-red-500',
                        dayOfWeek === 6 && 'text-blue-500',
                        isToday &&
                          'w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center',
                      )}
                    >
                      {day}
                    </div>
                    {logs && logs.length > 0 && (
                      <div className="space-y-1">
                        {logs.slice(0, 2).map((log: any) => (
                          <Link
                            key={log.id}
                            to={`/work-logs/${log.id}`}
                            className={clsx(
                              'block text-xs p-1 rounded truncate',
                              log.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : log.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700',
                            )}
                          >
                            {log.title}
                          </Link>
                        ))}
                        {logs.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{logs.length - 2}件
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
