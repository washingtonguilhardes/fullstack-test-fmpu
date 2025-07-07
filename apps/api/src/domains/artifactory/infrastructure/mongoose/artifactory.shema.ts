import { Document } from 'mongoose';

import {
  ArtifactoryEntity,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ArtifactoryMongoose
  extends Document<string>
  implements ArtifactoryEntity
{
  @Prop({ required: true, enum: ArtifactoryType })
  type: ArtifactoryType;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, default: null, index: true, ref: 'Artifactory' })
  parentId?: string;

  @Prop({ required: true, index: true })
  path: string;

  @Prop({ required: false })
  mimeType?: string;

  @Prop({ required: false })
  checksum?: string;

  @Prop({ required: false })
  size?: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt: Date;

  @Prop({ required: true })
  name: string;
}

export const ArtifactoryModelName = 'Artifactory';

export const ArtifactoryMongooseSchema =
  SchemaFactory.createForClass(ArtifactoryMongoose);
