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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BuyerService = class BuyerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 1. GET MY PROFILE
    getMe(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true,
            },
        });
    }
    // 2. UPDATE PROFILE
    updateMe(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                imageUrl: data.imageUrl,
                phone: data.phone,
                address: data.address,
            },
        });
    }
    // 3. GET MY ORDERS
    getMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { buyerId: userId },
            include: {
                items: { include: { product: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // 4. CANCEL ORDER
    async cancelMyOrder(orderId, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.buyerId !== userId)
            throw new common_1.ForbiddenException('Unauthorized');
        if (order.status !== 'PENDING')
            throw new common_1.ForbiddenException('Order cannot be cancelled');
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
    }
    // 5. GET MY CART
    getMyCarts(userId) {
        return this.prisma.cart.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
            },
        });
    }
    // 6. ADD TO CART
    async addToCart(userId, productId, quantity) {
        // Find cart
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
            });
        }
        const existing = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { qty: existing.qty + quantity },
            });
        }
        // product price
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                qty: quantity,
                price: product.price,
            },
        });
    }
    // 7. REMOVE FROM CART
    async removeFromCart(userId, itemId) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });
        if (!item || item.cart.userId !== userId)
            throw new common_1.ForbiddenException('Unauthorized');
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    // 8. CREATE ORDER FROM CART
    async createOrder(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart || cart.items.length === 0)
            throw new Error('Cart is empty');
        const order = await this.prisma.order.create({
            data: {
                buyerId: userId,
                totalAmount: cart.items.reduce((sum, item) => sum + item.price * item.qty, 0),
                items: {
                    create: cart.items.map((i) => ({
                        productId: i.productId,
                        quantity: i.qty,
                        price: i.price,
                    })),
                },
            },
        });
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        return order;
    }
};
exports.BuyerService = BuyerService;
exports.BuyerService = BuyerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BuyerService);
//# sourceMappingURL=buyer.service.js.map