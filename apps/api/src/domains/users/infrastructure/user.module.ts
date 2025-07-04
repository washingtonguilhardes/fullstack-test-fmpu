import { Model } from 'mongoose';

import {
  IUserRepository,
  UserRepository,
} from '@driveapp/contracts/repositories/user.repository';

import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import {
  CreateUserServiceImpl,
  GetUserByEmailServiceImpl,
  ValidateUserByCredentialsServiceImpl,
  ValidateUserServiceImpl,
} from '../application';
import {
  GetUserByEmailService,
  GetUserByEmailServiceRef,
  ValidateUserByCredentialsServiceRef,
} from '../interfaces';
import { CreateUserServiceRef } from '../interfaces/services/create-user.service';
import { CreateUserController } from './controllers/create-user.controller';
import { UserMongooseRepositoryImpl } from './mongoose/user.repository.impl';
import {
  UserModelName,
  UserMongoose,
  UserMongooseSchema,
} from './mongoose/user.schema';

export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  controllers: [CreateUserController],
  imports: [
    MongooseModule.forFeature([
      { name: UserModelName, schema: UserMongooseSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useFactory: (userModel: Model<UserMongoose>) =>
        new UserMongooseRepositoryImpl(userModel),
      inject: [getModelToken(UserModelName)],
    },
    {
      provide: CreateUserServiceRef,
      useFactory: (userRepository: IUserRepository) =>
        new CreateUserServiceImpl(
          userRepository,
          new ValidateUserServiceImpl(userRepository),
        ),
      inject: [UserRepository],
    },
    {
      provide: GetUserByEmailServiceRef,
      useFactory: (userRepository: IUserRepository) =>
        new GetUserByEmailServiceImpl(userRepository),
      inject: [UserRepository],
    },
    {
      provide: ValidateUserByCredentialsServiceRef,
      useFactory: (getUserByEmailService: GetUserByEmailService) =>
        new ValidateUserByCredentialsServiceImpl(getUserByEmailService),
      inject: [GetUserByEmailServiceRef],
    },
  ],
  exports: [
    CreateUserServiceRef,
    GetUserByEmailServiceRef,
    ValidateUserByCredentialsServiceRef,
  ],
})
export class UserModule {}
