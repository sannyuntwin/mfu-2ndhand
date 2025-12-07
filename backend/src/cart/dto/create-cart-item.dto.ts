import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}