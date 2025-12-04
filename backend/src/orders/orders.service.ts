import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async create(createOrderDto: CreateOrderDto, buyerId: number) {
    // Get user's cart
    const cart = await this.cartService.getCart(buyerId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Create order items from cart items
    const itemsWithPrices = cart.items.map((cartItem: any) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.price,
    }));

    // Create order in a transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          buyerId,
          items: {
            create: itemsWithPrices,
          },
        } as any,
        include: { items: { include: { product: true } } },
      });

      // Clear the cart
      await this.cartService.clearCart(buyerId);

      return newOrder;
    });

    return order;
  }

  async findAll(userId?: number) {
    return this.prisma.order.findMany({
      where: userId ? { buyerId: userId } : {},
      include: { items: { include: { product: true } }, buyer: true },
    });
  }

  async findOne(id: number, userId?: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, buyer: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (userId && order.buyerId !== userId) throw new ForbiddenException('Access denied');
    return order;
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) throw new ForbiddenException('Access denied');
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new ForbiddenException('Cannot cancel shipped or delivered order');
    }
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}