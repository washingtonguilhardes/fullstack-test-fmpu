import { AccessToken } from '@/domains/authentication/infrastructure/nest/decorators/access-token.decorator';
import {
  DecodeTokenService,
  DecodeTokenServiceRef,
  ValidateTokenService,
  ValidateTokenServiceRef,
} from '@/domains/authentication/interfaces';
import { EmailImpl, User } from '@/domains/users';
import { GetUserByEmailService } from '@/domains/users/interfaces';
import { GetUserByEmailServiceRef } from '@/domains/users/interfaces/services/get-user-by-email.service';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('/account/whoami')
export class WhoAmIController {
  constructor(
    @Inject(ValidateTokenServiceRef)
    private readonly validateTokenService: ValidateTokenService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByEmailServiceRef)
    private readonly getUserByEmailService: GetUserByEmailService,
  ) {}

  @Get()
  async whoami(@AccessToken() accessToken: string): Promise<User> {
    await this.validateTokenService.execute(accessToken);
    const payload = await this.decodeTokenService.execute(accessToken);
    const user = await this.getUserByEmailService.execute(
      new EmailImpl(payload.getUsername()),
    );
    return user;
  }
}
