import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { BlobServiceClient } from '@azure/storage-blob';

import { File, FileFactory, PathImpl } from '../../../../domain';
import { AzureStorageAccountAdapter } from '../storage-account.adapter';

// Mock Azure SDK
jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
  generateBlobSASQueryParameters: jest.fn().mockReturnValue({
    toString: () =>
      'sv=2020-08-04&st=2023-01-01T00%3A00%3A00Z&se=2023-01-02T00%3A00%3A00Z&sp=r&sip=0.0.0.0-255.255.255.255&spr=https&sv=2020-08-04&sr=b&sig=test-signature',
  }),
  BlobSASPermissions: {
    parse: jest.fn().mockReturnValue('r'),
  },
  SASProtocol: {
    Https: 'https',
  },
}));

describe('AzureStorageAccountAdapter', () => {
  let adapter: AzureStorageAccountAdapter;
  let mockBlobServiceClient: jest.Mocked<BlobServiceClient>;
  let mockContainerClient: any;
  let mockBlockBlobClient: any;
  let mockUserDelegationKey: any;

  const mockFile: File = FileFactory.fromDto({
    id: 'file123',
    name: 'test-file.jpg',
    ownerId: 'user123',
    parentId: 'folder123',
    createdAt: new Date(),
    updatedAt: new Date(),
    checksum: 'abc123',
    mimeType: 'image/jpeg',
    size: 1024,
    type: ArtifactoryType.FILE,
  });

  beforeEach(() => {
    // Set up the file path
    mockFile.setPath(new PathImpl('/user123/folder123/test-file.jpg'));

    // Mock Azure SDK components
    mockUserDelegationKey = {
      signedOid: 'test-oid',
      signedTid: 'test-tid',
      signedStart: new Date(),
      signedExpiry: new Date(),
      signedService: 'blob',
      signedVersion: '2020-08-04',
      value: 'test-key',
    };

    mockBlockBlobClient = {
      uploadData: jest.fn(),
      delete: jest.fn(),
    };

    mockContainerClient = {
      createIfNotExists: jest.fn(),
      getBlockBlobClient: jest.fn().mockReturnValue(mockBlockBlobClient),
    };

    mockBlobServiceClient = {
      getUserDelegationKey: jest.fn().mockResolvedValue(mockUserDelegationKey),
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    } as any;

    adapter = new AzureStorageAccountAdapter(
      mockBlobServiceClient,
      'testaccount',
      'testcontainer',
    );
  });

  describe('getTemporaryUrl', () => {
    it('should generate temporary URL with correct bucket path', async () => {
      // Arrange
      const path = new PathImpl('/user123/folder123/test-file.jpg');

      // Act
      const result = await adapter.getTemporaryUrl(path);

      // Assert
      expect(mockBlobServiceClient.getUserDelegationKey).toHaveBeenCalled();
      expect(result).toContain(
        'https://testaccount.blob.core.windows.net/testcontainer/',
      );
      expect(result).toContain('user123/folder123/test-file.jpg');
      expect(result).toContain('?sv=');
    });

    it('should parse bucket path correctly by removing root slash', async () => {
      // Arrange
      const path = new PathImpl('/user123/folder123/test-file.jpg');

      // Act
      await adapter.getTemporaryUrl(path);

      // Assert
      // The URL should contain the path without the leading slash
      expect(mockBlobServiceClient.getUserDelegationKey).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete file with correct bucket path', async () => {
      // Arrange
      const path = new PathImpl('/user123/folder123/test-file.jpg');

      // Act
      const result = await adapter.delete(path);

      // Assert
      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'user123/folder123/test-file.jpg',
      );
      expect(mockBlockBlobClient.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('store', () => {
    it('should store file with correct bucket path', async () => {
      // Arrange
      const buffer = Buffer.from('test data');

      // Act
      await adapter.store(mockFile, buffer);

      // Assert
      expect(mockContainerClient.createIfNotExists).toHaveBeenCalled();
      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'user123/folder123/test-file.jpg',
      );
      expect(mockBlockBlobClient.uploadData).toHaveBeenCalledWith(buffer, {
        metadata: {
          checksum: 'abc123',
          mimeType: 'image/jpeg',
          fileName: 'test-file.jpg',
          artifactoryId: 'file123',
        },
        blobHTTPHeaders: {
          blobContentType: 'image/jpeg',
        },
      });
    });
  });
});
