import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SellerGuard } from '../auth/guards/seller.guard';
import { GetUser } from '../auth/get-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @UseGuards(AdminGuard)
  async getDashboardStats(@GetUser() user: any) {
    return this.adminService.getDashboardStats(user.id);
  }

  @Get('analytics')
  @UseGuards(SellerGuard)
  async getSellerAnalytics() {
    // This would be called by authenticated sellers to get their own analytics
    // The user ID would come from the JWT token
    return { message: 'Seller analytics endpoint - implement user extraction from token' };
  }
}