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
exports.ImageProcessingService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
let ImageProcessingService = class ImageProcessingService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async processImage(file) {
        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('Invalid file type. Only images are allowed.');
        }
        // Process image with Sharp
        const processedBuffer = await (0, sharp_1.default)(file.buffer)
            .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true,
        })
            .jpeg({ quality: 80 })
            .toBuffer();
        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                folder: 'product-images',
                public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                format: 'jpg',
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result.secure_url);
                }
            }).end(processedBuffer);
        });
    }
    async deleteImage(imageUrl) {
        try {
            // Extract public_id from URL
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary_1.v2.uploader.destroy(`product-images/${publicId}`);
        }
        catch (error) {
            console.error(`Failed to delete image:`, error);
        }
    }
};
exports.ImageProcessingService = ImageProcessingService;
exports.ImageProcessingService = ImageProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImageProcessingService);
//# sourceMappingURL=image-processing.service.js.map