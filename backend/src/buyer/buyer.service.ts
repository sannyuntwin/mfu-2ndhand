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
        imageUrl: true,
        phone: true,
        address: true,
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
        imageUrl: data.imageUrl,
        phone: data.phone,
        address: data.address,
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

  // 5. GET MY CART
  getMyCarts(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  // 6. ADD TO CART
  async addToCart(userId: number, productId: number, quantity: number) {
    // Find cart
    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + quantity },
      });
    }

    // product price
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        qty: quantity,
        price: product.price,
      },
    });
  }

  // 7. REMOVE FROM CART
  async removeFromCart(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId)
      throw new ForbiddenException('Unauthorized');

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  // 8. CREATE ORDER FROM CART
  async createOrder(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0)
      throw new Error('Cart is empty');

    const order = await this.prisma.order.create({
      data: {
        buyerId: userId,
        totalAmount: cart.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0,
        ),
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.qty,
            price: i.price,
          })),
        },
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }
}
