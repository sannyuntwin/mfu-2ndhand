import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Put('item/:productId')
  async updateCartItem(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, dto);
  }

  @Delete('item/:productId')
  async removeFromCart(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}