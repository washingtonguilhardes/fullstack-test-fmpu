import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { OwnershipValidationService } from '@/shared';
import { ResourceImpl } from '@/shared/security/domain/resource';

import { Folder, FolderFactory } from '../../domain';
import { GetFolderByPathService } from '../../interfaces/get-folder-by-path.service';

export class GetFolderByPathServiceImpl implements GetFolderByPathService {
  constructor(
    private readonly artifactoryRepository: ArtifactoryRepository,
    private readonly ownershipValidationService: OwnershipValidationService,
  ) {}

  async execute(path: string, ownerId: string): Promise<Folder | null> {
    const artifactory = await this.artifactoryRepository.findByPath(path);
    if (!artifactory) {
      return null;
    }
    await this.ownershipValidationService.execute(
      new ResourceImpl([artifactory.userId]),
      ownerId,
    );
    return FolderFactory.fromEntity(artifactory);
  }
}
