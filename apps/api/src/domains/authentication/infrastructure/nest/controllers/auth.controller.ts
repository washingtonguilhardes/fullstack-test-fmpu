import {
  AuthenticationPayload,
  IssueTokenService,
  IssueTokenServiceRef,
} from '@/domains/authentication/interfaces';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { AuthenticationTransformPipe } from '../pipes/authentication-transform.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(IssueTokenServiceRef)
    private readonly issueTokenService: IssueTokenService,
  ) {}

  @Post('login')
  async login(
    @Body(AuthenticationTransformPipe) payload: AuthenticationPayload,
  ) {
    const token = await this.issueTokenService.execute(payload);
    return { token };
  }
}
