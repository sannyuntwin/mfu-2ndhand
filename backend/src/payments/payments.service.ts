import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Omise from 'omise';

@Injectable()
export class PaymentsService {
  private omise: any;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.omise = Omise({
      secretKey: this.configService.get<string>('OMISE_SECRET_KEY'),
    });
  }

  async createPaymentIntent(userId: number, orderId: number, chargeId?: string, qrString?: string) {
    // Verify order belongs to user and is pending
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new BadRequestException('Order not found');
    if (order.buyerId !== userId) throw new BadRequestException('Unauthorized');
    if (order.paymentStatus !== 'PENDING') throw new BadRequestException('Payment already processed');

    // Create Omise source and charge with PromptPay
    let source: any;
    let charge: any;
    try {
      source = await this.omise.sources.create({
        type: 'promptpay',
        amount: Math.round((order.totalAmount || 0) * 100),
        currency: 'thb',
      });
      charge = await this.omise.charges.create({
        amount: Math.round((order.totalAmount || 0) * 100),
        currency: 'thb',
        source: source.id,
        metadata: { orderId: orderId.toString() },
        return_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderId}?success=true`,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Payment creation failed');
    }

    // Use source qr_string
    const finalQrString = source.qr_string || charge.source.qr_string;

    // Create or update payment record
    let payment = order.payment;
    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          orderId,
          amount: order.totalAmount || 0,
          stripePaymentIntentId: charge.id,
          stripeClientSecret: qrString,
        },
      });
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripePaymentIntentId: charge.id,
          stripeClientSecret: qrString,
        },
      });
    }

    if (!finalQrString) throw new BadRequestException('QR string not available');
    return {
      qrString: finalQrString,
      chargeId: charge.id,
    };
  }

  async createQR(amount: number) {
    let source: any;
    let charge: any;
    try {
      source = await this.omise.sources.create({
        type: 'promptpay',
        amount: Math.round(amount * 100),
        currency: 'thb',
      });
      charge = await this.omise.charges.create({
        amount: Math.round(amount * 100),
        currency: 'thb',
        source: source.id,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message || 'QR creation failed');
    }

    return {
      qrString: source.qr_string || charge.source.qr_string,
      chargeId: charge.id,
    };
  }
}