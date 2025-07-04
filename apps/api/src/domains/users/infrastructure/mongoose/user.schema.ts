import { Document } from 'mongoose';

import { UserEntity } from '@driveapp/contracts/entities/users/user.entity';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserMongoose extends Document<string> implements UserEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserModelName = 'User';

export const UserMongooseSchema = SchemaFactory.createForClass(UserMongoose);
