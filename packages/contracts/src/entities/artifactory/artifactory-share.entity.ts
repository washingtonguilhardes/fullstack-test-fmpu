import { ArtifactoryType } from './artifactory.entity';

export enum AccessLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}

export interface ArtifactoryShareEntity {
  _id: string; // ObjectId as string
  artifactory_id: string; // ObjectId reference to artifactory._id
  shared_by_user_id: string; // ObjectId reference to users._id
  shared_with_user_id?: string; // ObjectId reference to users._id
  access_token?: string;
  access_level: AccessLevel;
  expires_at?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface CreateArtifactoryShareDto {
  artifactory_id: string;
  shared_by_user_id: string;
  shared_with_user_id?: string;
  access_level: AccessLevel;
  expires_at?: Date;
}

export interface UpdateArtifactoryShareDto {
  access_level?: AccessLevel;
  expires_at?: Date;
  is_active?: boolean;
}

export interface ArtifactoryShareWithDetails extends ArtifactoryShareEntity {
  artifactory?: {
    _id: string;
    name: string;
    type: ArtifactoryType;
    mime_type?: string;
    size?: number;
  };
  shared_by_user?: {
    _id: string;
    full_name: string;
    email: string;
  };
  shared_with_user?: {
    _id: string;
    full_name: string;
    email: string;
  };
}
