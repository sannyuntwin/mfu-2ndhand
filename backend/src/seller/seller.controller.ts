import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('seller')
@UseGuards(JwtAuthGuard)
export class SellerController {
  constructor(private sellerService: SellerService) {}

  // =============================
  // Profile
  // =============================
  @Get('me')
  getMe(@Req() req: any) {
    return this.sellerService.getMe(req.user.id);
  }

  @Put('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.sellerService.updateMe(req.user.id, body);
  }

  // =============================
  // Product CRUD
  // =============================
  @Post('products')
  createProduct(@Req() req, @Body() body) {
    return this.sellerService.createProduct(req.user.id, body);
  }

  @Get('products')
  getMyProducts(@Req() req) {
    return this.sellerService.getMyProducts(req.user.id);
  }

  @Get('products/:id')
  getOne(@Req() req, @Param('id') id: string) {
    return this.sellerService.getProductById(req.user.id, +id);
  }

  @Put('products/:id')
  updateProduct(@Req() req, @Param('id') id: string, @Body() body) {
    return this.sellerService.updateProduct(req.user.id, +id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Req() req, @Param('id') id: string) {
    return this.sellerService.deleteProduct(req.user.id, +id);
  }

  // =============================
  // Orders
  // =============================
  @Get('orders')
  getOrders(@Req() req) {
    return this.sellerService.getSellerOrders(req.user.id);
  }

  @Put('orders/:id/status')
  updateOrder(@Req() req, @Param('id') id, @Body() body) {
    return this.sellerService.updateOrderStatus(+id, req.user.id, body.status);
  }

  // =============================
  // Dashboard
  // =============================
  @Get('dashboard')
  dashboard(@Req() req) {
    return this.sellerService.getDashboard(req.user.id);
  }

  // =============================
  // Messaging - Commented out for MVP
  // =============================
  // @Get('conversations')
  // conversations(@Req() req) {
  //   return this.sellerService.getConversations(req.user.id);
  // }

  // @Get('conversations/:id/messages')
  // messages(@Req() req, @Param('id') id: string) {
  //   return this.sellerService.getMessages(+id, req.user.id);
  // }

  // @Post('conversations/:id/messages')
  // sendMessage(@Req() req, @Param('id') id: string, @Body() body) {
  //   return this.sellerService.sendMessage(+id, req.user.id, body.content);
  // }
}
