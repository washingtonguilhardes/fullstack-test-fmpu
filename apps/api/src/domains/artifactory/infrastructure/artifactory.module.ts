import { Model } from 'mongoose';

import {
  ArtifactoryRepository,
  ArtifactoryRepositoryRef,
} from '@driveapp/contracts/repositories/artifactory.repository';

import { AuthenticationModule } from '@/domains/authentication/infrastructure/nest/authentication.module';
import { UserModule } from '@/domains/users';
import { ChecksumServiceImpl } from '@/shared';
import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import {
  CreateNewFileServiceImpl,
  GetFolderByIdServiceImpl,
  ListArtifactoryByOwnerServiceImpl,
  ListFilesByPathServiceImpl,
  RemoveFileServiceImpl,
  StoreFileUsecaseImpl,
} from '../application';
import { CreateNewFolderServiceImpl } from '../application/services/create-new-folder.service.impl';
import { ListFoldersByPathServiceImpl } from '../application/services/list-folders-by-path.service.impl';
import {
  StoreFileUsecaseRef,
  StoreFileUsecase,
  StorageFileAdapter,
  CreateNewFileService,
  RemoveFileService,
  GetFolderByIdService,
  CreateNewFileServiceRef,
  StorageFileAdapterRef,
  RemoveFileServiceRef,
  GetFolderByIdServiceRef,
  ListFilesByPathService,
  ListFilesByPathServiceRef,
  ListArtifactoryByOwnerService,
  ListArtifactoryByOwnerServiceRef,
} from '../interfaces';
import { CreateNewFolderServiceRef } from '../interfaces/create-new-folder.service';
import {
  ListFoldersByPathService,
  ListFoldersByPathServiceRef,
} from '../interfaces/list-folders-by-path.service';
import { AzureModule } from './azure/azure.module';
import { ListArtifactoryByOwnerController } from './controllers/list-artifactory-by-owner.controller';
import { NewFolderController } from './controllers/new-folder.controller';
import { UploadController } from './controllers/upload.controller';
import { ArtifactoryMongooseRepositoryImpl } from './mongoose/artifactory.repository.impl';
import {
  ArtifactoryModelName,
  ArtifactoryMongoose,
  ArtifactoryMongooseSchema,
} from './mongoose/artifactory.shema';

@Module({
  controllers: [
    UploadController,
    NewFolderController,
    ListArtifactoryByOwnerController,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ArtifactoryModelName, schema: ArtifactoryMongooseSchema },
    ]),
    AuthenticationModule,
    UserModule,
  ],
  providers: [
    AzureModule.storage(),
    {
      provide: ArtifactoryRepositoryRef,
      useFactory: (artifactoryModel: Model<ArtifactoryMongoose>) =>
        new ArtifactoryMongooseRepositoryImpl(artifactoryModel),
      inject: [getModelToken(ArtifactoryModelName)],
    },
    {
      provide: GetFolderByIdServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new GetFolderByIdServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: ListFilesByPathServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new ListFilesByPathServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: ListFoldersByPathServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new ListFoldersByPathServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: ListArtifactoryByOwnerServiceRef,
      useFactory: (
        artifactoryRepository: ArtifactoryRepository,
        getFolderByIdService: GetFolderByIdService,
      ) =>
        new ListArtifactoryByOwnerServiceImpl(
          artifactoryRepository,
          getFolderByIdService,
        ),
      inject: [ArtifactoryRepositoryRef, GetFolderByIdServiceRef],
    },
    {
      provide: CreateNewFolderServiceRef,
      useFactory: (
        artifactoryRepository: ArtifactoryRepository,
        listFoldersByPathService: ListFoldersByPathService,
      ) =>
        new CreateNewFolderServiceImpl(
          artifactoryRepository,
          listFoldersByPathService,
        ),
      inject: [ArtifactoryRepositoryRef, ListFoldersByPathServiceRef],
    },
    {
      provide: RemoveFileServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new RemoveFileServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: CreateNewFileServiceRef,
      useFactory: (
        artifactoryRepository: ArtifactoryRepository,
        listFilesByPathService: ListFilesByPathService,
      ) =>
        new CreateNewFileServiceImpl(
          artifactoryRepository,
          listFilesByPathService,
        ),
      inject: [ArtifactoryRepositoryRef, ListFilesByPathServiceRef],
    },
    {
      provide: StoreFileUsecaseRef,
      useFactory: (
        storageFileAdapter: StorageFileAdapter,
        createNewFileService: CreateNewFileService,
        removeFileService: RemoveFileService,
        getFolderByIdService: GetFolderByIdService,
      ) =>
        new StoreFileUsecaseImpl(
          storageFileAdapter,
          createNewFileService,
          removeFileService,
          getFolderByIdService,
          new ChecksumServiceImpl(),
        ),
      inject: [
        StorageFileAdapterRef,
        CreateNewFileServiceRef,
        RemoveFileServiceRef,
        GetFolderByIdServiceRef,
      ],
    },
  ],
  exports: [StoreFileUsecaseRef],
})
export class ArtifactoryModule {}
