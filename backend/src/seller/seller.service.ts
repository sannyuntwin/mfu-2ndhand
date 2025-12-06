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
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  // =============================
  // 2. Products (CRUD)
  // =============================
  async createProduct(userId: number, dto: any) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        sellerId: userId,
      },
    });
  }

  async getMyProducts(userId: number) {
    return this.prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(userId: number, id: number) {
    return this.prisma.product.findFirst({
      where: { id, sellerId: userId },
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
    const validStatuses: string[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
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
    const totalProducts = await this.prisma.product.count({
      where: { sellerId: userId },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        items: { some: { product: { sellerId: userId } } },
      },
      include: {
        items: true,
        buyer: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalOrders = orders.length;

    const revenue = orders
      .filter(order => order.status === 'DELIVERED' as any)
      .reduce((total, order) => {
        const sum = order.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        return total + sum;
      }, 0);

    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      total: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      buyer: order.buyer,
    }));

    return {
      totalProducts,
      totalOrders,
      totalRevenue: revenue,
      recentOrders,
    };
  }

  // =============================
  // 5. Conversations - Commented out for MVP
  // =============================
  // async getConversations(userId: number) {
  //   return this.prisma.conversation.findMany({
  //     where: { sellerId: userId },
  //     include: { buyer: true, product: true },
  //     orderBy: { updatedAt: 'desc' },
  //   });
  // }

  // async getMessages(conversationId: number, userId: number) {
  //   const convo = await this.prisma.conversation.findUnique({
  //     where: { id: conversationId },
  //   });

  //   if (!convo) throw new NotFoundException();
  //   if (convo.sellerId !== userId)
  //     throw new ForbiddenException('Unauthorized');

  //   return this.prisma.message.findMany({
  //     where: { conversationId },
  //     orderBy: { createdAt: 'asc' },
  //   });
  // }

  // async sendMessage(conversationId: number, userId: number, content: string) {
  //   const convo = await this.prisma.conversation.findUnique({
  //     where: { id: conversationId },
  //   });

  //   if (!convo) throw new NotFoundException();
  //   if (convo.sellerId !== userId)
  //     throw new ForbiddenException();

  //   return this.prisma.message.create({
  //     data: {
  //       conversationId,
  //       senderId: userId,
  //       content,
  //     },
  //   });
  // }
}
