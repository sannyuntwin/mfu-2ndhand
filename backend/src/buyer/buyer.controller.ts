import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('buyer')
@UseGuards(JwtAuthGuard)
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  // ================================
  // 1. GET /buyer/me
  // ================================
  @Get('me')
  getMe(@Req() req: any) {
    return this.buyerService.getMe(req.user.id);
  }

  // ================================
  // 2. PUT /buyer/me
  // ================================
  @Put('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.buyerService.updateMe(req.user.id, body);
  }

  // ================================
  // 3. GET /buyer/orders
  // ================================
  @Get('orders')
  getMyOrders(@Req() req: any) {
    return this.buyerService.getMyOrders(req.user.id);
  }

  // ================================
  // 4. PUT /buyer/orders/:id/cancel
  // ================================
  @Put('orders/:id/cancel')
  cancelOrder(@Req() req: any, @Param('id') orderId: number) {
    return this.buyerService.cancelMyOrder(Number(orderId), req.user.id);
  }

  // ================================
  // 5. POST /buyer/orders  (Create order)
  // Body: { productId, quantity, shippingAddress? }
  // ================================
  @Post('orders')
  createOrder(@Req() req: any, @Body() body: any) {
    return this.buyerService.createOrder(
      req.user.id,
      body.productId,
      body.quantity || 1,
      body.shippingAddress,
    );
  }
}
