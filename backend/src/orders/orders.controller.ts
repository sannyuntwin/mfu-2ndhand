import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ParseIntPipe, ParseEnumPipe, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/dto/authenticated-request.interface';
import { OrderStatus } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: AuthenticatedRequest) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    // Regular users see only their orders, admins see all
    const userId = req.user.role === 'admin' ? undefined : req.user.id;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    // Regular users can only see their own orders, admins can see all
    const userId = req.user.role === 'admin' ? undefined : req.user.id;
    return this.ordersService.findOne(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @Request() req: AuthenticatedRequest,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can update order status');
    }
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }
}