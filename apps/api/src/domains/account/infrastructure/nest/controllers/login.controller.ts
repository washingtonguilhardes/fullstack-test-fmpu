import { Response } from 'express';

import { AuthenticationPayloadDto } from '@driveapp/contracts/entities/authentication/authentication.entity';

import {
  SetTokenCookieService,
  SetTokenCookieServiceRef,
} from '@/domains/authentication/application/token-cookie.service.impl';
import { AuthenticationPayloadImpl } from '@/domains/authentication/domain/auth.domain.impl';
import {
  IssueTokenService,
  IssueTokenServiceRef,
} from '@/domains/authentication/interfaces';
import { EmailImpl, PasswordImpl } from '@/domains/users';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';

@Controller('/account/login')
export class LoginController {
  constructor(
    @Inject(IssueTokenServiceRef)
    private readonly issueTokenService: IssueTokenService,
    @Inject(SetTokenCookieServiceRef)
    private readonly setTokenCookieService: SetTokenCookieService,
  ) {}

  @Post()
  async login(
    @Body() loginDto: AuthenticationPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.issueTokenService.execute(
      new AuthenticationPayloadImpl(
        new EmailImpl(loginDto.email),
        new PasswordImpl(loginDto.password),
      ),
    );
    this.setTokenCookieService.execute(res, token);
    return { token };
  }
}
