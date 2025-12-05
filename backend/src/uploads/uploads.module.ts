import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { ImageProcessingService } from './image-processing.service';

@Module({
  controllers: [UploadsController],
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class UploadsModule {}