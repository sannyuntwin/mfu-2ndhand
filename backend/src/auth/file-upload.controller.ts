import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    try {
      if (!files || files.length === 0) {
        return { success: false, message: 'No files uploaded' };
      }

      // Upload all images to Cloudinary
      const uploadedUrls = await this.cloudinaryService.uploadImages(files, 'products');

      return {
        success: true,
        urls: uploadedUrls,
        count: uploadedUrls.length,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: 'Failed to upload images',
        error: error.message,
      };
    }
  }

  @Post('single-image')
  @UseInterceptors(FilesInterceptor('image', 1))
  async uploadSingleImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    try {
      if (!files || files.length === 0) {
        return { success: false, message: 'No file uploaded' };
      }

      const uploadedUrl = await this.cloudinaryService.uploadImage(files[0], 'products');

      return {
        success: true,
        url: uploadedUrl,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: 'Failed to upload image',
        error: error.message,
      };
    }
  }
}