import { Model } from 'mongoose';

import { UserEntity } from '@driveapp/contracts/entities/users/user.entity';
import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { UserMongoose } from './user.schema';

export class UserMongooseRepositoryImpl implements IUserRepository {
  constructor(private readonly userModel: Model<UserMongoose>) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    console.log(user);
    const userDocument = new this.userModel(user);
    await userDocument.save();
    return userDocument.toObject();
  }

  update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Error deleting user');
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id);
    return user ? user.toObject() : null;
  }
}
