import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  StorageFileAdapter,
  StorageFileAdapterRef,
} from '../../interfaces/storage-file-adapter';
import { AzureStorageAccountAdapter } from './storage-account/storage-account.adapter';

export class AzureModule {
  static storage(): Provider<StorageFileAdapter> {
    return {
      provide: StorageFileAdapterRef,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const credential = new ClientSecretCredential(
          configService.get('AZURE_TENANT_ID'),
          configService.get('AZURE_CLIENT_ID'),
          configService.get('AZURE_CLIENT_SECRET'),
        );

        const accountName = configService.get('AZURE_STORAGE_ACCOUNT_NAME');
        const containerName = configService.get('AZURE_STORAGE_CONTAINER_NAME');

        return new AzureStorageAccountAdapter(
          new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            credential,
          ),
          accountName,
          containerName,
        );
      },
    };
  }
}
