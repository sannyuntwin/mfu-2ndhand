import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Public — Get all categories including children
   */
  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        children: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Admin — Create category (supports parent category)
   */
  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId ?? null,
      },
    });
  }

  /**
   * Admin — Update category
   */
  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.checkExists(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId ?? null,
      },
    });
  }

  /**
   * Admin — Delete category
   */
  async deleteCategory(id: number) {
    await this.checkExists(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Utility — Check if category exists
   */
  private async checkExists(id: number) {
    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Category not found');
  }
}
