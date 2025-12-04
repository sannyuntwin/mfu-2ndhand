import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('condition') condition?: string,
    @Query('brand') brand?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.search({
      q,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      condition,
      brand,
      page,
      limit,
    });
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiResponse({ status: 200, description: 'Trending products' })
  async getTrendingProducts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.searchService.getTrendingProducts(limitNum);
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended products for user' })
  @ApiResponse({ status: 200, description: 'Recommended products' })
  async getRecommendedProducts(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.searchService.getRecommendedProducts(parseInt(userId), limitNum);
  }
}