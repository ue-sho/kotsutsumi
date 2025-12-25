import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublished(userId: number) {
    const announcements = await this.prisma.announcement.findMany({
      where: {
        published: true,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        reads: {
          where: { userId },
        },
      },
    });

    return announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      announcementType: a.announcementType,
      publishedAt: a.publishedAt?.toISOString(),
      isRead: a.reads.length > 0,
    }));
  }

  async markAsRead(userId: number, announcementId: number) {
    await this.prisma.announcementRead.upsert({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
      create: {
        userId,
        announcementId,
      },
      update: {},
    });

    return { message: 'Announcement marked as read' };
  }
}
