
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DriveappRestModule } from './base/driveapp-rest';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DriveappRestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
