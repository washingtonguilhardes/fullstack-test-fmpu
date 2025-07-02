export interface UserSessionEntity {
  _id: string; // ObjectId as string
  user_id: string; // ObjectId reference to users._id
  token_hash: string;
  expires_at: Date;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  created_at: Date;
}

export interface CreateUserSessionDto {
  user_id: string;
  token_hash: string;
  expires_at: Date;
  ip_address?: string;
  user_agent?: string;
}

export interface UpdateUserSessionDto {
  is_active?: boolean;
  expires_at?: Date;
}
