import { IsNotEmpty, IsString, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  categoryId?: number;
}
