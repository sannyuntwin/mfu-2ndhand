import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BuyerModule } from './buyer/buyer.module';
import { ProductsModule } from './products/products.module';
import { SellerModule } from './seller/seller.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BuyerModule,
    ProductsModule,
    SellerModule,
    CategoriesModule,
  ],
})
export class AppModule {}
