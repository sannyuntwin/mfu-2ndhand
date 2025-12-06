import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUserRole(userId: number, role: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async createUser(data: { name: string; email: string; password: string; role: string }) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteProduct(productId: number) {
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async createProduct(data: { title: string; description: string; price: number; imageUrl?: string; sellerId: number }) {
    return this.prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        sellerId: data.sellerId,
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }

  async cancelOrder(orderId: number) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' as any },
    });
  }

  async createOrder(data: { buyerId: number; totalAmount: number; items: { productId: number; quantity: number; price: number }[] }) {
    return this.prisma.order.create({
      data: {
        buyerId: data.buyerId,
        totalAmount: data.totalAmount,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
      },
    });
  }
}