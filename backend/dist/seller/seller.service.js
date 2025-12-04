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
exports.SellerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SellerService = class SellerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // =============================
    // 1. Seller Profile
    // =============================
    async getMe(userId) {
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
    async updateMe(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                imageUrl: data.imageUrl,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                imageUrl: true,
                role: true,
            },
        });
    }
    // =============================
    // 2. Products (CRUD)
    // =============================
    async createProduct(userId, dto) {
        return this.prisma.product.create({
            data: {
                title: dto.title,
                description: dto.description,
                price: dto.price,
                imageUrl: dto.imageUrl,
                condition: dto.condition,
                brand: dto.brand,
                tags: dto.tags,
                categoryId: dto.categoryId,
                sellerId: userId,
                isApproved: false, // Admin will approve
            },
        });
    }
    async getMyProducts(userId) {
        return this.prisma.product.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: 'desc' },
            include: { images: true, variants: true },
        });
    }
    async getProductById(userId, id) {
        return this.prisma.product.findFirst({
            where: { id, sellerId: userId },
            include: { images: true, variants: true },
        });
    }
    async updateProduct(userId, id, dto) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException();
        if (product.sellerId !== userId)
            throw new common_1.ForbiddenException('Not your product');
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async deleteProduct(userId, id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException();
        if (product.sellerId !== userId)
            throw new common_1.ForbiddenException('Not your product');
        return this.prisma.product.delete({ where: { id } });
    }
    // =============================
    // 3. Seller Orders
    // =============================
    async getSellerOrders(userId) {
        return this.prisma.order.findMany({
            where: {
                items: {
                    some: { product: { sellerId: userId } },
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
                buyer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(orderId, userId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException();
        const sellerOwnsProduct = order.items.some((item) => item.product.sellerId === userId);
        if (!sellerOwnsProduct)
            throw new common_1.ForbiddenException('Not your order');
        // Validate status is a valid OrderStatus enum value
        const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            throw new common_1.ForbiddenException('Invalid order status');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: status },
        });
    }
    // =============================
    // 4. Dashboard
    // =============================
    async getDashboard(userId) {
        const productCount = await this.prisma.product.count({
            where: { sellerId: userId },
        });
        const orders = await this.prisma.order.findMany({
            where: {
                items: { some: { product: { sellerId: userId } } },
                status: 'DELIVERED',
            },
            include: { items: true },
        });
        const revenue = orders.reduce((total, order) => {
            const sum = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            return total + sum;
        }, 0);
        return {
            productCount,
            deliveredOrders: orders.length,
            revenue,
        };
    }
    // =============================
    // 5. Conversations
    // =============================
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: { sellerId: userId },
            include: { buyer: true, product: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getMessages(conversationId, userId) {
        const convo = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!convo)
            throw new common_1.NotFoundException();
        if (convo.sellerId !== userId)
            throw new common_1.ForbiddenException('Unauthorized');
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessage(conversationId, userId, content) {
        const convo = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!convo)
            throw new common_1.NotFoundException();
        if (convo.sellerId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                content,
            },
        });
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SellerService);
//# sourceMappingURL=seller.service.js.map