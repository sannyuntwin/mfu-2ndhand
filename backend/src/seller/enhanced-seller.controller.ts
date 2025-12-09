// Enhanced Seller Order Management Controller
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('seller')
@UseGuards(JwtAuthGuard)
export class EnhancedSellerController {
  constructor(private sellerService: SellerService) {}

  // =============================
  // Enhanced Order Management Endpoints
  // =============================
  @Get('orders/filtered')
  getFilteredOrders(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (page) filters.page = parseInt(page);
    if (limit) filters.limit = parseInt(limit);
    
    return this.sellerService.getSellerOrders(req.user.id, filters);
  }

  @Get('orders/:id/details')
  getOrderDetails(@Req() req: any, @Param('id') id: string) {
    return this.sellerService.getOrderDetails(req.user.id, +id);
  }

  @Post('orders/:id/confirm')
  confirmOrder(
    @Req() req: any, 
    @Param('id') id: string, 
    @Body() body: { pickupLocationId?: string; estimatedReadyDate?: string; notes?: string }
  ) {
    const data: any = {};
    if (body.pickupLocationId) data.pickupLocationId = body.pickupLocationId;
    if (body.estimatedReadyDate) data.estimatedReadyDate = new Date(body.estimatedReadyDate);
    if (body.notes) data.notes = body.notes;
    
    return this.sellerService.confirmOrder(req.user.id, +id, data);
  }

  @Post('orders/:id/reject')
  rejectOrder(
    @Req() req: any, 
    @Param('id') id: string, 
    @Body() body: { reason: string; notes?: string }
  ) {
    return this.sellerService.rejectOrder(req.user.id, +id, body);
  }

  @Get('orders/statistics')
  getOrderStatistics(@Req() req: any) {
    return this.sellerService.getOrderStatistics(req.user.id);
  }

  @Put('orders/:id/advance-status')
  advanceOrderStatus(
    @Req() req: any, 
    @Param('id') id: string, 
    @Body() body: { status: string; trackingNumber?: string; estimatedDelivery?: string; notes?: string }
  ) {
    const data: any = {};
    if (body.trackingNumber) data.trackingNumber = body.trackingNumber;
    if (body.estimatedDelivery) data.estimatedDelivery = new Date(body.estimatedDelivery);
    if (body.notes) data.notes = body.notes;
    
    return this.sellerService.updateOrderStatus(+id, req.user.id, body.status, data);
  }

  // =============================
  // Pickup Location Management
  // =============================
  @Get('pickup-locations')
  getPickupLocations(@Req() req: any) {
    return this.sellerService.getPickupLocations(req.user.id);
  }

  @Post('pickup-locations')
  createPickupLocation(@Req() req: any, @Body() body: {
    name: string;
    address: string;
    contactPhone?: string;
    instructions?: string;
    isDefault?: boolean;
  }) {
    return this.sellerService.createPickupLocation(req.user.id, body);
  }

  @Put('pickup-locations/:id')
  updatePickupLocation(@Req() req: any, @Param('id') id: string, @Body() body: {
    name?: string;
    address?: string;
    contactPhone?: string;
    instructions?: string;
    isDefault?: boolean;
  }) {
    return this.sellerService.updatePickupLocation(req.user.id, +id, body);
  }

  @Delete('pickup-locations/:id')
  deletePickupLocation(@Req() req: any, @Param('id') id: string) {
    return this.sellerService.deletePickupLocation(req.user.id, +id);
  }

  @Put('pickup-locations/:id/set-default')
  setDefaultPickupLocation(@Req() req: any, @Param('id') id: string) {
    return this.sellerService.setDefaultPickupLocation(req.user.id, +id);
  }
}