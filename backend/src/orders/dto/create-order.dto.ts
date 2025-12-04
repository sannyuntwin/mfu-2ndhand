import { IsArray, IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  items!: CreateOrderItemDto[];
}