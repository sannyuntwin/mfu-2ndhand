import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  // Get user's cart
  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getUserCart(req.user.id);
  }

  // Add item to cart
  @Post('items')
  addItem(
    @Req() req: any,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.addItemToCart(
      req.user.id,
      body.productId,
      body.quantity || 1,
    );
  }

  // Update cart item quantity
  @Put('items/:productId')
  updateItem(
    @Req() req: any,
    @Param('productId') productId: number,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      Number(productId),
      body.quantity,
    );
  }

  // Remove item from cart
  @Delete('items/:productId')
  removeItem(
    @Req() req: any,
    @Param('productId') productId: number,
  ) {
    return this.cartService.removeItemFromCart(req.user.id, Number(productId));
  }

  // Clear cart
  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}