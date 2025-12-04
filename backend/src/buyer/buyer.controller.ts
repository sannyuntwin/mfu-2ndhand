import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('buyer')
@UseGuards(JwtAuthGuard)
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  // GET /buyer/me
  @Get('me')
  getMe(@Req() req: any) {
    return this.buyerService.getMe(req.user.id);
  }

  // PUT /buyer/me
  @Put('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.buyerService.updateMe(req.user.id, body);
  }

  // GET /buyer/orders
  @Get('orders')
  getMyOrders(@Req() req: any) {
    return this.buyerService.getMyOrders(req.user.id);
  }
}
