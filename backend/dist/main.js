"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    // Security
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    // Compression
    app.use((0, compression_1.default)());
    // Rate limiting
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        message: 'Too many requests, try again later.',
    }));
    // Global prefix
    app.setGlobalPrefix('api/v1');
    // CORS
    app.enableCors({
        origin: (origin, cb) => {
            const whitelist = [
                'http://localhost:3000',
                'http://localhost:5173',
                configService.get('CORS_ORIGIN'),
            ];
            if (!origin || whitelist.includes(origin)) {
                cb(null, true);
            }
            else {
                cb(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    // Validation Pipes
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    // Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MFU 2ndHand Marketplace API')
        .setDescription('API Documentation for MFU Marketplace')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    // Start Server
    const port = configService.get('PORT') || 5000;
    await app.listen(port);
    console.log(`🚀 Server running at: http://localhost:${port}/api/v1`);
    console.log(`📚 Swagger docs at: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map