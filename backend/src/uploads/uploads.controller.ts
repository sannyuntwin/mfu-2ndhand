import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ImageProcessingService } from './image-processing.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload product image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload'
        }
      }
    }
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }

    try {
      const imageUrl = await this.imageProcessingService.processImage(file);
      return {
        message: 'Image uploaded successfully',
        url: imageUrl,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }
}