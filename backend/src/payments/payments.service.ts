import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createPaymentIntent(orderId: number, buyerId: number) {
    // Get order with items
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.buyerId !== buyerId) {
      throw new Error('Access denied');
    }

    // Calculate total amount
    const totalAmount = order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        orderId: orderId.toString(),
      },
    });

    // Update order with payment intent ID
    await this.prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = parseInt(paymentIntent.metadata?.orderId || '');

        if (orderId) {
          // Update order status to CONFIRMED and payment status to PAID
          await this.prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'PAID'
            },
          });
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = parseInt(paymentIntent.metadata?.orderId || '');

        if (orderId) {
          // Update payment status to FAILED
          await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'FAILED' },
          });
        }
      }

      return { received: true };
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed. ${err.message}`);
    }
  }
}