import {
  CreateUserService,
  ICreateUserService,
} from '@/domains/users/interfaces/services/create-user';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { User } from '../../domain';
import { UserTransformPipe } from '../pipes';

@Controller('/users/create')
export class CreateUserController {
  constructor(
    @Inject(CreateUserService)
    private readonly createUserService: ICreateUserService,
  ) {}

  @Post()
  async createUser(@Body(UserTransformPipe) user: User) {
    return this.createUserService.execute(user);
  }
}
