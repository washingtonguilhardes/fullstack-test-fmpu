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
  GetUserByIdServiceImpl,
  IValidateUserService,
  ValidateUserByCredentialsServiceImpl,
  ValidateUserServiceRef,
  ValidateUserServiceImpl,
} from '../../application';
import { UpdateUserServiceImpl } from '../../application/update-user.service';
import {
  GetUserByEmailService,
  GetUserByEmailServiceRef,
  GetUserByIdService,
  GetUserByIdServiceRef,
  UpdateUserServiceRef,
  ValidateUserByCredentialsServiceRef,
} from '../../interfaces';
import { CreateUserServiceRef } from '../../interfaces/services/create-user.service';
import { UserMongooseRepositoryImpl } from '../mongoose/user.repository.impl';
import {
  UserModelName,
  UserMongoose,
  UserMongooseSchema,
} from '../mongoose/user.schema';

export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
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
      provide: ValidateUserServiceRef,
      useFactory: (getUserByEmailService: GetUserByEmailService) =>
        new ValidateUserServiceImpl(getUserByEmailService),
      inject: [GetUserByEmailServiceRef],
    },
    {
      provide: CreateUserServiceRef,
      useFactory: (
        userRepository: IUserRepository,
        validateUserService: IValidateUserService,
      ) => new CreateUserServiceImpl(userRepository, validateUserService),
      inject: [UserRepository, ValidateUserServiceRef],
    },
    {
      provide: GetUserByEmailServiceRef,
      useFactory: (userRepository: IUserRepository) =>
        new GetUserByEmailServiceImpl(userRepository),
      inject: [UserRepository],
    },
    {
      provide: GetUserByIdServiceRef,
      useFactory: (userRepository: IUserRepository) =>
        new GetUserByIdServiceImpl(userRepository),
      inject: [UserRepository],
    },
    {
      provide: ValidateUserByCredentialsServiceRef,
      useFactory: (getUserByEmailService: GetUserByEmailService) =>
        new ValidateUserByCredentialsServiceImpl(getUserByEmailService),
      inject: [GetUserByEmailServiceRef],
    },
    {
      provide: UpdateUserServiceRef,
      useFactory: (
        userRepository: IUserRepository,
        getUserByIdService: GetUserByIdService,
        validateUserService: IValidateUserService,
      ) =>
        new UpdateUserServiceImpl(
          userRepository,
          getUserByIdService,
          validateUserService,
        ),
      inject: [UserRepository, GetUserByIdServiceRef, ValidateUserServiceRef],
    },
  ],
  exports: [
    CreateUserServiceRef,
    GetUserByEmailServiceRef,
    GetUserByIdServiceRef,
    ValidateUserByCredentialsServiceRef,
    UpdateUserServiceRef,
  ],
})
export class UserModule {}
