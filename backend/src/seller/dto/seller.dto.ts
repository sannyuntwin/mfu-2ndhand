import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

//
// =====================
// PRODUCT CREATION DTO
// =====================
//
export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  condition?: string; // NEW, GOOD, USED

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  images?: string[];  // array of URLs
}

//
// =====================
// PRODUCT UPDATE DTO
// =====================
//
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  images?: string[]; // updated images
}

//
// =====================
// ADD PRODUCT VARIANT
// =====================
//
export class AddVariantDto {
  @IsString()
  name: string; // Size, Color, etc.

  @IsString()
  value: string; // Large, Red, XL…

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNumber()
  stock: number;
}

//
// =====================
// UPDATE VARIANT DTO
// =====================
//
export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;
}

//
// =====================
// ORDER STATUS UPDATE
// =====================
//
export class UpdateOrderStatusDto {
  @IsString()
  status: string; // CONFIRMED, SHIPPED, DELIVERED
}
