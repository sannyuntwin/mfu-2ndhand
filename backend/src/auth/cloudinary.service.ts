import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `mfu-marketplace/${folder}`,
        resource_type: 'image' as const,
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { format: 'webp' }
        ],
      };

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      ).end(file.buffer);
    });
  }

  async uploadImages(files: Express.Multer.File[], folder: string = 'products'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw error;
    }
  }

  async deleteImages(publicIds: string[]): Promise<any[]> {
    const deletePromises = publicIds.map(publicId => this.deleteImage(publicId));
    return Promise.all(deletePromises);
  }

  // Extract public ID from Cloudinary URL for deletion
  extractPublicId(url: string): string {
    // Extract from URL like: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/mfu-marketplace/products/filename.jpg
    const parts = url.split('/');
    const publicIdIndex = parts.findIndex(part => part === 'upload');
    if (publicIdIndex !== -1 && parts.length > publicIdIndex + 1) {
      // Skip the version number (v1234567890) and get the rest
      const pathParts = parts.slice(publicIdIndex + 2); // Skip 'upload' and version number
      return pathParts.join('/').split('.')[0]; // Remove file extension
    }
    return url; // fallback
  }

  // Get optimized image URL
  getOptimizedUrl(url: string, width?: number, height?: number): string {
    if (!width && !height) return url;
    
    const transformation = [];
    if (width) transformation.push(`w_${width}`);
    if (height) transformation.push(`h_${height}`);
    transformation.push('c_limit', 'q_auto');
    
    // Insert transformation into URL
    return url.replace('/upload/', `/upload/${transformation.join(',')}/`);
  }
}