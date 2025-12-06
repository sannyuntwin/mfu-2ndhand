import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuyerService {
  constructor(private prisma: PrismaService) {}

  // 1. GET MY PROFILE
  getMe(userId: number) {
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

  // 2. UPDATE PROFILE
  updateMe(userId: number, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  // 3. GET MY ORDERS
  getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. CANCEL ORDER
  async cancelMyOrder(orderId: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) throw new ForbiddenException('Unauthorized');
    if (order.status !== 'PENDING')
      throw new ForbiddenException('Order cannot be cancelled');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }

  // 5. CREATE ORDER
  async createOrder(userId: number, productId: number, quantity: number, shippingAddress?: string) {
    // Validate product
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (!product.isActive) throw new ForbiddenException('Product not available');

    const order = await this.prisma.order.create({
      data: {
        buyerId: userId,
        shippingAddress,
        totalAmount: product.price * quantity,
        items: {
          create: {
            productId,
            quantity,
            price: product.price,
          },
        },
      },
    });

    return order;
  }
}
