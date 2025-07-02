
export interface UserEntity {
  id: string;
  email: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
