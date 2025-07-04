import { UserModule } from '@/domains/users';
import {
  ValidateUserByCredentialsService,
  ValidateUserByCredentialsServiceRef,
} from '@/domains/users/interfaces';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IssueTokenServiceImpl } from '../../application';
import { IssueTokenServiceRef } from '../../interfaces';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IssueTokenServiceRef,
      useFactory: (
        configService: ConfigService,
        validateUserByCredentialsService: ValidateUserByCredentialsService,
      ) =>
        new IssueTokenServiceImpl(
          configService.get('JWT_SECRET'),
          configService.get('JWT_EXPIRES_IN', '24h'),
          validateUserByCredentialsService,
        ),
      inject: [ConfigService, ValidateUserByCredentialsServiceRef],
    },
  ],
  exports: [IssueTokenServiceRef],
})
export class AuthenticationModule {}
