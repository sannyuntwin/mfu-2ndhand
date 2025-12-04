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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerController = void 0;
const common_1 = require("@nestjs/common");
const buyer_service_1 = require("./buyer.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BuyerController = class BuyerController {
    constructor(buyerService) {
        this.buyerService = buyerService;
    }
    // ================================
    // 1. GET /buyer/me
    // ================================
    getMe(req) {
        return this.buyerService.getMe(req.user.id);
    }
    // ================================
    // 2. PUT /buyer/me
    // ================================
    updateMe(req, body) {
        return this.buyerService.updateMe(req.user.id, body);
    }
    // ================================
    // 3. GET /buyer/orders
    // ================================
    getMyOrders(req) {
        return this.buyerService.getMyOrders(req.user.id);
    }
    // ================================
    // 4. POST /buyer/orders/:id/cancel
    // ================================
    cancelMyOrder(req, orderId) {
        return this.buyerService.cancelMyOrder(Number(orderId), req.user.id);
    }
    // ================================
    // 5. GET /buyer/carts
    // ================================
    getMyCarts(req) {
        return this.buyerService.getMyCarts(req.user.id);
    }
    // ================================
    // 6. POST /buyer/carts
    // Body: { productId, qty }
    // ================================
    addToCart(req, body) {
        return this.buyerService.addToCart(req.user.id, body.productId, body.qty || 1);
    }
    // ================================
    // 7. DELETE /buyer/carts/:itemId
    // ================================
    removeFromCart(req, itemId) {
        return this.buyerService.removeFromCart(req.user.id, Number(itemId));
    }
    // ================================
    // 8. POST /buyer/orders  (Create order)
    // ================================
    createOrder(req) {
        return this.buyerService.createOrder(req.user.id);
    }
};
exports.BuyerController = BuyerController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Post)('orders/:id/cancel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "cancelMyOrder", null);
__decorate([
    (0, common_1.Get)('carts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "getMyCarts", null);
__decorate([
    (0, common_1.Post)('carts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Delete)('carts/:itemId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BuyerController.prototype, "createOrder", null);
exports.BuyerController = BuyerController = __decorate([
    (0, common_1.Controller)('buyer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [buyer_service_1.BuyerService])
], BuyerController);
//# sourceMappingURL=buyer.controller.js.map