import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createPaymentIntent(userId: number, orderId: number) {
    // Verify order belongs to user and is pending
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: { include: { product: true } } },
    });

    if (!order) throw new BadRequestException('Order not found');
    if (order.buyerId !== userId) throw new BadRequestException('Unauthorized');

    // Check if payment already exists and is successful
    if (order.payment && order.payment.status === 'PAID') {
      throw new BadRequestException('Payment already completed');
    }

    try {
      // Create payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: orderId.toString(),
          userId: userId.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create or update payment record using upsert to avoid duplicate constraint violations
      const payment = await this.prisma.payment.upsert({
        where: { orderId },
        update: {
          stripePaymentIntentId: paymentIntent.id,
          stripeClientSecret: paymentIntent.client_secret,
          amount: order.totalAmount,
        },
        create: {
          orderId,
          amount: order.totalAmount,
          status: 'PENDING',
          stripePaymentIntentId: paymentIntent.id,
          stripeClientSecret: paymentIntent.client_secret,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      console.error('Stripe payment intent creation failed:', error);
      throw new BadRequestException(error.message || 'Payment creation failed');
    }
  }

  async createOrderFromCart(userId: number, cartId: number, shippingAddress?: string) {
    // Get user's cart with items
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.userId !== userId) {
      throw new BadRequestException('Cart not found');
    }

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate all products are available
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Product ${item.product.title} is not available`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${item.product.title}`);
      }
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );

    // Create order
    const order = await this.prisma.order.create({
      data: {
        buyerId: userId,
        shippingAddress,
        totalAmount,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  async handleWebhook(signature: string, body: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = parseInt(paymentIntent.metadata.orderId);
    
    try {
      // Update payment status
      await this.prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'PAID' },
      });

      // Update order status to CONFIRMED
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
        include: { items: { include: { product: true } } },
      });

      // Update inventory (decrease stock)
      for (const item of order.items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear the user's cart after successful order
      await this.prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: order.buyerId,
          },
        },
      });

      console.log(`Payment succeeded for order ${orderId}`);
    } catch (error) {
      console.error('Failed to handle payment success:', error);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = parseInt(paymentIntent.metadata.orderId);
    
    try {
      // Update payment status
      await this.prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'FAILED' },
      });

      console.log(`Payment failed for order ${orderId}`);
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
    }
  }

  async createQR(amount: number) {
    // For Stripe, we don't need QR codes as it supports card payments directly
    throw new BadRequestException('QR payments not supported with Stripe');
  }
}