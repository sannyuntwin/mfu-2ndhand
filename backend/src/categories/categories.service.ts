import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Validate that the parent category exists if parentId is provided
    if (createCategoryDto.parentId) {
      await this.findOne(createCategoryDto.parentId);
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            seller: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Validate that the parent category exists if parentId is provided
    if (updateCategoryDto.parentId) {
      await this.findOne(updateCategoryDto.parentId);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: number) {
    // First, check if category has children or products
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with child categories');
    }

    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with associated products');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryTree() {
    const categories = await this.prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true, // Support 2 levels deep
          },
        },
      },
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });

    return categories;
  }
}