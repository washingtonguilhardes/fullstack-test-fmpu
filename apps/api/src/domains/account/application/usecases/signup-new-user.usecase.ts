import { AuthenticationPayloadImpl } from '@/domains/authentication/domain/auth.domain.impl';
import {
  IssueTokenService,
  ValidateTokenService,
} from '@/domains/authentication/interfaces';
import { Email, Password, User } from '@/domains/users';
import { ICreateUserService } from '@/domains/users/interfaces/services/create-user.service';

import { ISignupNewAccountUsecase } from '../../interfaces/signup-new-account.inteface';

export class SignupNewUserUsecase implements ISignupNewAccountUsecase {
  constructor(
    private readonly createUserService: ICreateUserService,
    private readonly issueTokenService: IssueTokenService,
  ) {}

  async execute(
    email: Email,
    password: Password,
    firstName: string,
    lastName: string,
  ): Promise<[User, string]> {
    const user = await this.createUserService.execute(
      email,
      password,
      firstName,
      lastName,
    );
    const token = await this.issueTokenService.execute(
      new AuthenticationPayloadImpl(email, password),
    );
    return [user, token];
  }
}
