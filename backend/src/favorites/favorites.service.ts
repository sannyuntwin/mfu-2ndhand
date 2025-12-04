import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, productId: number) {
    // Check if favorite already exists
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new Error('Product already in favorites');
    }

    return await this.prisma.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async removeFavorite(userId: number, productId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    return await this.prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async getUserFavorites(userId: number) {
    return await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            seller: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!favorite;
  }
}