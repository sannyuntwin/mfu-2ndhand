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
}
