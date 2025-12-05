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
  // 5. GET /buyer/cart
  // ================================
  @Get('carts')
  getCart(@Req() req: any) {
    return this.buyerService.getMyCarts(req.user.id);
  }

  // ================================
  // 6. POST /buyer/cart
  // Body: { productId, quantity }
  // ================================
  @Post('carts')
  addToCart(@Req() req: any, @Body() body: any) {
    return this.buyerService.addToCart(
      req.user.id,
      body.productId,
      body.quantity || 1,
    );
  }

  // ================================
  // 7. DELETE /buyer/cart/:itemId
  // ================================
  @Delete('cart/:itemId')
  removeFromCart(@Req() req: any, @Param('itemId') itemId: number) {
    return this.buyerService.removeFromCart(req.user.id, Number(itemId));
  }

  // ================================
  // 8. POST /buyer/orders  (Create order)
  // ================================
  @Post('orders')
  createOrder(@Req() req: any, @Body() body: any) {
    return this.buyerService.createOrder(req.user.id, body.shippingAddress);
  }
}
