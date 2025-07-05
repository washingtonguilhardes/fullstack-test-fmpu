import { UserModule } from '@/domains/users';
import {
  ValidateUserByCredentialsService,
  ValidateUserByCredentialsServiceRef,
} from '@/domains/users/interfaces';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  DecodeTokenServiceImpl,
  IssueTokenServiceImpl,
  ValidateTokenServiceImpl,
} from '../../application';
import {
  SetTokenCookieServiceImpl,
  SetTokenCookieServiceRef,
} from '../../application/token-cookie.service.impl';
import {
  DecodeTokenServiceRef,
  IssueTokenServiceRef,
  ValidateTokenServiceRef,
} from '../../interfaces';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: SetTokenCookieServiceRef,
      useClass: SetTokenCookieServiceImpl,
    },
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
    {
      provide: ValidateTokenServiceRef,
      useFactory: (configService: ConfigService) =>
        new ValidateTokenServiceImpl(configService.get('JWT_SECRET')),
      inject: [ConfigService],
    },
    {
      provide: DecodeTokenServiceRef,
      useFactory: (configService: ConfigService) =>
        new DecodeTokenServiceImpl(configService.get('JWT_SECRET')),
      inject: [ConfigService],
    },
  ],
  exports: [
    IssueTokenServiceRef,
    SetTokenCookieServiceRef,
    ValidateTokenServiceRef,
    DecodeTokenServiceRef,
  ],
})
export class AuthenticationModule {}
