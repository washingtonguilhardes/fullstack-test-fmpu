import { Response } from 'express';

import {
  CreateAccountDto,
  SignupNewAccountResult,
} from '@driveapp/contracts/entities/users/user.entity';

import {
  ISignupNewAccountUsecase,
  SignupNewAccountUsecaseRef,
} from '@/domains/account/interfaces/signup-new-account.inteface';
import {
  SetTokenCookieService,
  SetTokenCookieServiceRef,
} from '@/domains/authentication/application/token-cookie.service.impl';
import { EmailImpl, PasswordImpl } from '@/domains/users';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';

@Controller('/account/register')
export class RegisterController {
  constructor(
    @Inject(SignupNewAccountUsecaseRef)
    private readonly signupNewAccountUsecase: ISignupNewAccountUsecase,
    @Inject(SetTokenCookieServiceRef)
    private readonly setTokenCookieService: SetTokenCookieService,
  ) {}

  @Post()
  async register(
    @Body() createAccountDto: CreateAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignupNewAccountResult> {
    const [user, token] = await this.signupNewAccountUsecase.execute(
      new EmailImpl(createAccountDto.email),
      new PasswordImpl(createAccountDto.password),
      createAccountDto.firstName,
      createAccountDto.lastName,
    );
    this.setTokenCookieService.execute(res, token);
    return {
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
      },
      token,
    };
  }
}
