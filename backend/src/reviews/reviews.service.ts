import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, userId: number, dto: CreateReviewDto) {
    // Check if user has purchased the product
    const hasPurchased = await this.checkUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      throw new ForbiddenException('You can only review products you have purchased');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(productId: number, includeUnapproved = false) {
    return this.prisma.review.findMany({
      where: {
        productId,
        ...(includeUnapproved ? {} : { isApproved: true }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, userId: number, dto: CreateReviewDto) {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: number, userId: number) {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async moderate(id: number, dto: ModerateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: {
        isApproved: dto.isApproved,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getProductRating(productId: number, includeUnapproved = false) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        ...(includeUnapproved ? {} : { isApproved: true }),
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
    };
  }

  private async checkUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
    const purchasedOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: userId,
          status: {
            in: ['DELIVERED', 'CONFIRMED'], // Allow reviews for completed orders
          },
        },
      },
    });

    return !!purchasedOrder;
  }
}