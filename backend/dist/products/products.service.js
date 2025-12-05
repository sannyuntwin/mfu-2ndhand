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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // BUYER VIEW — active + approved only
    async getAllActiveApprovedProducts() {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                isApproved: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // ANYONE
    async getProductById(id) {
        if (!id || isNaN(id)) {
            throw new common_1.NotFoundException('Invalid product ID');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: id },
            include: {
                seller: { select: { id: true, name: true } },
                category: true,
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    // SELLER
    async createProduct(sellerId, dto) {
        return this.prisma.product.create({
            data: {
                ...dto,
                sellerId: sellerId,
                isApproved: false, // pending admin approval
            },
        });
    }
    async updateProduct(sellerId, productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        // seller ownership check
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('This is not your product');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                ...dto,
            },
        });
    }
    async deleteProduct(sellerId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not your product');
        }
        return this.prisma.product.delete({ where: { id: productId } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map