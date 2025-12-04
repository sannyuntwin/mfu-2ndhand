import { Controller, Get, Post, Delete, Param, UseGuards, Req, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getUserFavorites(@Req() req: Request & { user: { id: number } }) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Post()
  addFavorite(@Body() dto: AddFavoriteDto, @Req() req: Request & { user: { id: number } }) {
    return this.favoritesService.addFavorite(req.user.id, dto.productId);
  }

  @Delete(':productId')
  removeFavorite(@Param('productId') productId: string, @Req() req: Request & { user: { id: number } }) {
    return this.favoritesService.removeFavorite(req.user.id, Number(productId));
  }

  @Get('check/:productId')
  checkFavorite(@Param('productId') productId: string, @Req() req: Request & { user: { id: number } }) {
    return this.favoritesService.isFavorite(req.user.id, Number(productId));
  }
}