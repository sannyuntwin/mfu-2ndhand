import { Controller, Get, Post, Param, Patch, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req: Request & { user: { id: number } }) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Request & { user: { id: number } },
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Request() req: Request & { user: { id: number } }) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}