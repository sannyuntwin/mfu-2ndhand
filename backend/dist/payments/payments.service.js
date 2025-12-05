"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const omise_1 = __importDefault(require("omise"));
let PaymentsService = class PaymentsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.omise = (0, omise_1.default)({
            secretKey: this.configService.get('OMISE_SECRET_KEY'),
        });
    }
    async createPaymentIntent(userId, orderId, chargeId, qrString) {
        // Verify order belongs to user and is pending
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        if (order.buyerId !== userId)
            throw new common_1.BadRequestException('Unauthorized');
        if (order.paymentStatus !== 'PENDING')
            throw new common_1.BadRequestException('Payment already processed');
        // Create Omise source and charge with PromptPay
        let source;
        let charge;
        try {
            source = await this.omise.sources.create({
                type: 'promptpay',
                amount: Math.round((order.totalAmount || 0) * 100),
                currency: 'thb',
            });
            charge = await this.omise.charges.create({
                amount: Math.round((order.totalAmount || 0) * 100),
                currency: 'thb',
                source: source.id,
                metadata: { orderId: orderId.toString() },
                return_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderId}?success=true`,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Payment creation failed');
        }
        // Use source qr_string
        const finalQrString = source.qr_string || charge.source.qr_string;
        // Create or update payment record
        let payment = order.payment;
        if (!payment) {
            payment = await this.prisma.payment.create({
                data: {
                    orderId,
                    amount: order.totalAmount || 0,
                    stripePaymentIntentId: charge.id,
                    stripeClientSecret: qrString,
                },
            });
        }
        else {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    stripePaymentIntentId: charge.id,
                    stripeClientSecret: qrString,
                },
            });
        }
        if (!finalQrString)
            throw new common_1.BadRequestException('QR string not available');
        return {
            qrString: finalQrString,
            chargeId: charge.id,
        };
    }
    async createQR(amount) {
        let source;
        let charge;
        try {
            source = await this.omise.sources.create({
                type: 'promptpay',
                amount: Math.round(amount * 100),
                currency: 'thb',
            });
            charge = await this.omise.charges.create({
                amount: Math.round(amount * 100),
                currency: 'thb',
                source: source.id,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'QR creation failed');
        }
        return {
            qrString: source.qr_string || charge.source.qr_string,
            chargeId: charge.id,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map