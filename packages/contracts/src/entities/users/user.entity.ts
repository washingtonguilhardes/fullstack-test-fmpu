export interface UserEntity {
  _id: string; // ObjectId as string
  email: string;
  password_hash: string;
  full_name: string;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string; // Will be hashed
  full_name: string;
  avatar_url?: string;
}

export interface UpdateUserDto {
  full_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

export interface UpdatePasswordDto {
  current_password: string;
  new_password: string;
}
