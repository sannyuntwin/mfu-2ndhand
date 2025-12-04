import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerGuard } from '../auth/guards/seller.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('products/:productId')
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
    @GetUser('id') userId: number,
  ) {
    return this.reviewsService.create(productId, userId, dto);
  }

  @Get('products/:productId')
  async findAll(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('includeUnapproved') includeUnapproved?: string,
  ) {
    const includeUnapprovedBool = includeUnapproved === 'true';
    return this.reviewsService.findAll(productId, includeUnapprovedBool);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
    @GetUser('id') userId: number,
  ) {
    return this.reviewsService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.reviewsService.delete(id, userId);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Put(':id/moderate')
  async moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.reviewsService.moderate(id, dto);
  }

  @Get('products/:productId/rating')
  async getProductRating(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('includeUnapproved') includeUnapproved?: string,
  ) {
    const includeUnapprovedBool = includeUnapproved === 'true';
    return this.reviewsService.getProductRating(productId, includeUnapprovedBool);
  }
}