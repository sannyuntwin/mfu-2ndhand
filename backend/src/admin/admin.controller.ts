import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() body: { name: string; email: string; password: string; role: string }) {
    return this.adminService.createUser(body);
  }

  @Put('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(+id, role);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Post('products')
  createProduct(@Body() body: { title: string; description: string; price: number; imageUrl?: string; sellerId: number }) {
    return this.adminService.createProduct(body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(+id);
  }

  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Post('orders')
  createOrder(@Body() body: { buyerId: number; totalAmount: number; items: { productId: number; quantity: number; price: number }[] }) {
    return this.adminService.createOrder(body);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(+id, status);
  }

  @Put('orders/:id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.adminService.cancelOrder(+id);
  }
}