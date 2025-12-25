import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: number) {
    const [totalStats, categoryStats, streakData] = await Promise.all([
      this.getTotalStats(userId),
      this.getCategoryStats(userId),
      this.getStreakData(userId),
    ]);

    return {
      totalMinutes: totalStats._sum.durationMinutes ?? 0,
      totalWorkCount: totalStats._count,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      categoryBreakdown: categoryStats,
    };
  }

  async getTrends(userId: number, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    const workLogs = await this.prisma.workLog.findMany({
      where: {
        userId,
        workDate: { gte: startDate },
      },
      select: {
        workDate: true,
        durationMinutes: true,
      },
      orderBy: { workDate: 'asc' },
    });

    const dailyData: Record<string, { date: string; totalMinutes: number; workCount: number }> = {};

    for (const log of workLogs) {
      const dateKey = log.workDate.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, totalMinutes: 0, workCount: 0 };
      }
      dailyData[dateKey]!.totalMinutes += log.durationMinutes;
      dailyData[dateKey]!.workCount += 1;
    }

    return Object.values(dailyData);
  }

  async getHeatmap(userId: number, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const workLogs = await this.prisma.workLog.groupBy({
      by: ['workDate'],
      where: {
        userId,
        workDate: { gte: startDate, lte: endDate },
      },
      _count: true,
      _sum: { durationMinutes: true },
    });

    return workLogs.map((log) => {
      const count = log._count;
      let level: 0 | 1 | 2 | 3 | 4;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count <= 3) level = 2;
      else if (count <= 5) level = 3;
      else level = 4;

      return {
        date: log.workDate.toISOString().split('T')[0],
        count,
        level,
      };
    });
  }

  private async getTotalStats(userId: number) {
    return this.prisma.workLog.aggregate({
      where: { userId },
      _sum: { durationMinutes: true },
      _count: true,
    });
  }

  private async getCategoryStats(userId: number) {
    const stats = await this.prisma.workLogCategory.findMany({
      where: {
        workLog: { userId },
      },
      include: {
        category: true,
        workLog: {
          select: { durationMinutes: true },
        },
      },
    });

    const categoryMap = new Map<
      number,
      { categoryId: number; categoryName: string; categoryColor: string; totalMinutes: number; workCount: number }
    >();

    for (const stat of stats) {
      const existing = categoryMap.get(stat.categoryId);
      if (existing) {
        existing.totalMinutes += stat.workLog.durationMinutes;
        existing.workCount += 1;
      } else {
        categoryMap.set(stat.categoryId, {
          categoryId: stat.categoryId,
          categoryName: stat.category.name,
          categoryColor: stat.category.color,
          totalMinutes: stat.workLog.durationMinutes,
          workCount: 1,
        });
      }
    }

    const result = Array.from(categoryMap.values());
    const total = result.reduce((sum, c) => sum + c.totalMinutes, 0);

    return result.map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.totalMinutes / total) * 100) : 0,
    }));
  }

  private async getStreakData(userId: number) {
    const workLogs = await this.prisma.workLog.findMany({
      where: { userId },
      select: { workDate: true },
      distinct: ['workDate'],
      orderBy: { workDate: 'desc' },
    });

    if (workLogs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = workLogs.map((log) => log.workDate.toISOString().split('T')[0]);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    const isActiveToday = dates[0] === today || dates[0] === yesterday;
    if (isActiveToday) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]!);
        const currDate = new Date(dates[i]!);
        const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]!);
      const currDate = new Date(dates[i]!);
      const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { currentStreak, longestStreak };
  }
}
