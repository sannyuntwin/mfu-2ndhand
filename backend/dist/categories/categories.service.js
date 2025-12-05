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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Public — Get all categories including children
     */
    async getAllCategories() {
        return this.prisma.category.findMany({
            include: {
                children: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    /**
     * Admin — Create category (supports parent category)
     */
    async createCategory(dto) {
        return this.prisma.category.create({
            data: {
                name: dto.name,
                description: dto.description,
                parentId: dto.parentId ?? null,
            },
        });
    }
    /**
     * Admin — Update category
     */
    async updateCategory(id, dto) {
        await this.checkExists(id);
        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                parentId: dto.parentId ?? null,
            },
        });
    }
    /**
     * Admin — Delete category
     */
    async deleteCategory(id) {
        await this.checkExists(id);
        return this.prisma.category.delete({
            where: { id },
        });
    }
    /**
     * Utility — Check if category exists
     */
    async checkExists(id) {
        const exists = await this.prisma.category.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Category not found');
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map