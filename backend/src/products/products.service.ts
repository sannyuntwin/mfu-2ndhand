import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImageProcessingService } from '../uploads/image-processing.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private imageProcessingService: ImageProcessingService,
  ) {}

  async create(dto: CreateProductDto, userId: number, images?: Express.Multer.File[]) {
    const imageUrls: string[] = [];

    if (images && images.length > 0) {
      for (const image of images) {
        const url = await this.imageProcessingService.processImage(image);
        imageUrls.push(url);
      }
    }

    // Validate category exists if provided
    if (dto.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException('Invalid category selected');
      }
    }

    const data: any = {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      seller: { connect: { id: userId } },
      images: {
        create: imageUrls.map(url => ({ url })),
      },
    };

    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }

    return await this.prisma.product.create({
      data,
      include: { images: true },
    });
  }

  async findAll(query?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = query || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All') {
      where.category = { name: category };
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    const skip = (page - 1) * limit;

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
              isActive: true,
            },
          },
          category: true,
          _count: {
            select: {
              reviews: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const ratings = product.reviews?.map(review => review.rating) || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return { ...product, averageRating };
    });

    return {
      products: productsWithRating,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const productId = Number(id);
    if (!productId || productId <= 0 || isNaN(productId)) {
      throw new Error('Invalid product ID');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calculate average rating
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return { ...product, averageRating };
  }

  async update(id: number, dto: UpdateProductDto, userId: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.sellerId !== userId) {
      throw new NotFoundException('Product not found or access denied');
    }

    const data: any = {};

    // Handle basic product fields
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;

    // Handle category connection
    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }

    return await this.prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        category: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.sellerId !== userId) {
      throw new Error('Product not found or access denied');
    }
    return await this.prisma.product.delete({ where: { id } });
  }
}
