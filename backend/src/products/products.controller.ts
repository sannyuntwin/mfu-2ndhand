import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerGuard } from '../auth/guards/seller.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // PUBLIC
  @Get()
  getAllProducts() {
    return this.productsService.getAllActiveApprovedProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  // SELLER ONLY
  @UseGuards(JwtAuthGuard, SellerGuard)
  @Post()
  createProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.productsService.createProduct(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Put(':id')
  updateProduct(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(req.user.id, Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Delete(':id')
  deleteProduct(@Req() req: any, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user.id, Number(id));
  }
}
