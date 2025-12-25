import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateCategoryDto) {
    const maxSortOrder = await this.prisma.category.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    });

    return this.prisma.category.create({
      data: {
        ...dto,
        userId,
        sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }

  async update(id: number, userId: number, dto: UpdateCategoryDto) {
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  async reorder(userId: number, categoryIds: number[]) {
    const updates = categoryIds.map((id, index) =>
      this.prisma.category.update({
        where: { id, userId },
        data: { sortOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return this.findAll(userId);
  }
}
