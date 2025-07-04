import { AuthenticationPayloadDto } from '@driveapp/contracts/entities/authentication/authentication.entity';

import { AuthenticationPayloadImpl } from '@/domains/authentication/domain/auth.domain.impl';
import { AuthenticationPayload } from '@/domains/authentication/interfaces';
import { EmailImpl, PasswordImpl } from '@/domains/users';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class AuthenticationTransformPipe implements PipeTransform {
  transform(body: AuthenticationPayloadDto): AuthenticationPayload {
    console.log('body', body);
    return new AuthenticationPayloadImpl(
      new EmailImpl(body.email),
      new PasswordImpl(body.password),
    );
  }
}
