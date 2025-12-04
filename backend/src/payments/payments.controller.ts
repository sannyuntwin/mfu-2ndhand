import { Controller, Get, Post, Body, UseGuards, Request, Query, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  async createPaymentIntent(
    @Body() body: { orderId: number },
    @Request() req: any
  ) {
    return this.paymentsService.createPaymentIntent(body.orderId, req.user.id);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get Stripe publishable key' })
  @ApiResponse({ status: 200, description: 'Stripe config' })
  getConfig() {
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
    };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Request() req: any,
  ) {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      throw new Error('Missing Stripe signature');
    }
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}