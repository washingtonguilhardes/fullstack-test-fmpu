import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountModule } from './domains/account';
import { ArtifactoryModule } from './domains/artifactory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AccountModule,
    ArtifactoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
