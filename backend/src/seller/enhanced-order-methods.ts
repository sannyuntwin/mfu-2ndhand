import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, User } from '@prisma/client';

// Enhanced Order Management Methods for SellerService
// These methods should be added to the SellerService class

@Injectable()
export class EnhancedOrderMethods {
  constructor(private prisma: PrismaService) {}

  // =============================
  // 6. Enhanced Order Management Methods
  // =============================
  async getSellerOrders(
    userId: number, 
    filters?: {
      status?: string;
      dateFrom?: Date;
      dateTo?: Date;
      limit?: number;
      page?: number;
    }
  ) {
    const where: any = {
      items: {
        some: { product: { sellerId: userId } },
      },
    };

    // Apply filters
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const skip = ((filters?.page || 1) - 1) * (filters?.limit || 20);
    const take = filters?.limit || 20;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: { 
              product: {
                select: {
                  id: true,
                  title: true,
                  imageUrl: true,
                  sellerId: true,
                }
              }
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        pages: Math.ceil(total / (filters?.limit || 20)),
      },
    };
  }

  async getOrderDetails(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: { product: { sellerId: userId } },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                brand: true,
                condition: true,
                sellerId: true,
                allowPickup: true,
                allowDelivery: true,
                pickupLocations: true,
                pickupInstructions: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  async confirmOrder(
    userId: number, 
    orderId: number, 
    data: {
      pickupLocationId?: string;
      estimatedReadyDate?: Date;
      notes?: string;
    }
  ) {
    const order = await this.getOrderDetails(userId, orderId);

    if (order.status !== 'PENDING') {
      throw new ForbiddenException('Only pending orders can be confirmed');
    }

    // If order has pickup items and no pickup location specified, throw error
    const hasPickupItems = order.items.some(item => 
      item.product.allowPickup && 
      (order.shippingMethod === 'PICKUP' || order.deliveryOption === 'seller-pickup')
    );

    if (hasPickupItems && !data.pickupLocationId) {
      throw new ForbiddenException('Pickup location is required for pickup orders');
    }

    const updateData: any = {
      status: 'CONFIRMED',
      estimatedDelivery: data.estimatedReadyDate,
    };

    if (data.pickupLocationId) {
      updateData.pickupLocationId = parseInt(data.pickupLocationId);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // TODO: Notify buyer about order confirmation
    // TODO: Send confirmation notification

    return updatedOrder;
  }

  async rejectOrder(
    userId: number, 
    orderId: number, 
    data: {
      reason: string;
      notes?: string;
    }
  ) {
    const order = await this.getOrderDetails(userId, orderId);

    if (order.status !== 'PENDING') {
      throw new ForbiddenException('Only pending orders can be rejected');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        // Store rejection reason in delivery instructions for now
        deliveryInstructions: `REJECTED: ${data.reason}${data.notes ? ' - ' + data.notes : ''}`,
      },
    });

    // TODO: Notify buyer about order rejection
    // TODO: Process refund if payment was made

    return updatedOrder;
  }

  async getOrderStatistics(userId: number) {
    const [totalOrders, pendingOrders, confirmedOrders, shippedOrders, deliveredOrders] = await Promise.all([
      this.prisma.order.count({
        where: {
          items: {
            some: { product: { sellerId: userId } },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: 'PENDING',
          items: {
            some: { product: { sellerId: userId } },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: 'CONFIRMED',
          items: {
            some: { product: { sellerId: userId } },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: 'SHIPPED',
          items: {
            some: { product: { sellerId: userId } },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: 'DELIVERED',
          items: {
            some: { product: { sellerId: userId } },
          },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      completionRate: totalOrders > 0 ? (deliveredOrders / totalOrders * 100).toFixed(1) : 0,
    };
  }
}