import { createHash } from 'crypto';
import path from 'path';

import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
} from '@azure/storage-blob';

import { File, Path } from '../../../domain';
import { StorageFileAdapter } from '../../../interfaces/storage-file-adapter';

export class AzureStorageAccountAdapter implements StorageFileAdapter {
  static readonly EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day

  constructor(
    private readonly storageAccount: BlobServiceClient,
    private readonly accountName: string,
    private readonly containerName: string = 'files',
  ) {}

  async getTemporaryUrl(bucketPath: string): Promise<string> {
    const userDelegationKey = await this.storageAccount.getUserDelegationKey(
      new Date(),
      new Date(
        new Date().valueOf() + AzureStorageAccountAdapter.EXPIRATION_TIME,
      ), // 1 day expiry
    );
    const sas = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        permissions: BlobSASPermissions.parse('r'),
        blobName: bucketPath,
        expiresOn: new Date(
          Date.now() + AzureStorageAccountAdapter.EXPIRATION_TIME,
        ),
        protocol: SASProtocol.Https,
      },
      userDelegationKey,
      this.accountName,
    );
    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${bucketPath}?${sas.toString()}`;
  }

  async delete(bucketPath: string): Promise<boolean> {
    const containerClient = this.storageAccount.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(bucketPath);
    await blockBlobClient.delete();
    return true;
  }

  async store(file: File, buffer: Buffer): Promise<void> {
    const containerClient = this.storageAccount.getContainerClient(
      this.containerName,
    );
    await containerClient.createIfNotExists();

    const path = file.getPath();

    const bucketPath = path.getValue().split('/').slice(1).join('/');

    const blockBlobClient = containerClient.getBlockBlobClient(bucketPath);
    await blockBlobClient.uploadData(buffer, {
      metadata: {
        checksum: file.getChecksum(),
        mimeType: file.getMimeType(),
        fileName: file.getName(),
        artifactoryId: file.getId(),
      },
      blobHTTPHeaders: {
        blobContentType: file.getMimeType(),
      },
    });
  }
}
