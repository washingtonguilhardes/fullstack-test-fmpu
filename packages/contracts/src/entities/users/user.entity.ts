export interface UserEntity {
  _id?: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  email: string;
  password: string; // Will be hashed
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
