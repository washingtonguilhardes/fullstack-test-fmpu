
import { Module } from '@nestjs/common';

import { DriveappRestModule } from './base/driveapp-rest/driveapp-rest.module';


@Module({
  imports: [
    DriveappRestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
