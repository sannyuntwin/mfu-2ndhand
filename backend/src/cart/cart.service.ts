import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Helper method to validate user and get/create cart
  private async getOrCreateCart(userId: number) {
    // Verify user exists first
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Use upsert to safely create or get cart
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  // Get user's cart with items
  async getUserCart(userId: number) {
    try {
      // Verify user and get/create cart
      const cart = await this.getOrCreateCart(userId);

      // Get cart items with product details
      const items = await this.prisma.cartItem.findMany({
        where: { cartId: cart.id },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              imageUrl: true,
              stock: true,
              isActive: true,
            },
          },
        },
      });

      return {
        ...cart,
        items,
      };
    } catch (error) {
      console.error('Error in getUserCart:', error);
      // Return empty cart on error to prevent frontend crashes
      return {
        id: 0,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
    }
  }

  // Add item to cart
  async addItemToCart(userId: number, productId: number, quantity: number) {
    try {
      // Validate product
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new NotFoundException('Product not found');
      if (!product.isActive) throw new ForbiddenException('Product not available');
      if (product.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      // Get or create cart for user
      const cart = await this.getOrCreateCart(userId);

      // Check if item already exists in cart
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock < newQuantity) {
          throw new BadRequestException('Insufficient stock');
        }

        return this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                imageUrl: true,
                stock: true,
                isActive: true,
              },
            },
          },
        });
      } else {
        // Add new item
        return this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            price: product.price,
          },
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                imageUrl: true,
                stock: true,
                isActive: true,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error in addItemToCart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartItem(
    userId: number,
    productId: number,
    quantity: number,
  ) {
    try {
      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      // Get user's cart
      const cart = await this.getOrCreateCart(userId);

      // Get cart item
      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      if (!cartItem) throw new NotFoundException('Item not found in cart');

      // Check stock
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new NotFoundException('Product not found');
      if (product.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              imageUrl: true,
              stock: true,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeItemFromCart(userId: number, productId: number) {
    try {
      // Get user's cart
      const cart = await this.getOrCreateCart(userId);

      // Remove item
      return this.prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });
    } catch (error) {
      console.error('Error in removeItemFromCart:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart(userId: number) {
    try {
      // Get user's cart
      const cart = await this.getOrCreateCart(userId);

      // Delete all items
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }
}