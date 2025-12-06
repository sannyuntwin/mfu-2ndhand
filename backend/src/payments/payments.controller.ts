import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(@Req() req: any, @Body() body: { orderId: number }) {
    return this.paymentsService.createPaymentIntent(req.user.id, body.orderId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    // In a real implementation, you'd get the signature from headers
    const signature = 'test-signature';
    return this.paymentsService.handleWebhook(signature, JSON.stringify(body));
  }

  @Post('create-qr')
  async createQR(@Body() body: { amount: number }) {
    return this.paymentsService.createQR(body.amount);
  }
}