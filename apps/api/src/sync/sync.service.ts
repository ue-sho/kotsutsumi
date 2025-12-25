import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUploadDto, LocalWorkLogDto } from './dto/sync-upload.dto';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async upload(userId: number, dto: SyncUploadDto) {
    const results = [];

    for (const localLog of dto.workLogs) {
      const result = await this.upsertWorkLog(userId, localLog);
      results.push(result);
    }

    return {
      synced: results.length,
      results,
    };
  }

  async download(userId: number, lastSyncAt?: string) {
    const where: any = { userId };

    if (lastSyncAt) {
      where.updatedAt = { gt: new Date(lastSyncAt) };
    }

    const workLogs = await this.prisma.workLog.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      workLogs: workLogs.map((wl) => ({
        id: wl.id,
        localId: wl.localId,
        title: wl.title,
        content: wl.content,
        workDate: wl.workDate.toISOString().split('T')[0],
        durationMinutes: wl.durationMinutes,
        status: wl.status,
        categories: wl.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          color: c.category.color,
        })),
        tags: wl.tags.map((t) => ({
          id: t.tag.id,
          name: t.tag.name,
        })),
        createdAt: wl.createdAt.toISOString(),
        updatedAt: wl.updatedAt.toISOString(),
      })),
      lastSyncAt: new Date().toISOString(),
    };
  }

  async getStatus(userId: number) {
    const lastSync = await this.prisma.syncLog.findFirst({
      where: { userId, status: 'success' },
      orderBy: { syncedAt: 'desc' },
    });

    const pendingCount = await this.prisma.workLog.count({
      where: { userId, synced: false },
    });

    return {
      lastSyncAt: lastSync?.syncedAt?.toISOString() || null,
      pendingUploads: pendingCount,
      pendingDownloads: 0,
    };
  }

  async registerDevice(userId: number, deviceName?: string, deviceType?: string) {
    return this.prisma.device.create({
      data: {
        userId,
        deviceName,
        deviceType: deviceType as any,
        lastSyncAt: new Date(),
      },
    });
  }

  async getDevices(userId: number) {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { lastSyncAt: 'desc' },
    });
  }

  private async upsertWorkLog(userId: number, localLog: LocalWorkLogDto) {
    const existing = await this.prisma.workLog.findFirst({
      where: { userId, localId: localLog.localId },
    });

    if (existing) {
      // Check for conflict
      const localUpdatedAt = new Date(localLog.updatedAt);
      if (existing.updatedAt > localUpdatedAt) {
        return {
          localId: localLog.localId,
          status: 'conflict',
          serverId: existing.id,
          serverUpdatedAt: existing.updatedAt.toISOString(),
        };
      }

      // Update existing
      await this.prisma.workLog.update({
        where: { id: existing.id },
        data: {
          title: localLog.title,
          content: localLog.content,
          workDate: new Date(localLog.workDate),
          durationMinutes: localLog.durationMinutes,
          status: localLog.status as any,
          synced: true,
          lastSyncedAt: new Date(),
        },
      });

      return {
        localId: localLog.localId,
        status: 'updated',
        serverId: existing.id,
      };
    }

    // Create new
    const created = await this.prisma.workLog.create({
      data: {
        userId,
        title: localLog.title,
        content: localLog.content,
        workDate: new Date(localLog.workDate),
        durationMinutes: localLog.durationMinutes,
        status: localLog.status as any,
        localId: localLog.localId,
        synced: true,
        lastSyncedAt: new Date(),
      },
    });

    // Log sync
    await this.prisma.syncLog.create({
      data: {
        userId,
        workLogId: created.id,
        syncType: 'upload',
        status: 'success',
      },
    });

    return {
      localId: localLog.localId,
      status: 'created',
      serverId: created.id,
    };
  }
}
