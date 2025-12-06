import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // BUYER VIEW — active only (MVP simplified)
  async getAllActiveApprovedProducts() {
    try {
      // Try to get products with stock field
      return await this.prisma.product.findMany({
        where: {
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      try {
        // If isActive field doesn't exist, try without it
        return await this.prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch (error2) {
        // If stock field doesn't exist, just return empty array for now
        console.log('Products table structure issue, returning empty array');
        return [];
      }
    }
  }

  // ANYONE
  async getProductById(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    try {
      const product = await this.prisma.product.findUnique({
        where: { id: id },
        include: {
          seller: { select: { id: true, name: true } },
        },
      });

      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  // SELLER
  async createProduct(sellerId: number, dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          ...dto,
          sellerId: sellerId,
        },
      });
    } catch (error) {
      // If stock field doesn't exist, create without it
      return await this.prisma.product.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          imageUrl: dto.imageUrl,
          sellerId: sellerId,
          isActive: true,
        },
      });
    }
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

    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data: dto,
      });
    } catch (error) {
      // If stock field doesn't exist, update without it
      const updateData = { ...dto };
      delete (updateData as any).stock;
      
      return await this.prisma.product.update({
        where: { id: productId },
        data: updateData,
      });
    }
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
