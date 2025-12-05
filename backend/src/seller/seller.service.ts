import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  // =============================
  // 1. Seller Profile
  // =============================
  async getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateMe(userId: number, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        imageUrl: data.imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        imageUrl: true,
        role: true,
      },
    });
  }

  // =============================
  // 2. Products (CRUD)
  // =============================
  async createProduct(userId: number, dto: any) {
    const productData: any = {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      condition: dto.condition,
      brand: dto.brand,
      tags: dto.tags,
      categoryId: dto.categoryId,
      sellerId: userId,
      isApproved: false, // Admin will approve
    };

    // Handle images
    if (dto.images && Array.isArray(dto.images) && dto.images.length > 0) {
      productData.imageUrl = dto.images[0]; // Set first image as main imageUrl
      productData.images = {
        create: dto.images.map((url: string) => ({ url })),
      };
    } else if (dto.imageUrl) {
      productData.imageUrl = dto.imageUrl;
    }

    return this.prisma.product.create({
      data: productData,
    });
  }

  async getMyProducts(userId: number) {
    return this.prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { images: true, variants: true },
    });
  }

  async getProductById(userId: number, id: number) {
    return this.prisma.product.findFirst({
      where: { id, sellerId: userId },
      include: { images: true, variants: true },
    });
  }

  async updateProduct(userId: number, id: number, dto: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException();
    if (product.sellerId !== userId)
      throw new ForbiddenException('Not your product');

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async deleteProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException();
    if (product.sellerId !== userId)
      throw new ForbiddenException('Not your product');

    return this.prisma.product.delete({ where: { id } });
  }

  // =============================
  // 3. Seller Orders
  // =============================
  async getSellerOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        items: {
          some: { product: { sellerId: userId } },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: number, userId: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw new NotFoundException();

    const sellerOwnsProduct = order.items.some(
      (item) => item.product.sellerId === userId,
    );

    if (!sellerOwnsProduct)
      throw new ForbiddenException('Not your order');

    // Validate status is a valid OrderStatus enum value
    const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status as OrderStatus)) {
      throw new ForbiddenException('Invalid order status');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });
  }

  // =============================
  // 4. Dashboard
  // =============================
  async getDashboard(userId: number) {
    const productCount = await this.prisma.product.count({
      where: { sellerId: userId },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        items: { some: { product: { sellerId: userId } } },
        status: 'DELIVERED',
      },
      include: { items: true },
    });

    const revenue = orders.reduce((total, order) => {
      const sum = order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      return total + sum;
    }, 0);

    return {
      productCount,
      deliveredOrders: orders.length,
      revenue,
    };
  }

  // =============================
  // 5. Conversations
  // =============================
  async getConversations(userId: number) {
    return this.prisma.conversation.findMany({
      where: { sellerId: userId },
      include: { buyer: true, product: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(conversationId: number, userId: number) {
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!convo) throw new NotFoundException();
    if (convo.sellerId !== userId)
      throw new ForbiddenException('Unauthorized');

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(conversationId: number, userId: number, content: string) {
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!convo) throw new NotFoundException();
    if (convo.sellerId !== userId)
      throw new ForbiddenException();

    return this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
    });
  }
}
