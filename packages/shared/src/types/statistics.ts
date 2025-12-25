export interface DailyStatistics {
  date: string;
  totalMinutes: number;
  workCount: number;
}

export interface WeeklyStatistics {
  weekStart: string;
  weekEnd: string;
  totalMinutes: number;
  workCount: number;
  dailyBreakdown: DailyStatistics[];
}

export interface MonthlyStatistics {
  year: number;
  month: number;
  totalMinutes: number;
  workCount: number;
  dailyBreakdown: DailyStatistics[];
}

export interface CategoryStatistics {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  totalMinutes: number;
  workCount: number;
  percentage: number;
}

export interface StatisticsSummary {
  totalMinutes: number;
  totalWorkCount: number;
  currentStreak: number;
  longestStreak: number;
  categoryBreakdown: CategoryStatistics[];
}

export interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface UserGoal {
  id: number;
  userId: number;
  goalType: 'monthly_hours' | 'daily_streak' | 'category_hours';
  targetValue: number;
  year: number | null;
  month: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserGoalDto {
  goalType: 'monthly_hours' | 'daily_streak' | 'category_hours';
  targetValue: number;
  year?: number;
  month?: number;
}
