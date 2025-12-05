import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // BUYER VIEW — active + approved only
  async getAllActiveApprovedProducts() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ANYONE
  async getProductById(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: id },
      include: {
        seller: { select: { id: true, name: true } },
        category: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // SELLER
  async createProduct(sellerId: number, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        sellerId: sellerId,
        isApproved: false, // pending admin approval
      },
    });
  }

  async updateProduct(sellerId: number, productId: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    // seller ownership check
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('This is not your product');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...dto,
      },
    });
  }

  async deleteProduct(sellerId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }

    return this.prisma.product.delete({ where: { id: productId } });
  }
}
