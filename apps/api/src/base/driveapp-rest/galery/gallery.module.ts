
import { Module } from '@nestjs/common';

import { DriveappGalleryFilePreviewController } from './controllers/gallery-file-preview.controller';
import { DriveappGalleryUploadController } from './controllers/uppload.controller';
@Module({
  imports: [],
  controllers: [
    DriveappGalleryUploadController,
    DriveappGalleryFilePreviewController,
  ],
  providers: [],
})
export class DriveappRestGalleryModule {}
