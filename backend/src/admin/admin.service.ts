import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // User Management
  async getAllUsers(query: any) {
    const { page = 1, limit = 10, search, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              products: true,
              orders: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page: Number(page), limit: Number(limit) };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            isApproved: true,
            isActive: true,
            createdAt: true,
          },
        },
        orders: {
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            _count: { select: { items: true } },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            isApproved: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: number, updateData: any) {
    const { role, isActive, ...otherData } = updateData;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...otherData,
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateUserRole(id: number, role: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  async deleteUser(id: number) {
    // Soft delete by deactivating user
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  // Product Moderation
  async getAllProducts(query: any) {
    const { page = 1, limit = 10, search, isApproved, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (typeof isApproved === 'boolean') {
      where.isApproved = isApproved;
    }
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
              orderItems: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page: Number(page), limit: Number(limit) };
  }

  async approveProduct(id: number) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isApproved: true },
      include: {
        seller: { select: { name: true, email: true } },
      },
    });

    return product;
  }

  async rejectProduct(id: number) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isApproved: false },
      include: {
        seller: { select: { name: true, email: true } },
      },
    });

    return product;
  }

  async deleteProduct(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Product deactivated successfully' };
  }

  // Order Management
  async getAllOrders(query: any) {
    const { page = 1, limit = 10, status, paymentStatus } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, title: true, price: true },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page: Number(page), limit: Number(limit) };
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true, price: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        buyer: { select: { name: true, email: true } },
      },
    });

    return order;
  }

  // Review Moderation
  async getAllReviews(query: any) {
    const { page = 1, limit = 10, isApproved } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (typeof isApproved === 'boolean') {
      where.isApproved = isApproved;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { id: true, title: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, total, page: Number(page), limit: Number(limit) };
  }

  async approveReview(id: number) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
      include: {
        user: { select: { name: true } },
        product: { select: { title: true } },
      },
    });

    return review;
  }

  async deleteReview(id: number) {
    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted successfully' };
  }

  // Analytics
  async getAnalyticsOverview() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingProducts,
      pendingReviews,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count(),
      this.prisma.orderItem.aggregate({
        where: {
          order: { paymentStatus: 'PAID' },
        },
        _sum: { price: true },
      }),
      this.prisma.product.count({ where: { isApproved: false, isActive: true } }),
      this.prisma.review.count({ where: { isApproved: false } }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.price || 0,
      pendingProducts,
      pendingReviews,
    };
  }

  async getUserAnalytics(query: any) {
    const { period = '30' } = query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userStats = await this.prisma.user.groupBy({
      by: ['role'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
    });

    return userStats;
  }

  async getProductAnalytics(query: any) {
    const { period = '30' } = query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const productStats = await this.prisma.product.groupBy({
      by: ['isActive'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
    });

    return productStats;
  }

  async getOrderAnalytics(query: any) {
    const { period = '30' } = query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orderStats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
    });

    return orderStats;
  }

  async getDashboardStats(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return { error: 'User not found' };
    }

    if (user.role === 'ADMIN') {
      return this.getAnalyticsOverview();
    } else if (user.role === 'SELLER') {
      return this.getSellerAnalytics(userId);
    }

    return { error: 'Unauthorized' };
  }

  async getSellerAnalytics(sellerId: number) {
    const [
      totalProducts,
      activeProducts,
      totalSales,
      totalRevenue,
      recentOrders,
      monthlyStats,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { sellerId, isActive: true }
      }),
      this.prisma.product.count({
        where: { sellerId, isActive: true, isApproved: true }
      }),
      this.prisma.orderItem.count({
        where: {
          product: { sellerId },
          order: { paymentStatus: 'PAID' }
        }
      }),
      this.prisma.orderItem.aggregate({
        where: {
          product: { sellerId },
          order: { paymentStatus: 'PAID' }
        },
        _sum: { price: true }
      }),
      this.prisma.orderItem.findMany({
        where: {
          product: { sellerId },
          order: { paymentStatus: 'PAID' }
        },
        include: {
          order: {
            select: { id: true, createdAt: true, status: true }
          },
          product: {
            select: { id: true, title: true, price: true }
          }
        },
        orderBy: { order: { createdAt: 'desc' } },
        take: 10
      }),
      this.prisma.orderItem.aggregate({
        where: {
          product: { sellerId },
          order: {
            paymentStatus: 'PAID',
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
          }
        },
        _sum: { price: true },
        _count: true
      })
    ]);

    const monthlyRevenue = monthlyStats._sum.price || 0;
    const monthlySales = monthlyStats._count;

    return {
      totalProducts,
      activeProducts,
      totalSales,
      totalRevenue: totalRevenue._sum.price || 0,
      monthlyRevenue,
      monthlySales,
      recentOrders: recentOrders.map(item => ({
        orderId: item.order.id,
        productTitle: item.product.title,
        price: item.price,
        date: item.order.createdAt,
        status: item.order.status
      }))
    };
  }
}