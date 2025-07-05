import { Email, Password, User } from '@/domains/users';
import { ApplicationException } from '@/shared';

import {
  GetUserByEmailService,
  ValidateUserByCredentialsService,
} from '../interfaces';

export class ValidateUserByCredentialsServiceImpl
  implements ValidateUserByCredentialsService
{
  constructor(private readonly getUserByEmailService: GetUserByEmailService) {}

  async execute(email: Email, password: Password): Promise<User | null> {
    const invalidCredentialsError = ApplicationException.invalidParameter(
      'credentials',
      'Invalid credentials check your email and password and try again',
    );

    const user = await this.getUserByEmailService.execute(email);
    if (!user) {
      throw invalidCredentialsError.setExceptionCode(
        'INVALID_CREDENTIALS_USRNF',
      );
    }

    if (!user.getPassword()) {
      throw invalidCredentialsError.setExceptionCode(
        'INVALID_CREDENTIALS_USRNF',
      );
    }

    const isPasswordValid = await password.isEqualTo(user.getPassword());

    if (!isPasswordValid) {
      throw invalidCredentialsError.setExceptionCode('INVALID_CREDENTIALS_PWD');
    }

    return user;
  }
}
