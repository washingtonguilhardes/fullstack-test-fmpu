import { CreateUserDto } from '@driveapp/contracts/entities/users/user.entity';

import { EmailImpl, PasswordImpl } from '@/domains';
import {
  CreateUserServiceRef,
  ICreateUserService,
} from '@/domains/users/interfaces/services/create-user.service';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('/users/create')
export class CreateUserController {
  constructor(
    @Inject(CreateUserServiceRef)
    private readonly createUserService: ICreateUserService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserService.execute(
      new EmailImpl(createUserDto.email),
      new PasswordImpl(createUserDto.password),
      createUserDto.firstName,
      createUserDto.lastName,
    );
  }
}
