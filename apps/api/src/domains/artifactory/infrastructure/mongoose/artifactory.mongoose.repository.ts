import { Document } from 'mongoose';

import {
  ArtifactoryEntity,
  CreateArtifactoryDto,
  UpdateArtifactoryDto,
  ArtifactoryWithUser,
  ArtifactoryWithParent,
  ArtifactoryWithChildren,
  ArtifactoryWithStats,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { IArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { Schema } from '@nestjs/mongoose';

@Schema()
export class ArtifactoryMongooseSchema extends Document {}
