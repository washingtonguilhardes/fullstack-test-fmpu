import { Module } from '@nestjs/common';

import { DriveappRestGalleryModule } from './galery/gallery.module';
@Module({
  imports: [DriveappRestGalleryModule],
})
export class DriveappRestModule {}
