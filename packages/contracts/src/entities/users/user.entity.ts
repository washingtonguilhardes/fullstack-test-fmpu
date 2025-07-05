export interface UserEntity {
  _id?: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfileEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignupNewAccountResult {
  user: Omit<UserEntity, 'passwordHash' | 'createdAt' | 'updatedAt' | '_id'> & {
    id: string;
  };
  token: string;
}

export interface CreateAccountDto {
  email: string;
  password: string; // Will be hashed
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
