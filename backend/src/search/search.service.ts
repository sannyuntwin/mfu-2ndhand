import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    condition?: string;
    brand?: string;
    page?: string;
    limit?: string;
  }) {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      condition,
      brand,
      page = '1',
      limit = '20',
    } = query;

    const where: any = {
      isApproved: true,
      isActive: true,
    };

    // Full-text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (category && category !== 'All') {
      where.category = { name: category };
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    if (condition) {
      where.condition = condition;
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    // Sorting
    let orderBy: any = { [sortBy]: sortOrder };
    if (sortBy === 'rating') {
      // Handle rating sorting with review aggregation
      // This would be more complex in real implementation
      orderBy = { createdAt: 'desc' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          category: true,
          images: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate ratings and enhance results
    const enrichedProducts = products.map((product) => {
      const ratings = product.reviews?.map((r) => r.rating) || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      return {
        ...product,
        averageRating,
        totalReviews: product._count.reviews,
        totalFavorites: product._count.favorites,
      };
    });

    return {
      products: enrichedProducts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  async getTrendingProducts(limit = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await this.prisma.product.findMany({
      where: {
        isApproved: true,
        isActive: true,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: true,
        images: true,
        _count: {
          select: { reviews: true, favorites: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { views: 'desc' },
      take: limit,
    });

    return products.map((product) => {
      const ratings = product.reviews?.map((r) => r.rating) || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      return {
        ...product,
        averageRating,
        totalReviews: product._count.reviews,
      };
    });
  }

  async getRecommendedProducts(userId: number, limit = 10) {
    // Simple recommendation based on user's previous interactions
    // In a real app, this would use ML algorithms

    const userFavorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    if (userFavorites.length === 0) {
      return this.getTrendingProducts(limit);
    }

    // Get categories user is interested in
    const favoriteCategories = [...new Set(userFavorites.map((f) => f.product.categoryId).filter(Boolean))];

    const recommendedProducts = await this.prisma.product.findMany({
      where: {
        isApproved: true,
        isActive: true,
        categoryId: {
          in: favoriteCategories,
        },
        id: {
          notIn: userFavorites.map((f) => f.productId),
        },
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: true,
        images: true,
        _count: {
          select: { reviews: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { views: 'desc' },
      take: limit,
    });

    return recommendedProducts.map((product) => {
      const ratings = product.reviews?.map((r) => r.rating) || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      return {
        ...product,
        averageRating,
        totalReviews: product._count.reviews,
      };
    });
  }
}