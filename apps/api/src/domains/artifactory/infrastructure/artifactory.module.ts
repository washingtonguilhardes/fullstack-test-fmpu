import { Model } from 'mongoose';

import {
  ArtifactoryRepository,
  ArtifactoryRepositoryRef,
} from '@driveapp/contracts/repositories/artifactory.repository';

import { AuthenticationModule } from '@/domains/authentication/infrastructure/nest/authentication.module';
import { UserModule } from '@/domains/users';
import {
  ChecksumServiceImpl,
  OwnershipValidationService,
  OwnershipValidationServiceRef,
  SecurityModule,
} from '@/shared';
import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import {
  CreateNewFileServiceImpl,
  DeleteFileByIdServiceImpl,
  GetFileByIdServiceImpl,
  GetFolderByIdServiceImpl,
  GetFolderByPathServiceImpl,
  ListArtifactoryByOwnerServiceImpl,
  ListFilesByPathServiceImpl,
  MoveArtifactoryServiceImpl,
  RemoveFileServiceImpl,
  RenameArtifactoryServiceImpl,
  StoreFileUsecaseImpl,
  UpdateFileServiceImpl,
  UpdateFolderServiceImpl,
} from '../application';
import { CreateNewFolderServiceImpl } from '../application/services/create-new-folder.service.impl';
import { DeleteFolderByIdServiceImpl } from '../application/services/delete-folder-by-id.service.impl';
import { ListFoldersByPathServiceImpl } from '../application/services/list-folders-by-path.service.impl';
import {
  CreateNewFileService,
  CreateNewFileServiceRef,
  DeleteFileByIdServiceRef,
  GetFileByIdService,
  GetFileByIdServiceRef,
  GetFolderByIdService,
  GetFolderByIdServiceRef,
  ListArtifactoryByOwnerServiceRef,
  ListFilesByPathService,
  ListFilesByPathServiceRef,
  MoveArtifactoryServiceRef,
  RemoveFileService,
  RemoveFileServiceRef,
  RemoveFolderServiceRef,
  RenameArtifactoryServiceRef,
  StorageFileAdapter,
  StorageFileAdapterRef,
  StoreFileUsecaseRef,
  UpdateFileService,
  UpdateFileServiceRef,
  UpdateFolderServiceRef,
} from '../interfaces';
import { CreateNewFolderServiceRef } from '../interfaces/create-new-folder.service';
import { DeleteFolderByIdServiceRef } from '../interfaces/delete-folder-by-id.service';
import { GetFolderByPathServiceRef } from '../interfaces/get-folder-by-path.service';
import {
  ListFoldersByPathService,
  ListFoldersByPathServiceRef,
} from '../interfaces/list-folders-by-path.service';
import { AzureModule } from './azure/azure.module';
import { DeleteFileController } from './controllers/delete-file.controller';
import { DeleteFolderController } from './controllers/delete-folder.controller';
import { GetFolderByPathController } from './controllers/get-folder-by-path.controller';
import { ListArtifactoryByOwnerController } from './controllers/list-artifactory-by-owner.controller';
import { MoveArtifactoryController } from './controllers/move-file.controller';
import { NewFolderController } from './controllers/new-folder.controller';
import { RenameFileController } from './controllers/rename-file.controller';
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
    GetFolderByPathController,
    DeleteFileController,
    DeleteFolderController,
    MoveArtifactoryController,
    RenameFileController,
  ],
  imports: [
    SecurityModule,
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
      provide: GetFileByIdServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new GetFileByIdServiceImpl(artifactoryRepository),
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
        ownershipValidationService: OwnershipValidationService,
        getFolderByIdService: GetFolderByIdService,
      ) =>
        new CreateNewFolderServiceImpl(
          artifactoryRepository,
          listFoldersByPathService,
          ownershipValidationService,
          getFolderByIdService,
        ),
      inject: [
        ArtifactoryRepositoryRef,
        ListFoldersByPathServiceRef,
        OwnershipValidationServiceRef,
        GetFolderByIdServiceRef,
      ],
    },
    {
      provide: RemoveFileServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new RemoveFileServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: DeleteFileByIdServiceRef,
      useFactory: (
        getFileByIdService: GetFileByIdService,
        removeFileService: RemoveFileService,
        storageFileAdapter: StorageFileAdapter,
        ownershipValidationService: OwnershipValidationService,
      ) =>
        new DeleteFileByIdServiceImpl(
          getFileByIdService,
          removeFileService,
          storageFileAdapter,
          ownershipValidationService,
        ),
      inject: [
        GetFileByIdServiceRef,
        RemoveFileServiceRef,
        StorageFileAdapterRef,
        OwnershipValidationServiceRef,
      ],
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
    {
      provide: GetFolderByPathServiceRef,
      useFactory: (
        artifactoryRepository: ArtifactoryRepository,
        ownershipValidationService: OwnershipValidationService,
      ) =>
        new GetFolderByPathServiceImpl(
          artifactoryRepository,
          ownershipValidationService,
        ),
      inject: [
        ArtifactoryRepositoryRef,
        ListArtifactoryByOwnerServiceRef,
        OwnershipValidationServiceRef,
      ],
    },
    {
      provide: DeleteFolderByIdServiceRef,
      useFactory: (
        getFolderByIdService,
        listFilesByPathService,
        listFoldersByPathService,
        deleteFileByIdService,
        removeFolderService,
        ownershipValidationService,
      ) => {
        const service = new DeleteFolderByIdServiceImpl(
          getFolderByIdService,
          listFilesByPathService,
          listFoldersByPathService,
          deleteFileByIdService,
          removeFolderService,
          ownershipValidationService,
        );
        // inject itself for recursion
        service['deleteFolderByIdService'] = service;
        return service;
      },
      inject: [
        GetFolderByIdServiceRef,
        ListFilesByPathServiceRef,
        ListFoldersByPathServiceRef,
        DeleteFileByIdServiceRef,
        RemoveFileServiceRef,
        OwnershipValidationServiceRef,
      ],
    },
    {
      provide: UpdateFileServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new UpdateFileServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: UpdateFolderServiceRef,
      useFactory: (artifactoryRepository: ArtifactoryRepository) =>
        new UpdateFolderServiceImpl(artifactoryRepository),
      inject: [ArtifactoryRepositoryRef],
    },
    {
      provide: MoveArtifactoryServiceRef,
      useFactory: (
        getFileByIdService: GetFileByIdService,
        getFolderByIdService: GetFolderByIdService,
        listFilesByPathService: ListFilesByPathService,
        storageFileAdapter: StorageFileAdapter,
        ownershipValidationService: OwnershipValidationService,
        updateFileService: UpdateFileService,
      ) =>
        new MoveArtifactoryServiceImpl(
          getFileByIdService,
          getFolderByIdService,
          listFilesByPathService,
          storageFileAdapter,
          ownershipValidationService,
          updateFileService,
        ),
      inject: [
        GetFileByIdServiceRef,
        GetFolderByIdServiceRef,
        ListFilesByPathServiceRef,
        StorageFileAdapterRef,
        OwnershipValidationServiceRef,
        UpdateFileServiceRef,
      ],
    },
    {
      provide: RenameArtifactoryServiceRef,
      useFactory: (
        getFileByIdService: GetFileByIdService,
        getFolderByIdService: GetFolderByIdService,
        listFilesByPathService: ListFilesByPathService,
        listFoldersByPathService: any,
        storageFileAdapter: StorageFileAdapter,
        ownershipValidationService: OwnershipValidationService,
        updateFileService: UpdateFileService,
        updateFolderService: any,
      ) =>
        new RenameArtifactoryServiceImpl(
          getFileByIdService,
          getFolderByIdService,
          listFilesByPathService,
          listFoldersByPathService,
          storageFileAdapter,
          ownershipValidationService,
          updateFileService,
          updateFolderService,
        ),
      inject: [
        GetFileByIdServiceRef,
        GetFolderByIdServiceRef,
        ListFilesByPathServiceRef,
        ListFoldersByPathServiceRef,
        StorageFileAdapterRef,
        OwnershipValidationServiceRef,
        UpdateFileServiceRef,
        UpdateFolderServiceRef,
      ],
    },
  ],
  exports: [StoreFileUsecaseRef],
})
export class ArtifactoryModule {}
