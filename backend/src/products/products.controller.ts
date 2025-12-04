import { Controller, Get, Post, Body, Param, UseGuards, Req, Request, Put, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerGuard } from '../auth/guards/seller.guard';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: Request & { user: { id: number } }) {
    return this.productsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: Request & { user: { id: number } }) {
    return this.productsService.update(Number(id), dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: { id: number } }) {
    return this.productsService.remove(Number(id), req.user.id);
  }
}
