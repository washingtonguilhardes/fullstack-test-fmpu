import { CreateUserDto } from '@driveapp/contracts/entities/users/user.entity';

import { BadRequestException, PipeTransform } from '@nestjs/common';

import { UserImpl, EmailImpl, PasswordImpl } from '../../domain';

export class UserTransformPipe implements PipeTransform {
  transform(value: CreateUserDto) {
    try {
      return new UserImpl(
        new EmailImpl(value.email),
        new PasswordImpl(value.password),
        value.firstName,
        value.lastName,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
