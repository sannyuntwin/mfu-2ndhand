import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Categories functionality not implemented in MVP
  // This is a stub to prevent build errors

  async getAllCategories() {
    return [];
  }

  async createCategory(dto: CreateCategoryDto) {
    return { id: 1, ...dto };
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    return { id, ...dto };
  }

  async deleteCategory(id: number) {
    return { success: true };
  }
}
