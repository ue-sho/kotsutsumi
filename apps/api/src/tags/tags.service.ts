import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name: dto.name,
        },
      },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }

    return this.prisma.tag.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return tag;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }
}
