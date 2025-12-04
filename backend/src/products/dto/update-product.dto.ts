import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  condition?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  tags?: string;
}
