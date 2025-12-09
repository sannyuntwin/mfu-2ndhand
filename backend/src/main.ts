import { NestFactory } from '@nestjs/core';
// Updated timestamp: 2025-12-09
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Compression
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      message: 'Too many requests, try again later.',
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS - Updated for production deployment
  app.enableCors({
    origin: (origin, cb) => {
      const whitelist = [
        'http://localhost:3000',
        'http://localhost:5173',
        configService.get('CORS_ORIGIN'),
        'https://mfu-2ndhand-seven.vercel.app',
        'https://mfu-2ndhand.vercel.app',
        'https://mfu-2ndhand.onrender.com',
      ];
      if (!origin || whitelist.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('MFU 2ndHand Marketplace API')
    .setDescription('API Documentation for MFU Marketplace')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Check Cloudinary configuration on startup
  console.log('🔧 Cloudinary Configuration Check:');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '❌ Missing');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '❌ Missing');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '❌ Missing');

  // Start Server
  const port = configService.get<number>('PORT') || 5000;
  await app.listen(port);

  console.log(`🚀 Server running at: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger docs at: http://localhost:${port}/docs`);
}
bootstrap();
