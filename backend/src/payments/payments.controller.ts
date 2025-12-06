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
  async createPaymentIntent(@Req() req: any, @Body() body: { orderId: number, chargeId?: string, qrString?: string }) {
    return this.paymentsService.createPaymentIntent(req.user.id, body.orderId, body.chargeId, body.qrString);
  }

  @Post('create-qr')
  async createQR(@Body() body: { amount: number }) {
    return this.paymentsService.createQR(body.amount);
  }
}