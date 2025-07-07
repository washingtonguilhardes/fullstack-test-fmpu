import console from 'console';
import { FilterQuery, Model } from 'mongoose';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ArtifactoryMongoose } from './artifactory.shema';

export class ArtifactoryMongooseRepositoryImpl
  implements ArtifactoryRepository
{
  constructor(private readonly artifactoryModel: Model<ArtifactoryMongoose>) {}

  async findAllByPath(path: string): Promise<ArtifactoryEntity[]> {
    const query: FilterQuery<ArtifactoryMongoose> = {
      path: { $regex: `^${path}` },
    };
    return this.artifactoryModel.find(query).lean();
  }

  findAllByUserIdAndPath(
    userId: string,
    path: string | null,
    root?: boolean,
  ): Promise<ArtifactoryEntity[]> {
    const query: FilterQuery<ArtifactoryMongoose> = {
      userId,
      path: { $regex: `^${path}` },
      ...(root ? { parentId: null } : {}),
    };
    console.log({ query });
    return this.artifactoryModel.find(query).lean();
  }

  findAllByUserIdPathAndName(
    userId: string,
    path: string,
    namePattern: string,
    root?: boolean,
  ): Promise<ArtifactoryEntity[]> {
    const query: FilterQuery<ArtifactoryMongoose> = {
      userId,
      path: { $regex: `^${path}` },
      name: { $regex: `^${namePattern}`, $options: 'i' },
      ...(root ? { parentId: { $exists: false } } : {}),
    };
    return this.artifactoryModel.find(query).lean();
  }

  findById(id: string): Promise<ArtifactoryEntity | null> {
    return this.artifactoryModel.findById(id).lean();
  }

  findByPath(path: string): Promise<ArtifactoryEntity | null> {
    return this.artifactoryModel.findOne({ path }).lean();
  }

  async create(artifactory: ArtifactoryEntity): Promise<ArtifactoryEntity> {
    console.log({ artifactory });
    const artifactoryDocument = new this.artifactoryModel(artifactory);
    await artifactoryDocument.save();
    return artifactoryDocument.toObject();
  }

  async update(
    id: string,
    artifactory: Partial<ArtifactoryEntity>,
  ): Promise<ArtifactoryEntity> {
    const doc = await this.artifactoryModel.findByIdAndUpdate(id, artifactory);
    if (!doc) {
      throw new Error('Error updating artifactory');
    }
    return doc.toObject();
  }

  async delete(ids: string[]): Promise<void> {
    await this.artifactoryModel.deleteMany({ _id: { $in: ids } });
  }
}
