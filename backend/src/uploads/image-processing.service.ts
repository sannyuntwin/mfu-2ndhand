import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async processImage(file: Express.Multer.File): Promise<string> {
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Process image with Sharp
    const processedBuffer = await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'product-images',
          public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          format: 'jpg',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(processedBuffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`product-images/${publicId}`);
    } catch (error) {
      console.error(`Failed to delete image:`, error);
    }
  }
}