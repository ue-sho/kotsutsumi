import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkLogsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateWorkLogDto) {
    const { categoryIds, tagIds, ...data } = dto;

    const workLog = await this.prisma.workLog.create({
      data: {
        ...data,
        workDate: new Date(dto.workDate),
        userId,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    return this.formatWorkLog(workLog);
  }

  async findAll(userId: number, query: WorkLogQueryDto) {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      status,
      categoryId,
      tagId,
      search,
      sortBy = 'workDate',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.WorkLogWhereInput = {
      userId,
      ...(startDate && endDate && {
        workDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
      ...(status && { status }),
      ...(categoryId && {
        categories: { some: { categoryId } },
      }),
      ...(tagId && {
        tags: { some: { tagId } },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [workLogs, total] = await Promise.all([
      this.prisma.workLog.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.workLog.count({ where }),
    ]);

    return {
      data: workLogs.map((wl) => this.formatWorkLog(wl)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number, userId: number) {
    const workLog = await this.prisma.workLog.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        attachments: true,
      },
    });

    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    if (workLog.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.formatWorkLog(workLog);
  }

  async update(id: number, userId: number, dto: UpdateWorkLogDto) {
    const workLog = await this.prisma.workLog.findUnique({
      where: { id },
    });

    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    if (workLog.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { categoryIds, tagIds, ...data } = dto;

    // Update categories and tags if provided
    if (categoryIds !== undefined) {
      await this.prisma.workLogCategory.deleteMany({
        where: { workLogId: id },
      });
    }

    if (tagIds !== undefined) {
      await this.prisma.workLogTag.deleteMany({
        where: { workLogId: id },
      });
    }

    const updated = await this.prisma.workLog.update({
      where: { id },
      data: {
        ...data,
        ...(dto.workDate && { workDate: new Date(dto.workDate) }),
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    return this.formatWorkLog(updated);
  }

  async remove(id: number, userId: number) {
    const workLog = await this.prisma.workLog.findUnique({
      where: { id },
    });

    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    if (workLog.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.workLog.delete({
      where: { id },
    });

    return { message: 'Work log deleted successfully' };
  }

  async findByCalendar(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const workLogs = await this.prisma.workLog.findMany({
      where: {
        userId,
        workDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        title: true,
        workDate: true,
        durationMinutes: true,
        status: true,
      },
      orderBy: { workDate: 'asc' },
    });

    return workLogs.map((wl) => ({
      ...wl,
      workDate: wl.workDate.toISOString().split('T')[0],
    }));
  }

  private formatWorkLog(workLog: any) {
    return {
      id: workLog.id,
      userId: workLog.userId,
      title: workLog.title,
      content: workLog.content,
      workDate: workLog.workDate.toISOString().split('T')[0],
      durationMinutes: workLog.durationMinutes,
      status: workLog.status,
      published: workLog.published,
      localId: workLog.localId,
      synced: workLog.synced,
      lastSyncedAt: workLog.lastSyncedAt?.toISOString() || null,
      createdAt: workLog.createdAt.toISOString(),
      updatedAt: workLog.updatedAt.toISOString(),
      categories: workLog.categories?.map((c: any) => ({
        id: c.category.id,
        name: c.category.name,
        color: c.category.color,
        icon: c.category.icon,
      })),
      tags: workLog.tags?.map((t: any) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
      attachments: workLog.attachments?.map((a: any) => ({
        id: a.id,
        fileName: a.fileName,
        fileType: a.fileType,
        fileSize: Number(a.fileSize),
        fileUrl: a.fileUrl,
      })),
    };
  }
}
